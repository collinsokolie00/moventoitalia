"use client";

import { useState } from "react";
import { localeNames, locales, type Locale } from "@/lib/i18n/config";
import { normalizeLocalized, type Localizable } from "@/lib/i18n/localized";

const input="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

export function LocalizedField({name,label,value,textarea=false,rows=4,required=true,maxLength}:{name:string;label:string;value?:Localizable<string>;textarea?:boolean;rows?:number;required?:boolean;maxLength?:number}) {
  const [active,setActive]=useState<Locale>("en");
  const values=normalizeLocalized(value,"");
  return <fieldset className="rounded-2xl border border-slate-200 p-4 sm:col-span-2">
    <legend className="px-2 text-sm font-extrabold text-slate-700">{label}</legend>
    <LanguageTabs active={active} onChange={setActive} missing={Object.fromEntries(locales.map(locale=>[locale,!values[locale].trim()])) as Record<Locale,boolean>} />
    {locales.map(locale=><label key={locale} className={locale===active?"mt-4 block":"hidden"}><span className="text-xs font-bold text-slate-500">{localeNames[locale]}</span>{textarea?<textarea name={`${name}.${locale}`} defaultValue={values[locale]} required={required&&locale==="en"} maxLength={maxLength} rows={rows} className={`${input} resize-y`}/>:<input name={`${name}.${locale}`} defaultValue={values[locale]} required={required&&locale==="en"} maxLength={maxLength} className={input}/>}</label>)}
  </fieldset>;
}

export function LocalizedListField({name,label,value,maxLength=160}:{name:string;label:string;value?:Localizable<string[]>;maxLength?:number}) {
  const [active,setActive]=useState<Locale>("en");
  const values=normalizeLocalized(value,[]);
  return <fieldset className="rounded-2xl border border-slate-200 p-4 sm:col-span-2"><legend className="px-2 text-sm font-extrabold text-slate-700">{label}</legend><LanguageTabs active={active} onChange={setActive} missing={Object.fromEntries(locales.map(locale=>[locale,!values[locale].length])) as Record<Locale,boolean>}/>{locales.map(locale=><label key={locale} className={locale===active?"mt-4 block":"hidden"}><span className="text-xs text-slate-500">One item per line / Un elemento per riga</span><textarea name={`${name}.${locale}`} defaultValue={values[locale].join("\n")} required={locale==="en"} rows={5} maxLength={maxLength*20} className={`${input} resize-y`}/></label>)}</fieldset>;
}

export function LanguageTabs({active,onChange,missing}:{active:Locale;onChange:(locale:Locale)=>void;missing?:Record<Locale,boolean>}) {
  return <div role="tablist" aria-label="Lingua del contenuto" className="mt-2 flex flex-wrap gap-2">{locales.map(locale=><button key={locale} type="button" role="tab" aria-selected={active===locale} onClick={()=>onChange(locale)} className={`rounded-full border px-3 py-2 text-sm font-bold ${active===locale?"border-blue-700 bg-blue-700 text-white":"border-slate-200 bg-white text-slate-700"}`}>{localeNames[locale]}{missing?.[locale]?<span className="ml-1 text-amber-500" aria-label="Traduzione mancante">●</span>:null}</button>)}</div>;
}
