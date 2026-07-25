import Link from "next/link";
import {
    ArrowRight,
    ChevronRight,
    MessageCircleMore,
    ShieldCheck,
} from "lucide-react";
import type { FAQItem } from "@/lib/database/faqs";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";

export default function HomeTrustSections({ questions,locale }: { questions: FAQItem[];locale:Locale }) {
    const tr=(en:string,it:string)=>locale==="it"?it:en;
    return (
        <>
            <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                                {tr("Built on practical experience","Fondato sull’esperienza pratica")}
                            </p>

                            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                                {tr("We understand how belongings should be handled.","Sappiamo come devono essere trattati i tuoi beni.")}
                            </h2>

                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                {tr("Movento is built around real moving experience—not only technology. We understand packing, furniture protection, careful lifting, secure loading and respectful delivery.","Movento nasce da una vera esperienza nei traslochi, non solo dalla tecnologia. Conosciamo imballaggio, protezione dei mobili, sollevamento accurato, carico sicuro e consegna rispettosa.")}
                            </p>

                            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5">
                                <div className="min-w-0 rounded-3xl bg-white p-4 sm:flex sm:gap-4 sm:p-5">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>

                                    <div className="mt-3 min-w-0 sm:mt-0">
                                        <h3 className="text-sm font-bold leading-5 text-slate-950 sm:text-base">
                                            {tr("Proper protection","Protezione adeguata")}
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                                            {tr("Furniture and fragile belongings are prepared carefully before loading.","Mobili e oggetti fragili vengono preparati con cura prima del carico.")}
                                        </p>
                                    </div>
                                </div>

                                <div className="min-w-0 rounded-3xl bg-white p-4 sm:flex sm:gap-4 sm:p-5">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                        <MessageCircleMore className="h-5 w-5" />
                                    </div>

                                    <div className="mt-3 min-w-0 sm:mt-0">
                                        <h3 className="text-sm font-bold leading-5 text-slate-950 sm:text-base">
                                            {tr("Clear communication","Comunicazione chiara")}
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                                            {tr("Customers receive a clear plan before moving day and updates throughout the process.","I clienti ricevono un piano chiaro prima del trasloco e aggiornamenti durante tutto il processo.")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-4xl border border-blue-100 bg-blue-50 p-8 text-blue-950"><p className="text-xl font-extrabold">{tr("Verified customer feedback","Opinioni verificate dei clienti")}</p><p className="mt-3 leading-7 text-blue-800">{tr("Published reviews are displayed below as soon as they are approved by Movento.","Le recensioni vengono mostrate appena approvate da Movento.")}</p></div>
                    </div>

                </div>
            </section>

            <section className="bg-white py-24">
                <div className="mx-auto max-w-5xl px-5 lg:px-8">
                    <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                            {tr("Frequently asked questions","Domande frequenti")}
                        </p>

                        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                            {tr("Important answers before your move","Risposte importanti prima del trasloco")}
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                            {tr("Clear information helps customers plan with confidence and avoids unexpected problems on moving day.","Informazioni chiare aiutano a pianificare con sicurezza ed evitare imprevisti il giorno del trasloco.")}
                        </p>
                    </div>

                    <div className="mt-12 space-y-4">
                        {questions.map((item) => (
                            <details
                                key={item.question}
                                className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 open:border-blue-200 open:bg-blue-50/50"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold text-slate-950">
                                    <span>{item.question}</span>

                                    <ChevronRight className="h-5 w-5 shrink-0 text-blue-700 transition group-open:rotate-90" />
                                </summary>

                                <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href={localePath(locale,"/faq")}
                            className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"
                        >
                            {tr("View all frequently asked questions","Vedi tutte le domande frequenti")}
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
