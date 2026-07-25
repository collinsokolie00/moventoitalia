"use client";

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { firebaseAuth, firebaseClientConfigurationStatus } from "@/lib/firebase/client";

type SessionResponse = {
  success: boolean;
  code?: string;
  stage?: string;
};

type AuthStage =
  | "client-persistence"
  | "google-popup"
  | "firebase-id-token"
  | "session-request"
  | "session-response"
  | "admin-redirect";

type SafeAuthDiagnostic = {
  type: string;
  isError: boolean;
  isFirebaseError: boolean;
  name: string;
  code: string;
  message: string;
  properties: string[];
};

function sanitizeDiagnosticText(value: unknown) {
  return String(value)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/[A-Za-z0-9_-]{40,}/g, "[redacted]")
    .replace(/([?&](?:key|token|code|credential)=)[^&\s]+/gi, "$1[redacted]")
    .slice(0, 240);
}

function safeAuthDiagnostic(error: unknown): SafeAuthDiagnostic {
  const isObject = typeof error === "object" && error !== null;
  const isError = error instanceof Error;
  const isFirebaseError = error instanceof FirebaseError;
  const properties = isObject ? Object.getOwnPropertyNames(error).slice(0, 20) : [];
  const rawCode = isObject && "code" in error ? (error as { code?: unknown }).code : undefined;
  const rawName = isObject && "name" in error ? (error as { name?: unknown }).name : undefined;
  const rawMessage = isObject && "message" in error
    ? (error as { message?: unknown }).message
    : error;

  return {
    type: typeof error,
    isError,
    isFirebaseError,
    name: sanitizeDiagnosticText(rawName ?? (isError ? error.name : "non-error-thrown-value")),
    code: sanitizeDiagnosticText(rawCode ?? "no-code"),
    message: sanitizeDiagnosticText(rawMessage ?? "no-message"),
    properties,
  };
}

function developmentDiagnostic(stage: AuthStage, code: string, message = "") {
  if (process.env.NODE_ENV !== "development") return "";
  return ` Development diagnostic: ${stage} (${code}${message ? `: ${message}` : ""}).`;
}

function messageForError(error: unknown) {
  const code = typeof error === "object" && error !== null && "code" in error
    ? String(error.code)
    : "";

  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "Sign-in was cancelled. Please try again when you are ready.";
  }
  if (code === "auth/popup-blocked") {
    return "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.";
  }
  if (code === "auth/network-request-failed") {
    return "The sign-in service could not be reached. Check your connection and try again.";
  }
  return "We could not sign you in. Please try again.";
}

function messageForResponse(code?: string) {
  if (code === "not-authorized") {
    return "You are not authorized to access the admin.";
  }
  return "The secure admin session could not be created. Please sign in again.";
}

export default function LoginForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn() {
    if (pending) return;

    setPending(true);
    setError("");
    let stage: AuthStage = "google-popup";

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      console.info("[Movento Admin Auth]", {
        stage,
        status: "started",
        ...firebaseClientConfigurationStatus,
      });
      const credential = await signInWithPopup(firebaseAuth, provider);

      console.info("[Movento Admin Auth]", {
        stage,
        status: "completed",
        emailPresent: Boolean(credential.user.email),
        emailVerified: credential.user.emailVerified,
      });
      stage = "firebase-id-token";
      const idToken = await credential.user.getIdToken(true);

      console.info("[Movento Admin Auth]", { stage, status: "completed", tokenPresent: Boolean(idToken) });
      stage = "session-request";
      console.info("[Movento Admin Auth]", { stage, status: "started" });
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      stage = "session-response";
      const result = await response.json().catch(() => ({ success: false })) as SessionResponse;

      console.info("[Movento Admin Auth]", {
        stage,
        status: response.ok && result.success ? "completed" : "failed",
        httpStatus: response.status,
        serverStage: result.stage ?? "not-reported",
        code: result.code ?? "none",
      });

      if (!response.ok || !result.success) {
        setError(`${messageForResponse(result.code)}${developmentDiagnostic(stage, result.code ?? "unknown")}`);
        return;
      }

      stage = "admin-redirect";
      console.info("[Movento Admin Auth]", { stage, status: "started" });
      window.location.replace("/admin");
    } catch (signInError) {
      const diagnostic = safeAuthDiagnostic(signInError);
      console.error("[Movento Admin Auth]", { stage, status: "failed", ...diagnostic });
      setError(`${messageForError(signInError)}${developmentDiagnostic(stage, diagnostic.code, diagnostic.message)}`);
    } finally {
      await signOut(firebaseAuth).catch(() => undefined);
      setPending(false);
    }
  }

  return (
    <div className="mt-8 space-y-5">
      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={handleSignIn}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-4 font-bold text-slate-800 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
          <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.63-2.43l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z" />
          <path fill="#FBBC05" d="M6.39 13.86A6.02 6.02 0 0 1 6.08 12c0-.65.11-1.28.31-1.86V7.52H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.48l3.35-2.62Z" />
          <path fill="#EA4335" d="M12 6.01c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.62C7.18 7.77 9.39 6.01 12 6.01Z" />
        </svg>
        {pending ? "Signing in…" : "Continue with Google"}
      </button>
      <p className="text-center text-xs leading-5 text-slate-500">
        Access is restricted to approved Movento administrator accounts.
      </p>
    </div>
  );
}
