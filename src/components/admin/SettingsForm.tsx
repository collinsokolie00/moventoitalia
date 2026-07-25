"use client";

import { useActionState } from "react";
import { Save, ShieldCheck } from "lucide-react";

import { saveSettings } from "@/app/admin/(protected)/settings/actions";
import type { SiteSettings } from "@/lib/database/settings";

const input = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  return <form action={action} className="mt-8 space-y-7">
    <Section title="Business" description="Names used in metadata, maintenance messaging, and transactional emails.">
      <Field name="legalCompanyName" label="Legal company name" value={settings.legalCompanyName} />
      <Field name="publicTradingName" label="Public trading name" value={settings.publicTradingName} />
    </Section>
    <Section title="Website defaults" description="Fallback metadata and international formatting used across the website.">
      <Field name="defaultSiteTitle" label="Default site title" value={settings.defaultSiteTitle} maxLength={70} />
      <Field name="defaultSiteTitleIt" label="Titolo predefinito — Italiano" value={settings.defaultSiteTitleIt} maxLength={70} required={false} />
      <Field name="siteLocale" label="Site locale" value={settings.siteLocale} placeholder="en-IT" />
      <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Default site description</span><textarea name="defaultSiteDescription" defaultValue={settings.defaultSiteDescription} rows={3} required minLength={20} maxLength={180} className={`${input} resize-y`} /></label>
      <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Descrizione predefinita — Italiano</span><textarea name="defaultSiteDescriptionIt" defaultValue={settings.defaultSiteDescriptionIt} rows={3} maxLength={180} className={`${input} resize-y`} /></label>
      <Field name="defaultSeoImageUrl" label="Default SEO image URL (optional)" value={settings.defaultSeoImageUrl} type="url" required={false} />
      <Field name="defaultCurrency" label="Default currency" value={settings.defaultCurrency} maxLength={3} placeholder="EUR" />
      <Field name="defaultCountry" label="Default country" value={settings.defaultCountry} maxLength={2} placeholder="IT" />
      <Field name="defaultTimeZone" label="Default time zone" value={settings.defaultTimeZone} placeholder="Europe/Rome" />
    </Section>
    <Section title="Email delivery" description="Recipients and public message headers. Resend credentials and sender addresses remain in environment variables.">
      <Field name="contactFormRecipientEmail" label="Contact form recipient" value={settings.contactFormRecipientEmail} type="email" />
      <Field name="quoteNotificationRecipientEmail" label="Quote notification recipient" value={settings.quoteNotificationRecipientEmail} type="email" />
      <Field name="customerEmailSenderName" label="Customer email sender name" value={settings.customerEmailSenderName} />
      <Field name="emailReplyToAddress" label="Email reply-to address" value={settings.emailReplyToAddress} type="email" />
    </Section>
    <Section title="Quote configuration" description="Applied only to new quote requests; existing references are never changed.">
      <Field name="quoteReferencePrefix" label="Quote reference prefix" value={settings.quoteReferencePrefix} maxLength={12} />
    </Section>
    <Section title="Maintenance" description="Public marketing pages show the maintenance screen while admin and API routes remain accessible.">
      <label className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 font-bold text-amber-950 sm:col-span-2"><input type="checkbox" name="maintenanceModeEnabled" defaultChecked={settings.maintenanceModeEnabled} className="h-5 w-5" />Enable maintenance mode</label>
      <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Maintenance message</span><textarea name="maintenanceMessage" defaultValue={settings.maintenanceMessage} rows={4} required minLength={10} maxLength={500} className={`${input} resize-y`} /></label>
      <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Messaggio manutenzione — Italiano</span><textarea name="maintenanceMessageIt" defaultValue={settings.maintenanceMessageIt} rows={4} maxLength={500} className={`${input} resize-y`} /></label>
    </Section>
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-950"><p className="flex items-center gap-2 font-extrabold"><ShieldCheck className="h-5 w-5" />Credentials remain private</p><p className="mt-2">Admin PINs, Firebase credentials, Resend API keys, authentication secrets, and service-account keys are managed only through environment variables and deployment configuration.</p></div>
    <div className="flex justify-end"><button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-60"><Save className="h-4 w-4" />{pending ? "Saving…" : "Save settings"}</button></div>
    {state && <p aria-live="polite" className={`text-sm font-bold ${state.status === "success" ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>}
  </form>;
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-extrabold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p><div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div></section>;
}

function Field({ name, label, value, required = true, ...props }: { name: string; label: string; value: string; required?: boolean; type?: string; maxLength?: number; placeholder?: string }) {
  return <label><span className="text-sm font-bold text-slate-700">{label}</span><input name={name} defaultValue={value} required={required} className={input} {...props} /></label>;
}
