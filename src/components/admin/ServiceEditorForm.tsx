"use client";

import { useActionState, useState } from "react";
import { Save, Trash2 } from "lucide-react";

import { deleteService, saveService } from "@/app/admin/(protected)/services/actions";
import ServiceIcon, { serviceIconNames } from "@/components/services/ServiceIcon";
import type { LocalizedService } from "@/lib/database/services";
import { LocalizedField, LocalizedListField } from "@/components/admin/LocalizedFields";

const input = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

export default function ServiceEditorForm({ service }: { service?: LocalizedService }) {
  const [state, action, pending] = useActionState(saveService, undefined);
  const [icon, setIcon] = useState(service?.icon ?? "Truck");
  return <form action={action} className="grid gap-5 sm:grid-cols-2">
    <input type="hidden" name="id" value={service?.id ?? ""} />
    <LocalizedField name="title" label="Title" value={service?.title} maxLength={140} />
    <Field name="slug" label="Slug" value={service?.slug} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
    <LocalizedField name="subtitle" label="Subtitle / price badge" value={service?.subtitle} maxLength={100} />
    <label><span className="text-sm font-bold text-slate-700">Icon</span><div className="mt-2 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-blue-700"><ServiceIcon name={icon} className="h-6 w-6" /></span><select name="icon" value={icon} onChange={event => setIcon(event.target.value)} className={`${input} mt-0`}>{serviceIconNames.map(name => <option key={name} value={name}>{name}</option>)}</select></div></label>
    <LocalizedField name="description" label="Description" value={service?.description} textarea maxLength={1200} />
    <LocalizedListField name="features" label="Feature bullets" value={service?.features} />
    <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Image URL (optional)</span><input type="url" name="image" defaultValue={service?.image ?? ""} className={input} /></label>
    <LocalizedField name="seoTitle" label="SEO title" value={service?.seoTitle} maxLength={70} />
    <Field name="displayOrder" label="Display order" value={String(service?.displayOrder ?? 0)} type="number" min="0" />
    <LocalizedField name="seoDescription" label="SEO description" value={service?.seoDescription} textarea rows={3} maxLength={180} />
    <label className="flex items-center gap-3 font-bold text-slate-800"><input type="checkbox" name="published" defaultChecked={service?.published} className="h-5 w-5" />Published</label>
    <div className="flex flex-wrap justify-end gap-3 sm:col-span-2">
      {service && <button formAction={deleteService} formNoValidate onClick={event => { if (!window.confirm("Delete this service permanently?")) event.preventDefault(); }} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-bold text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" />Delete</button>}
      <button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-60"><Save className="h-4 w-4" />{pending ? "Saving…" : service ? "Save service" : "Create service"}</button>
    </div>
    {state && <p aria-live="polite" className={`sm:col-span-2 text-sm font-bold ${state.status === "success" ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>}
  </form>;
}

function Field({ name, label, value, ...props }: { name: string; label: string; value?: string; type?: string; min?: string; maxLength?: number; pattern?: string }) {
  return <label><span className="text-sm font-bold text-slate-700">{label}</span><input name={name} defaultValue={value ?? ""} required className={input} {...props} /></label>;
}
