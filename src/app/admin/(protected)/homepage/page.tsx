import Link from "next/link";

import HomepageEditorForm from "@/components/admin/HomepageEditorForm";
import { getHomepageContent } from "@/lib/database/homepage";

export default async function HomepageEditorPage() {
  const content = await getHomepageContent();

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <Link href="/admin" className="text-sm font-bold text-blue-700">← Dashboard</Link>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">Homepage Editor</h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">Edit the homepage’s primary content. Saving publishes these changes to the website immediately.</p>
      {!content && <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">No homepage document exists yet. Complete the fields below and save to create it.</p>}
      <HomepageEditorForm content={content} />
    </main>
  );
}
