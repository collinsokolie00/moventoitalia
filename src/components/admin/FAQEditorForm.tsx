"use client";
import { useActionState } from "react";
import { Save,Trash2 } from "lucide-react";
import { deleteFAQ,saveFAQ } from "@/app/admin/(protected)/faq/actions";
import type { FAQItem } from "@/lib/database/faqs";
import { LocalizedField } from "./LocalizedFields";
const input="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";
export default function FAQEditorForm({item,categories}:{item?:FAQItem;categories:string[]}){
  const[state,action,pending]=useActionState(saveFAQ,undefined);
  return <form action={action} className="grid gap-5 sm:grid-cols-2">
    <input type="hidden" name="id" value={item?.id??""}/>
    <LocalizedField name="question" label="Question / Domanda" value={{en:item?.question??"",it:item?.questionIt??""}} maxLength={300} />
    <LocalizedField name="answer" label="Answer / Risposta" value={{en:item?.answer??"",it:item?.answerIt??""}} textarea rows={6} maxLength={3000} />
    <LocalizedField name="category" label="Category / Categoria" value={{en:item?.category??"",it:item?.categoryIt??""}} maxLength={120} />
    <label><span className="text-sm font-bold">Display order</span><input name="displayOrder" type="number" min="0" defaultValue={item?.displayOrder??0} required className={input}/></label>
    <LocalizedField name="categoryDescription" label="Category description / Descrizione categoria" value={{en:item?.categoryDescription??"",it:item?.categoryDescriptionIt??""}} textarea rows={2} required={false} maxLength={300} />
    <datalist id="faq-categories">{categories.map(category=><option key={category} value={category}/>)}</datalist>
    <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="published" defaultChecked={item?.published} className="h-5 w-5"/>Published</label>
    <div className="flex justify-end gap-3 sm:col-span-2">{item&&<button formAction={deleteFAQ} formNoValidate onClick={event=>{if(!window.confirm("Delete this FAQ permanently?"))event.preventDefault();}} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-bold text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4"/>Delete</button>}<button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white disabled:opacity-60"><Save className="h-4 w-4"/>{pending?"Saving…":item?"Save FAQ":"Create FAQ"}</button></div>
    {state&&<p className={`sm:col-span-2 text-sm font-bold ${state.status==="success"?"text-emerald-700":"text-red-700"}`}>{state.message}</p>}
  </form>;
}
