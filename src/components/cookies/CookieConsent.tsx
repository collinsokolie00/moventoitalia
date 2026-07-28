"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { localePath, type Locale } from "@/lib/i18n/config";

const storageKey = "movento-cookie-consent-v1";
const cookieName = "movento_cookie_consent";

type Consent = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

function saveConsent(analytics: boolean, marketing: boolean) {
  const consent: Consent = {
    essential: true,
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(storageKey, JSON.stringify(consent));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(consent))}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent("movento:cookie-consent", { detail: consent }));
}

export default function CookieConsent({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const it = locale === "it";

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    const initialOpenTimer = window.setTimeout(() => {
      if (!stored) {
        setOpen(true);
        return;
      }
      try {
        const consent = JSON.parse(stored) as Partial<Consent>;
        setAnalytics(consent.analytics === true);
        setMarketing(consent.marketing === true);
      } catch {
        localStorage.removeItem(storageKey);
        setOpen(true);
      }
    }, 0);
    const reopen = () => {
      setManaging(true);
      setOpen(true);
    };
    window.addEventListener("movento:open-cookie-settings", reopen);
    return () => {
      window.clearTimeout(initialOpenTimer);
      window.removeEventListener("movento:open-cookie-settings", reopen);
    };
  }, []);

  const finish = (nextAnalytics: boolean, nextMarketing: boolean) => {
    saveConsent(nextAnalytics, nextMarketing);
    setOpen(false);
    setManaging(false);
  };

  if (!open) return null;

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-3xl rounded-2xl border border-blue-200 bg-white p-5 text-slate-900 shadow-2xl shadow-blue-950/20 sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <div className="sm:flex sm:items-start sm:justify-between sm:gap-6">
        <div>
          <h2 id="cookie-consent-title" className="text-lg font-extrabold">
            {it ? "Preferenze cookie" : "Cookie preferences"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {it
              ? "Movento utilizza cookie essenziali per il funzionamento del sito. I cookie analitici o di marketing restano disattivati finché non fornisci il consenso."
              : "Movento uses essential cookies to operate this website. Analytics and marketing cookies remain disabled unless you consent."}
            {" "}
            <Link href={localePath(locale, "/cookies")} className="font-semibold text-blue-700 underline underline-offset-2">
              {it ? "Informativa sui cookie" : "Cookie Policy"}
            </Link>
          </p>
        </div>
      </div>

      {managing && (
        <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked disabled className="h-4 w-4" />
            {it ? "Essenziali" : "Essential"}
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} className="h-4 w-4 accent-blue-700" />
            {it ? "Analitici" : "Analytics"}
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} className="h-4 w-4 accent-blue-700" />
            Marketing
          </label>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => finish(true, true)} className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800">
          {it ? "Accetta" : "Accept"}
        </button>
        <button type="button" onClick={() => finish(false, false)} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-blue-400 hover:text-blue-700">
          {it ? "Rifiuta i cookie non essenziali" : "Reject non-essential"}
        </button>
        {managing ? (
          <button type="button" onClick={() => finish(analytics, marketing)} className="rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-bold text-blue-800">
            {it ? "Salva preferenze" : "Save preferences"}
          </button>
        ) : (
          <button type="button" onClick={() => setManaging(true)} className="rounded-full px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50">
            {it ? "Gestisci preferenze" : "Manage preferences"}
          </button>
        )}
      </div>
    </section>
  );
}
