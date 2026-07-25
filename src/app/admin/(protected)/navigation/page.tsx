import Link from "next/link";
import SiteChromeEditorForm from "@/components/admin/SiteChromeEditorForm";
import { getContactContent } from "@/lib/database/contact";
import { getSiteChrome } from "@/lib/database/site-chrome";

export const runtime = "nodejs";

export default async function HeaderFooterEditorPage(){const[chrome,contact]=await Promise.all([getSiteChrome(),getContactContent()]);if(!chrome||!contact)return <main className="mx-auto max-w-5xl px-5 py-10"><p className="rounded-2xl bg-amber-50 p-5 text-amber-900">Header, footer, or contact content is not initialized.</p></main>;return <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8"><Link href="/admin" className="text-sm font-bold text-blue-700">← Dashboard</Link><h1 className="mt-3 text-4xl font-extrabold">Header & Footer Editor</h1><p className="mt-3 text-slate-600">Manage site navigation, branding, footer links, and shared contact details.</p><SiteChromeEditorForm chrome={chrome} contact={contact}/></main>}
