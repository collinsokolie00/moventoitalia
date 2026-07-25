import { NextRequest, NextResponse } from "next/server";

import { hasSameOrigin } from "@/lib/auth/same-origin";
import { ADMIN_SESSION_COOKIE, adminSessionOptions } from "@/lib/auth/session";
import { adminAuth } from "@/lib/database/firebase-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) return NextResponse.json({ success: false }, { status: 403 });

  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie);
      await adminAuth.revokeRefreshTokens(decoded.uid);
    } catch {
      // Invalid and expired sessions are still cleared below.
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { ...adminSessionOptions, maxAge: 0 });
  return response;
}
