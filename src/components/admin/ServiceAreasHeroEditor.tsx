"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";

import { saveServiceAreasHero } from "@/app/admin/(protected)/service-areas/actions";
import AdminImageUploadField from "@/components/admin/AdminImageUploadField";
import type { CmsImage } from "@/lib/database/site-media";

export default function ServiceAreasHeroEditor({ image }: { image: CmsImage }) {
  const [state, action, pending] = useActionState(saveServiceAreasHero, undefined);
  return <form action={action} className="mt-8 grid gap-5 rounded-3xl border border-blue-200 bg-blue-50 p-6 sm:grid-cols-2">
    <div className="sm:col-span-2"><h2 className="text-2xl font-extrabold text-blue-950">Service Areas hero image</h2><p className="mt-2 text-sm text-blue-800">Upload, replace or remove the public page hero background.</p></div>
    <div className="sm:col-span-2"><AdminImageUploadField label="Hero background" folder="service-areas/hero" urlName="serviceAreasHeroUrl" pathName="serviceAreasHeroPath" initialUrl={image.url} initialPath={image.path} /></div>
    <label><span className="text-sm font-bold">Image alt text</span><input name="serviceAreasHeroAlt" defaultValue={image.alt} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
    <label><span className="text-sm font-bold">Testo alternativo — Italiano</span><input name="serviceAreasHeroAltIt" defaultValue={image.altIt} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label>
    <label><span className="text-sm font-bold">Mobile focal position</span><select name="serviceAreasHeroPosition" defaultValue={image.position} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option></select></label>
    <div className="sm:col-span-2"><button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" />{pending ? "Saving…" : "Save hero image"}</button>{state && <p className={`mt-3 text-sm font-bold ${state.status === "success" ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>}</div>
  </form>;
}
