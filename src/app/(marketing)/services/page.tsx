import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Fragment } from "react";

import FeaturedReviews from "@/components/reviews/FeaturedReviews";
import ServiceIcon from "@/components/services/ServiceIcon";
import { listFeaturedPublishedReviews } from "@/lib/database/reviews";
import { listPublishedServices } from "@/lib/database/services";
import { createPageMetadata } from "@/lib/seo";
import { getSiteMedia } from "@/lib/database/site-media";
import AnimatedPromoBanner from "@/components/media/AnimatedPromoBanner";
import { getRequestLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { text } from "@/lib/i18n/text";

export async function generateMetadata() {
  const locale=await getRequestLocale();
  return createPageMetadata({
    path: "/services",
    title: text(locale,"Moving & Relocation Services | Movento","Servizi di trasloco e trasferimento | Movento"),
    description: text(locale,"Explore Movento home moves, office relocations, furniture transport, packing, assembly, storage and house clearance services.","Scopri i servizi Movento per traslochi casa e ufficio, trasporto mobili, imballaggio, montaggio e deposito."),
  });
}

export const dynamic = "force-dynamic";
export default async function ServicesPage() {
  const locale = await getRequestLocale();
  const [reviews, services, media] = await Promise.all([
    listFeaturedPublishedReviews(locale),
    listPublishedServices(locale),
    getSiteMedia(locale),
  ]);
  return (
    <>
      <section
        className="relative overflow-hidden bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 text-white"
        style={media.servicesHero.url ? {
          backgroundImage: `url(${JSON.stringify(media.servicesHero.url)})`,
          backgroundPosition: media.servicesHero.position,
          backgroundSize: "cover",
        } : undefined}
      >
        {media.servicesHero.url && <div className="absolute inset-0 bg-blue-950/75" />}
        {media.servicesHero.url && <span className="sr-only">{media.servicesHero.alt}</span>}
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
              {text(locale, "Movento services", "Servizi Movento")}
            </p>

            <h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              {text(locale, "Complete support for every stage of your move.", "Assistenza completa in ogni fase del trasloco.")}
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-blue-100 sm:text-xl">
              {text(locale, "From packing and furniture protection to transport, delivery and assembly, Movento provides one organised moving service across Terni, Perugia, Rome and nearby areas.", "Dall’imballaggio e protezione dei mobili al trasporto, alla consegna e al montaggio, Movento offre un servizio organizzato a Terni, Perugia, Roma e nelle zone vicine.")}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={localePath(locale, "/quote")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-900 transition hover:bg-blue-50"
              >
                {text(locale, "Get an Estimate", "Richiedi un preventivo")}
                <ArrowRight className="h-5 w-5" />
              </Link>


            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              {text(locale, "Our services", "I nostri servizi")}
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              {text(locale, "Choose the help your move requires", "Scegli l’assistenza che serve al tuo trasloco")}
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {text(locale, "Customers can select a complete relocation service or combine individual services according to their needs.", "Puoi scegliere un servizio completo oppure combinare i singoli servizi in base alle tue esigenze.")}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-7">
            {services.map((service, index) => {
              return (
                <Fragment key={service.slug}>
                {index === 2 && <AnimatedPromoBanner slides={media.servicesBannerSlides} locale={locale} className="col-span-2" />}
                <article
                  className="group min-w-0 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:rounded-4xl sm:p-8"
                >
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white sm:h-14 sm:w-14 sm:rounded-2xl">
                      <ServiceIcon name={service.icon} className="h-5 w-5 sm:h-7 sm:w-7" />
                    </div>

                    <span className="w-fit max-w-full rounded-full bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold leading-4 text-slate-700 sm:px-4 sm:py-2 sm:text-sm">
                      {service.subtitle}
                    </span>
                  </div>

                  {service.image && <div className="mt-4 aspect-[16/9] rounded-xl bg-slate-100 bg-cover bg-center sm:mt-7 sm:rounded-3xl" style={{ backgroundImage: `url(${JSON.stringify(service.image)})` }} role="img" aria-label={service.title} />}

                  <h3 className="mt-4 text-base font-extrabold leading-5 text-slate-950 sm:mt-7 sm:text-2xl sm:leading-normal">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
                    {service.description}
                  </p>

                  <div className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-2 sm:gap-3">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-1.5 text-[11px] font-medium leading-4 text-slate-700 sm:items-center sm:gap-3 sm:text-sm sm:leading-normal"
                      >
                        <Check className="h-4 w-4 shrink-0 text-blue-700" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-slate-200 pt-4 sm:mt-8 sm:pt-6">
                    <Link
                      href={localePath(locale, `/quote?service=${service.slug}`)}
                      className="inline-flex items-center gap-1 text-xs font-bold leading-4 text-blue-700 transition hover:text-blue-900 sm:gap-2 sm:text-base sm:leading-normal"
                    >
                      {text(locale, "Request this service", "Richiedi questo servizio")}
                      <ArrowRight className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                    </Link>
                  </div>
                </article>
                </Fragment>
              );
            })}
            {services.length <= 2 && <AnimatedPromoBanner slides={media.servicesBannerSlides} locale={locale} className="col-span-2" />}
          </div>
        </div>
      </section>

      <FeaturedReviews reviews={reviews} locale={locale} title={text(locale, "Trusted for moves handled with care", "Scelti per traslochi eseguiti con cura")} />
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-4xl bg-blue-950">
            <div className="absolute inset-0">
              <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
              <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
            </div>

            <div className="relative grid min-h-110 items-center gap-12 px-7 py-14 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
                  {text(locale, "Complete moving support", "Assistenza completa per il trasloco")}
                </p>

                <h2 className="mt-5 max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  {text(locale, "One team from packing to final delivery.", "Un solo team, dall’imballaggio alla consegna finale.")}
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
                  {text(locale, "Avoid coordinating several different providers. Movento can manage packing, disassembly, transport, unloading and reassembly as one organised service.", "Evita di coordinare più fornitori. Movento gestisce imballaggio, smontaggio, trasporto, scarico e rimontaggio come un unico servizio organizzato.")}
                </p>

                <Link
                  href={localePath(locale, "/quote")}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-950 transition hover:bg-blue-50"
                >
                  {text(locale, "Plan Your Move", "Pianifica il trasloco")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="rounded-4xl border border-white/15 bg-white/10 p-7 text-white backdrop-blur sm:p-9">
                <ShieldCheck className="h-10 w-10 text-blue-200" />

                <h3 className="mt-6 text-2xl font-extrabold">
                  {text(locale,"Designed around proper handling","Progettato per una gestione accurata")}
                </h3>

                <div className="mt-6 space-y-4">
                  {(locale==="it"?[
                    "Mobili protetti prima del carico","Oggetti fragili gestiti con cura","Accessi e parcheggio pianificati in anticipo","Comunicazione chiara durante tutto il lavoro",
                  ]:[
                    "Furniture protected before loading",
                    "Fragile belongings handled carefully",
                    "Access and parking planned in advance",
                    "Clear communication throughout the job",
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

      <section className="bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              {text(locale,"Flexible service","Servizio flessibile")}
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              {text(locale,"Only pay for the help you need","Paghi solo l’assistenza che ti serve")}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {text(locale,"Some customers need a complete move. Others only need furniture transport, packing or assembly. Movento can build the service around the actual job instead of forcing every customer into one fixed package.","Alcuni clienti richiedono un trasloco completo, altri solo trasporto mobili, imballaggio o montaggio. Movento adatta il servizio al lavoro reale senza imporre un pacchetto fisso.")}
            </p>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-extrabold text-slate-950">
              {text(locale,"Your quotation can include:","Il preventivo può includere:")}
            </h3>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {(locale==="it"?[
                "Numero di addetti","Dimensione del veicolo","Distanza di viaggio","Materiali da imballaggio","Montaggio mobili","Accesso ai piani","Disponibilità ascensore","Oggetti pesanti o fragili",
              ]:[
                "Number of workers",
                "Vehicle size",
                "Travel distance",
                "Packing materials",
                "Furniture assembly",
                "Floor access",
                "Elevator availability",
                "Heavy or fragile items",
              ]).map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-700" />
                  <span className="font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href={localePath(locale,"/quote")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-4 font-bold text-white transition hover:bg-blue-800"
            >
              {text(locale,"Build Your Estimate","Crea il tuo preventivo")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
