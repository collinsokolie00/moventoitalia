"use client";
import { useActionState } from "react";
import { Save } from "lucide-react";
import { saveContact } from "@/app/admin/(protected)/contact/actions";
import type { ContactContent } from "@/lib/database/contact";
import { LocalizedField } from "./LocalizedFields";
const input="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";
export default function ContactEditorForm({content}:{content:ContactContent|null}){
  const[state,action,pending]=useActionState(saveContact,undefined);
  return <form action={action} className="mt-8 space-y-6">
    <Section title="Contact page">
      <LocalizedField name="heading" label="Contact page heading / Titolo pagina" value={{en:content?.heading??"",it:content?.headingIt??""}} maxLength={180}/>
      <LocalizedField name="introductoryText" label="Introductory text / Testo introduttivo" value={{en:content?.introductoryText??"",it:content?.introductoryTextIt??""}} textarea maxLength={800}/>
      <LocalizedField name="address" label="Company address / Indirizzo aziendale" value={{en:content?.address??"",it:content?.addressIt??""}} maxLength={300}/>
      <div className="grid gap-5 sm:grid-cols-2"><Field name="phone" label="Phone number" value={content?.phone}/><Field name="email" label="Email address" value={content?.email} type="email"/><Field name="whatsapp" label="WhatsApp number" value={content?.whatsapp}/></div>
      <LocalizedField name="callingHours" label="Calling hours / Orari telefonici" value={{en:content?.callingHours??"",it:content?.callingHoursIt??""}} textarea rows={3} maxLength={300}/>
      <Field name="googleMapsUrl" label="Google Maps URL" value={content?.googleMapsUrl} type="url"/><Field name="mapEmbedUrl" label="Map embed URL (optional)" value={content?.mapEmbedUrl} type="url" required={false}/>
    </Section>
    <Section title="Contact form and call to action">
      <LocalizedField name="formHeading" label="Contact form heading / Titolo modulo" value={{en:content?.formHeading??"",it:content?.formHeadingIt??""}} maxLength={180}/>
      <LocalizedField name="formSupportingText" label="Form supporting text / Testo di supporto" value={{en:content?.formSupportingText??"",it:content?.formSupportingTextIt??""}} textarea maxLength={600}/>
      <LocalizedField name="callToActionText" label="Call-to-action text / Testo invito all’azione" value={{en:content?.callToActionText??"",it:content?.callToActionTextIt??""}} textarea maxLength={300}/>
    </Section>
    <div className="sticky bottom-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl">{state&&<p className={`text-sm font-bold ${state.status==="success"?"text-emerald-700":"text-red-700"}`}>{state.message}</p>}<button disabled={pending} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white disabled:opacity-60"><Save className="h-4 w-4"/>{pending?"Saving…":"Save contact"}</button></div>
  </form>;
}
function Section({title,children}:{title:string;children:React.ReactNode}){return <section className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-extrabold">{title}</h2>{children}</section>;}
function Field({name,label,value,required=true,...props}:{name:string;label:string;value?:string;required?:boolean;type?:string}){return <label><span className="text-sm font-bold">{label}</span><input name={name} defaultValue={value??""} required={required} className={input} {...props}/></label>;}
