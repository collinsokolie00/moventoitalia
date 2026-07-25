"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";

import { firebaseAuth } from "@/lib/firebase/client";

export default function AdminLogoutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setPending(true);
    setError("");
    await signOut(firebaseAuth).catch(() => undefined);

    try {
      const response = await fetch("/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      window.location.replace("/admin/login?signedOut=1");
    } catch {
      setError("Could not sign out. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="text-right">
      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/30 disabled:cursor-wait disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        {pending ? "Signing out…" : "Sign out"}
      </button>
      {error && <p role="alert" className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}
