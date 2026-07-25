import Link from "next/link";
import ContactEditorForm from "@/components/admin/ContactEditorForm";
import { getContactContent } from "@/lib/database/contact";
export default async function ContactEditorPage(){const content=await getContactContent();return <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8"><Link href="/admin" className="text-sm font-bold text-blue-700">← Dashboard</Link><h1 className="mt-3 text-4xl font-extrabold">Contact Editor</h1><p className="mt-3 text-slate-600">Manage the shared contact details used by the Contact page and footer.</p>{!content&&<p className="mt-6 rounded-2xl bg-amber-50 p-4 text-amber-900">No contact document exists yet.</p>}<ContactEditorForm content={content}/></main>}
