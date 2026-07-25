import Link from "next/link";

import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/database/settings";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  if (!settings) return <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8"><Link href="/admin" className="text-sm font-bold text-blue-700">← Dashboard</Link><h1 className="mt-3 text-4xl font-extrabold text-slate-950">Settings</h1><p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">The settings document has not been initialized.</p></main>;
  return <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
    <Link href="/admin" className="text-sm font-bold text-blue-700">← Dashboard</Link>
    <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Settings</h1>
    <p className="mt-3 max-w-2xl leading-7 text-slate-600">Manage global business, website, email, quotation, and maintenance configuration.</p>
    <SettingsForm settings={settings} />
  </main>;
}
