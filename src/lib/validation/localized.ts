import { z } from "zod";
import { locales } from "@/lib/i18n/config";

export function localizedText(min:number,max:number) {
  const text=z.string().trim().min(min).max(max);
  return z.object({ en:text, it:z.string().trim().max(max) });
}

export function localizedOptionalText(max:number) {
  const text=z.string().trim().max(max);
  return z.object(Object.fromEntries(locales.map(locale=>[locale,text])) as Record<(typeof locales)[number],typeof text>);
}

export function localizedStringArray(itemMax:number,arrayMax:number) {
  const values=z.array(z.string().trim().min(1).max(itemMax)).max(arrayMax);
  return z.object(Object.fromEntries(locales.map(locale=>[locale,values])) as Record<(typeof locales)[number],typeof values>);
}

export function localizedFromForm(formData:FormData,name:string) {
  return Object.fromEntries(locales.map(locale=>[locale,formData.get(`${name}.${locale}`)??""]));
}

export function localizedLinesFromForm(formData:FormData,name:string) {
  return Object.fromEntries(locales.map(locale=>[locale,String(formData.get(`${name}.${locale}`)??"").split("\n").map(value=>value.trim()).filter(Boolean)]));
}
