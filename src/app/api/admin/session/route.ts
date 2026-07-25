import { NextRequest, NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, SESSION_DURATION_MS, adminSessionOptions, getAdminAllowlistDiagnostic } from "@/lib/auth/session";
import { hasSameOrigin } from "@/lib/auth/same-origin";
import { adminAuth } from "@/lib/database/firebase-admin";

export const runtime = "nodejs";

function logDiagnostic(stage: string, details: Record<string, string | number | boolean>) {
  if (process.env.NODE_ENV === "development") {
    console.info("[Movento Admin Auth Server]", { stage, ...details });
  }
}

function safeErrorCode(error: unknown) {
  const code = typeof error === "object" && error !== null && "code" in error
    ? String(error.code)
    : "unknown";
  return /^[a-z0-9_/-]+$/i.test(code) ? code : "unknown";
}

function failure(stage: string, code: string, status: number) {
  logDiagnostic(stage, { status: "failed", code });
  return NextResponse.json({ success: false, code, stage }, { status });
}

function authorizationFailure(stage: string) {
  logDiagnostic(stage, { status: "failed", code: "not-authorized" });
  return NextResponse.json(
    { success: false, code: "not-authorized" },
    { status: 403 },
  );
}

export async function POST(request: NextRequest) {
  let stage = "session-request";
  logDiagnostic(stage, { status: "received" });
  if (!hasSameOrigin(request)) return failure(stage, "invalid-request", 403);

  try {
    const body = await request.json() as { idToken?: unknown };
    if (typeof body.idToken !== "string" || body.idToken.length < 100 || body.idToken.length > 10000) {
      return failure(stage, "invalid-token", 401);
    }

    logDiagnostic(stage, { status: "completed", tokenPresent: true });
    stage = "firebase-admin-token-verification";
    const decoded = await adminAuth.verifyIdToken(body.idToken, true);
    logDiagnostic(stage, { status: "completed", emailPresent: Boolean(decoded.email), emailVerified: decoded.email_verified === true });

    if (decoded.firebase?.sign_in_provider !== "google.com") {
      return authorizationFailure(stage);
    }
    if (!decoded.email) return authorizationFailure(stage);
    if (decoded.email_verified !== true) return authorizationFailure(stage);

    stage = "admin-email-allowlist";
    const allowlist = getAdminAllowlistDiagnostic(decoded.email);
    logDiagnostic(stage, { status: "checked", ...allowlist });
    if (!allowlist.matched) return authorizationFailure(stage);

    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
      return failure(stage, "recent-login-required", 401);
    }

    stage = "firebase-session-cookie-creation";
    const sessionCookie = await adminAuth.createSessionCookie(body.idToken, { expiresIn: SESSION_DURATION_MS });
    logDiagnostic(stage, { status: "completed" });

    stage = "session-cookie-response";
    const response = NextResponse.json({ success: true, stage });
    response.cookies.set(ADMIN_SESSION_COOKIE, sessionCookie, adminSessionOptions);
    logDiagnostic(stage, { status: "completed", httpOnly: true, secure: adminSessionOptions.secure });
    return response;
  } catch (error) {
    return failure(stage, safeErrorCode(error), 401);
  }
}
