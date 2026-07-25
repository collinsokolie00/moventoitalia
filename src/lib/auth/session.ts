import "server-only";

import { cookies } from "next/headers";

import { adminAuth } from "@/lib/database/firebase-admin";
import { ADMIN_SESSION_COOKIE } from "./session-constants";

export { ADMIN_SESSION_COOKIE } from "./session-constants";

export const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

export type AdminUser = {
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string;
};

function approvedEmails() {
  const value = process.env.ADMIN_EMAILS;
  if (!value) throw new Error("ADMIN_EMAILS is required for admin authentication.");
  return new Set(value.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
}

export function isApprovedAdminEmail(email?: string | null) {
  return Boolean(email && approvedEmails().has(email.trim().toLowerCase()));
}

export function getAdminAllowlistDiagnostic(email?: string | null) {
  const emails = approvedEmails();
  return {
    configured: true,
    entryCount: emails.size,
    selectedEmailPresent: Boolean(email),
    matched: Boolean(email && emails.has(email.trim().toLowerCase())),
  };
}

export const adminSessionOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/admin",
  maxAge: SESSION_DURATION_MS / 1000,
  priority: "high" as const,
};

export async function getAdminSession(): Promise<AdminUser | null> {
  const sessionCookie = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!sessionCookie) {
    if (process.env.NODE_ENV === "development") {
      console.info("[Movento Admin Auth Server]", { stage: "protected-session-cookie", status: "missing" });
    }
    return null;
  }
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!decoded.email || decoded.email_verified !== true || !isApprovedAdminEmail(decoded.email)) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Movento Admin Auth Server]", { stage: "protected-session-authorization", status: "rejected" });
      }
      return null;
    }
    if (decoded.firebase?.sign_in_provider !== "google.com") {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Movento Admin Auth Server]", { stage: "protected-session-provider", status: "rejected" });
      }
      return null;
    }
    if (process.env.NODE_ENV === "development") {
      console.info("[Movento Admin Auth Server]", { stage: "protected-session-verification", status: "completed" });
    }
    return {
      uid: decoded.uid,
      email: decoded.email.toLowerCase(),
      displayName: typeof decoded.name === "string" ? decoded.name : decoded.email.split("@")[0],
      photoUrl: typeof decoded.picture === "string" ? decoded.picture : "",
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
      console.warn("[Movento Admin Auth Server]", {
        stage: "protected-session-verification",
        status: "failed",
        code: /^[a-z0-9_/-]+$/i.test(code) ? code : "unknown",
      });
    }
    return null;
  }
}

export async function isAdminAuthenticated() {
  return (await getAdminSession()) !== null;
}

export async function requireAdmin() {
  const user = await getAdminSession();
  if (!user) throw new Error("Unauthorized");
  return user;
}
