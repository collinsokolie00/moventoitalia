import Link from "next/link";
import {
    ArrowRight,
    CalendarCheck2,
    CheckCircle2,
    MapPin,
    MessageSquareText,
    PackageCheck,
} from "lucide-react";
import type { HomepageContent } from "@/lib/database/homepage";
import type { ServiceArea } from "@/lib/database/service-areas";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";

export default function HomepageSections({ callToAction, serviceAreas,locale }: { callToAction: HomepageContent["callToAction"] | null; serviceAreas: ServiceArea[];locale:Locale }) {
    const tr=(en:string,it:string)=>locale==="it"?it:en;
    const processSteps=[
      {number:"01",title:tr("Request your estimate","Richiedi il preventivo"),description:tr("Tell us where you are moving, your property size and the services you require.","Indicaci il percorso, le dimensioni dell’immobile e i servizi necessari."),icon:MessageSquareText},
      {number:"02",title:tr("Confirm the plan","Conferma il piano"),description:tr("We review the information, confirm availability and finalise your moving plan.","Esaminiamo le informazioni, confermiamo la disponibilità e definiamo il piano."),icon:CalendarCheck2},
      {number:"03",title:tr("We complete the move","Eseguiamo il trasloco"),description:tr("Our team arrives, protects your belongings and manages the move carefully.","Il team arriva, protegge i tuoi beni e gestisce il trasloco con cura."),icon:PackageCheck},
    ];
    const priceExamples=[
      {label:tr("Studio apartment","Monolocale"),price:"€250–€350"},
      {label:tr("One-bedroom apartment","Bilocale"),price:"€350–€500"},
      {label:tr("Two-bedroom apartment","Trilocale"),price:"€500–€800"},
      {label:tr("Three-bedroom home","Casa con tre camere"),price:"€800–€1.300"},
    ];
    return (
        <>
            <section className="bg-white py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                            {tr("How it works","Come funziona")}
                        </p>

                        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                            {tr("A clear process from quotation to delivery","Un processo chiaro dal preventivo alla consegna")}
                        </h2>

                        <p className="mt-5 text-lg leading-8 text-slate-600">
                            {tr("Movento makes moving easier with straightforward planning, transparent communication and professional execution.","Movento semplifica il trasloco con pianificazione chiara, comunicazione trasparente ed esecuzione professionale.")}
                        </p>
                    </div>

                    <div
                        aria-label={tr("Moving process","Processo di trasloco")}
                        className="-mx-5 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-1 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:mt-14 lg:grid-cols-3"
                    >
                        {processSteps.map((step) => {
                            const Icon = step.icon;

                            return (
                                <article
                                    key={step.number}
                                    className="relative w-[82vw] max-w-80 shrink-0 snap-start rounded-4xl border border-slate-200 bg-slate-50 p-5 md:w-auto md:max-w-none md:p-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white">
                                            <Icon className="h-7 w-7" />
                                        </div>

                                        <span className="text-4xl font-black text-blue-100">
                                            {step.number}
                                        </span>
                                    </div>

                                    <h3 className="mt-6 text-xl font-bold text-slate-950 md:mt-8 md:text-2xl">
                                        {step.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-slate-600 md:mt-4 md:text-base md:leading-7">
                                        {step.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="relative overflow-hidden rounded-[2.25rem] bg-blue-950">
                        <div className="absolute inset-0">
                            <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
                            <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
                        </div>

                        <div className="relative grid min-h-110 items-center gap-10 px-7 py-14 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
                                    {tr("Professional care","Cura professionale")}
                                </p>

                                <h2 className="mt-5 max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                                    {tr("Your move deserves careful hands.","Il tuo trasloco merita mani attente.")}
                                </h2>

                                <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
                                    {tr("From packing and furniture protection to transport and delivery, Movento manages every stage with care and precision.","Dall’imballaggio e protezione dei mobili al trasporto e alla consegna, Movento gestisce ogni fase con cura e precisione.")}
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <Link
                                        href={localePath(locale,"/quote")}
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-950 transition hover:bg-blue-50"
                                    >
                                        {tr("Plan Your Move","Pianifica il trasloco")}
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>

                                    <Link
                                        href={localePath(locale,"/services")}
                                        className="inline-flex items-center rounded-full border border-white/30 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
                                    >
                                        {tr("View Services","Scopri i servizi")}
                                    </Link>
                                </div>
                            </div>

                            <div className="rounded-4xl border border-white/15 bg-white/10 p-7 text-white backdrop-blur sm:p-9">
                                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-200">
                                    {tr("Every move includes","Ogni trasloco include")}
                                </p>

                                <div className="mt-6 space-y-5">
                                    {(locale==="it"?[
                                        "Gestione attenta di mobili e beni",
                                        "Comunicazione chiara prima del trasloco",
                                        "Opzioni di servizio flessibili",
                                        "Carico e trasporto professionali",
                                    ]:[
                                        "Careful handling of furniture and belongings",
                                        "Clear communication before moving day",
                                        "Flexible service options",
                                        "Professional loading and transport",
                                    ]).map((item) => (
                                        <div key={item} className="flex gap-3">
                                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-200" />
                                            <span className="leading-7 text-blue-50">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                                {tr("Service areas","Zone servite")}
                            </p>

                            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                                {tr("Moving services across Central Italy","Servizi di trasloco nel Centro Italia")}
                            </h2>

                            <p className="mt-5 text-lg leading-8 text-slate-600">
                                {tr("We initially serve Terni, Perugia, Rome and surrounding towns, with longer-distance jobs available by quotation.","Serviamo Terni, Perugia, Roma e le località vicine; i traslochi a lunga distanza sono disponibili su preventivo.")}
                            </p>
                        </div>

                        <Link
                            href={localePath(locale,"/service-areas")}
                            className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"
                        >
                            {tr("Explore all service areas","Scopri tutte le zone servite")}
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>

                    <div
                        aria-label={tr("Service areas","Zone servite")}
                        className="-mx-5 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-12 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
                    >
                        {serviceAreas.map((location) => (
                            <article
                                key={location.id}
                                className="w-[82vw] max-w-80 shrink-0 snap-start rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:w-auto md:max-w-none md:p-7"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                    <MapPin className="h-6 w-6" />
                                </div>

                                <h3 className="mt-6 text-2xl font-bold text-slate-950">
                                    {location.areaName}
                                </h3>

                                <p className="mt-3 leading-7 text-slate-600">
                                    {location.shortDescription}
                                </p>

                                <Link
                                    href={localePath(locale,"/quote")}
                                    className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700"
                                >
                                    {tr("Request a quote","Richiedi un preventivo")}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-24">
                <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                            {tr("Pricing guidance","Indicazioni sui prezzi")}
                        </p>

                        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                            {tr("Understand the likely cost before booking","Conosci il costo indicativo prima di prenotare")}
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            {tr("Final prices depend on distance, access, floors, volume, required workers and additional services. These figures are starting guidance only.","I prezzi finali dipendono da distanza, accessi, piani, volume, personale e servizi aggiuntivi. Queste cifre sono solo indicative.")}
                        </p>

                        <Link
                            href={localePath(locale,"/quote")}
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-4 font-bold text-white transition hover:bg-blue-800"
                        >
                            {tr("Calculate Your Estimate","Calcola il preventivo")}
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-4xl border border-slate-200 bg-slate-50">
                        {priceExamples.map((item, index) => (
                            <div
                                key={item.label}
                                className={[
                                    "flex items-center justify-between gap-5 px-6 py-6 sm:px-8",
                                    index !== priceExamples.length - 1
                                        ? "border-b border-slate-200"
                                        : "",
                                ].join(" ")}
                            >
                                <span className="font-semibold text-slate-800">
                                    {item.label}
                                </span>

                                <span className="text-lg font-extrabold text-blue-700">
                                    {item.price}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {callToAction && <section className="bg-blue-700 py-20 text-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                            {callToAction.eyebrow}
                        </p>

                        <h2 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
                            {callToAction.title}
                        </h2>

                        <p className="mt-4 max-w-2xl text-lg leading-8 text-blue-100">
                            {callToAction.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={localePath(locale,callToAction.primaryButton.href)}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-800"
                        >
                            {callToAction.primaryButton.label}
                            <ArrowRight className="h-5 w-5" />
                        </Link>

                        <Link
                            href={localePath(locale,callToAction.secondaryButton.href)}
                            className="inline-flex items-center rounded-full border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white/10"
                        >
                            {callToAction.secondaryButton.label}
                        </Link>
                    </div>
                </div>
            </section>}
        </>
    );
}
