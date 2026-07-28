"use client";

export default function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("movento:open-cookie-settings"))}
      className="text-left transition hover:text-white"
    >
      {label}
    </button>
  );
}
