import Link from "next/link";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { listPublishedFAQs, type FAQItem } from "@/lib/database/faqs";
import { createPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { text } from "@/lib/i18n/text";

export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const locale=await getRequestLocale();
  return createPageMetadata({ path: "/faq", title: text(locale,"Moving FAQs | Movento","Domande frequenti sui traslochi | Movento"), description: text(locale,"Find answers about moving quotations, pricing, packing, access, timing and preparing for moving day with Movento.","Trova risposte su preventivi, prezzi, imballaggio, accessi, tempistiche e preparazione al trasloco.") });
}

function groupFAQs(items: FAQItem[]) {
  const groups = new Map<string, { title: string; description: string; questions: FAQItem[] }>();
  for (const item of items) {
    const group = groups.get(item.category) ?? { title: item.category, description: item.categoryDescription, questions: [] };
    group.questions.push(item);
    if (!group.description && item.categoryDescription) group.description = item.categoryDescription;
    groups.set(item.category, group);
  }
  return [...groups.values()];
}

export default async function FAQPage() {
  const locale=await getRequestLocale();
  const items=await listPublishedFAQs(locale);
  const groups = groupFAQs(items);
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };
  const tr = (en: string, it: string) => text(locale, en, it);
  return <main className="bg-white text-slate-950">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="border-b border-slate-200 bg-slate-50"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28"><div className="max-w-4xl">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">{tr("Frequently asked questions", "Domande frequenti")}</p>
      <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{tr("Everything you need to know before moving", "Tutto ciò che devi sapere prima del trasloco")}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{tr("Find clear answers about quotations, pricing, packing, access, timing, insurance and preparing for your moving day.", "Trova risposte chiare su preventivi, prezzi, imballaggio, accessi, tempistiche, assicurazione e preparazione al giorno del trasloco.")}</p>
    </div></div></section>
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28"><div className="grid gap-12 lg:grid-cols-[320px_1fr]">
      <aside className="lg:sticky lg:top-28 lg:self-start"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600"><HelpCircle className="h-7 w-7" /></div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight">{tr("Helpful moving information", "Informazioni utili sul trasloco")}</h2>
        <p className="mt-4 leading-7 text-slate-600">{tr("Select any question to open the answer. Your final quotation will reflect the exact details of your move.", "Seleziona una domanda per aprire la risposta. Il preventivo finale terrà conto dei dettagli specifici del tuo trasloco.")}</p>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start gap-3"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" /><div>
          <p className="font-semibold">{tr("Still have a question?", "Hai ancora una domanda?")}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{tr("Contact Movento and explain what you need help with.", "Contatta Movento e spiegaci di cosa hai bisogno.")}</p>
          <Link href={localePath(locale, "/contact")} className="mt-4 inline-flex font-semibold text-blue-600 hover:underline">{tr("Contact Movento", "Contatta Movento")}</Link>
        </div></div></div>
      </aside>
      <div className="space-y-14">{groups.map(group => <section key={group.title}><div className="border-b border-slate-200 pb-5"><p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">{group.title}</p>{group.description && <p className="mt-3 max-w-2xl leading-7 text-slate-600">{group.description}</p>}</div><div className="mt-5 space-y-3">{group.questions.map(item => <details key={item.id} className="group rounded-2xl border border-slate-200 bg-white transition open:border-blue-200 open:bg-blue-50/30"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 font-semibold text-slate-950 sm:px-6"><span>{item.question}</span><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-open:rotate-180 group-open:bg-blue-600 group-open:text-white"><ChevronDown className="h-5 w-5" /></span></summary><div className="px-5 pb-6 sm:px-6"><p className="max-w-3xl border-t border-slate-200 pt-5 leading-7 text-slate-600">{item.answer}</p></div></details>)}</div></section>)}
        {groups.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">{tr("No FAQs are currently published.", "Al momento non ci sono domande frequenti pubblicate.")}</p>}
      </div>
    </div></section>
    <section className="border-t border-slate-200 bg-slate-50"><div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">{tr("Need more information?", "Hai bisogno di altre informazioni?")}</p>
      <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{tr("Ask us about your specific moving requirements", "Parlaci delle esigenze specifiche del tuo trasloco")}</h2>
      <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">{tr("Every move is different. Contact Movento when your question is not covered here.", "Ogni trasloco è diverso. Contatta Movento se non trovi qui la risposta che cerchi.")}</p>
      <Link href={localePath(locale, "/contact")} className="mt-8 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-4 font-semibold transition hover:border-blue-600 hover:text-blue-600">{tr("Contact Movento", "Contatta Movento")}</Link>
    </div></section>
  </main>;
}
