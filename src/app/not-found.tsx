import Link from "next/link";
import { getRequestLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
export default async function NotFound(){
  const locale=await getRequestLocale();const it=locale==="it";
  return <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-5 py-20 text-center"><div className="max-w-xl">
    <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-700">404</p>
    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">{it?"Pagina non trovata":"This page could not be found"}</h1>
    <p className="mt-5 text-lg leading-8 text-slate-600">{it?"L’indirizzo potrebbe essere errato oppure la pagina è stata spostata.":"The address may be incorrect, or the page may have moved."}</p>
    <Link href={localePath(locale,"/")} className="mt-8 inline-flex rounded-full bg-blue-700 px-7 py-4 font-bold text-white transition hover:bg-blue-800">{it?"Torna a Movento":"Return to Movento"}</Link>
  </div></main>;
}
