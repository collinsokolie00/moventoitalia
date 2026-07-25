"use client";

import { useActionState } from "react";
import { Save, Trash2 } from "lucide-react";
import { deleteServiceArea, saveServiceArea } from "@/app/admin/(protected)/service-areas/actions";
import type { ServiceArea } from "@/lib/database/service-areas";
import { LocalizedField } from "./LocalizedFields";

const input = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";
export default function ServiceAreaEditorForm({ area }: { area?: ServiceArea }) {
  const [state, action, pending] = useActionState(saveServiceArea, undefined);
  return <form action={action} className="grid gap-5 sm:grid-cols-2">
    <input type="hidden" name="id" value={area?.id ?? ""} />
    <LocalizedField name="areaName" label="City / area name" value={{en:area?.areaName??"",it:area?.areaNameIt??""}} maxLength={140} />
    <Field name="slug" label="Slug" value={area?.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
    <LocalizedField name="shortDescription" label="Short description / Descrizione breve" value={{en:area?.shortDescription??"",it:area?.shortDescriptionIt??""}} textarea rows={3} maxLength={300} />
    <LocalizedField name="fullDescription" label="Full description / Descrizione completa" value={{en:area?.fullDescription??"",it:area?.fullDescriptionIt??""}} textarea rows={5} maxLength={2000} />
    <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Nearby cities</span><span className="mt-1 block text-xs text-slate-500">One location per line</span><textarea name="nearbyCities" defaultValue={area?.nearbyCities.join("\n") ?? ""} rows={5} className={`${input} resize-y`} /></label>
    <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Località vicine — Italiano</span><span className="mt-1 block text-xs text-slate-500">Una località per riga</span><textarea name="nearbyCitiesIt" defaultValue={area?.nearbyCitiesIt.join("\n") ?? ""} rows={5} className={`${input} resize-y`} /></label>
    <Field name="featuredImage" label="Featured image URL (optional)" value={area?.featuredImage} type="url" required={false} />
    <Field name="mapsUrl" label="Google Maps embed or Maps URL" value={area?.mapsUrl} type="url" />
    <LocalizedField name="availabilityNotes" label="Service availability notes / Note sulla disponibilità" value={{en:area?.availabilityNotes??"",it:area?.availabilityNotesIt??""}} textarea rows={3} required={false} maxLength={600} />
    <LocalizedField name="seoTitle" label="SEO title / Titolo SEO" value={{en:area?.seoTitle??"",it:area?.seoTitleIt??""}} maxLength={70} />
    <Field name="displayOrder" label="Display order" value={String(area?.displayOrder ?? 0)} type="number" min="0" />
    <LocalizedField name="seoDescription" label="SEO description / Descrizione SEO" value={{en:area?.seoDescription??"",it:area?.seoDescriptionIt??""}} textarea rows={3} maxLength={180} />
    <div className="flex flex-wrap gap-6 sm:col-span-2"><label className="flex items-center gap-2 font-bold"><input type="checkbox" name="featured" defaultChecked={area?.featured} className="h-5 w-5" />Featured</label><label className="flex items-center gap-2 font-bold"><input type="checkbox" name="published" defaultChecked={area?.published} className="h-5 w-5" />Published</label></div>
    <div className="flex flex-wrap justify-end gap-3 sm:col-span-2">{area && <button formAction={deleteServiceArea} formNoValidate onClick={event => { if (!window.confirm("Delete this service area permanently?")) event.preventDefault(); }} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-bold text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" />Delete</button>}<button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-60"><Save className="h-4 w-4" />{pending ? "Saving…" : area ? "Save area" : "Create area"}</button></div>
    {state && <p aria-live="polite" className={`sm:col-span-2 text-sm font-bold ${state.status === "success" ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>}
  </form>;
}
function Field({ name, label, value, required = true, ...props }: { name: string; label: string; value?: string; required?: boolean; type?: string; min?: string; maxLength?: number; pattern?: string }) { return <label><span className="text-sm font-bold text-slate-700">{label}</span><input name={name} defaultValue={value ?? ""} required={required} className={input} {...props} /></label>; }
