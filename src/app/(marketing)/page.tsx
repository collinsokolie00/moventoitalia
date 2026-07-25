import HomeTrustSections from "@/components/home/HomeTrustSections";
import HomepageSections from "@/components/home/HomepageSections";
import FeaturedReviews from "@/components/reviews/FeaturedReviews";
import AnimatedPromoBanner from "@/components/media/AnimatedPromoBanner";

import { listFeaturedPublishedReviews } from "@/lib/database/reviews";
import { getHomepageContent } from "@/lib/database/homepage";
import { listPublishedServiceAreas } from "@/lib/database/service-areas";
import { listPublishedFAQs } from "@/lib/database/faqs";
import { createPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { text } from "@/lib/i18n/text";

import Link from "next/link";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShieldCheck,
  Sofa,
  Truck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return createPageMetadata({ path: "/" });
}

export default async function HomePage() {
  const locale=await getRequestLocale();
  const [reviews, homepage, serviceAreas, faqs] = await Promise.all([
    listFeaturedPublishedReviews(locale),
    getHomepageContent(locale),
    listPublishedServiceAreas(locale),
    listPublishedFAQs(locale),
  ]);
  const tr=(en:string,it:string)=>text(locale,en,it);
  const services = [
    {title:tr("Home Moves","Traslochi casa"),description:tr("Professional apartment and house moving services handled with care.","Servizi professionali per appartamenti e case, eseguiti con cura."),icon:Truck},
    {title:tr("Office Relocation","Traslochi uffici"),description:tr("Organised business relocations designed to reduce interruptions.","Trasferimenti aziendali organizzati per ridurre le interruzioni."),icon:Building2},
    {title:tr("Furniture Transport","Trasporto mobili"),description:tr("Reliable transport for furniture, marketplace purchases and deliveries.","Trasporto affidabile per mobili, acquisti e consegne."),icon:Sofa},
    {title:tr("Packing & Assembly","Imballaggio e montaggio"),description:tr("Packing, disassembly, transport and reassembly from one trusted team.","Imballaggio, smontaggio, trasporto e rimontaggio con un unico team."),icon:PackageCheck},
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-blue-300 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-cyan-300 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-[620px] max-w-7xl grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] items-center gap-3 px-3 py-10 sm:gap-6 sm:px-5 sm:py-14 lg:min-h-180 lg:gap-14 lg:px-8 lg:py-20">
          <div className="min-w-0">
            <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-2 text-[10px] font-medium leading-tight text-blue-50 backdrop-blur sm:gap-2 sm:px-4 sm:text-sm">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />

              <span className="min-w-0 break-words">
                {tr("Premium moving services across Central Italy","Servizi di trasloco premium nel Centro Italia")}
              </span>
            </div>

            {homepage && (
              <>
                <h1 className="mt-4 max-w-3xl break-words text-[clamp(1.65rem,8vw,3rem)] font-extrabold leading-[1.03] tracking-tight sm:mt-7 sm:text-6xl lg:text-7xl">
                  {homepage.hero.title}
                </h1>

                <p className="mt-4 max-w-2xl break-words text-xs leading-5 text-blue-100 sm:mt-7 sm:text-xl sm:leading-8">
                  {homepage.hero.subtitle}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-4">
                  <Link
                    href={localePath(locale,homepage.hero.primaryButton.href)}
                    className="inline-flex min-w-0 items-center justify-center gap-1 rounded-2xl bg-white px-2.5 py-3 text-center text-[11px] font-bold leading-tight text-blue-900 transition hover:bg-blue-50 sm:gap-2 sm:rounded-full sm:px-7 sm:py-4 sm:text-base"
                  >
                    <span className="min-w-0 break-words">
                      {homepage.hero.primaryButton.label}
                    </span>

                    <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-5 sm:w-5" />
                  </Link>

                  <Link
                    href={localePath(locale,homepage.hero.secondaryButton.href)}
                    className="inline-flex min-w-0 items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-2.5 py-3 text-center text-[11px] font-semibold leading-tight text-white backdrop-blur transition hover:bg-white/20 sm:rounded-full sm:px-7 sm:py-4 sm:text-base"
                  >
                    <span className="min-w-0 break-words">
                      {homepage.hero.secondaryButton.label}
                    </span>
                  </Link>
                </div>

                <div className="mt-6 grid max-w-2xl grid-cols-3 gap-1 text-blue-100 sm:mt-12 sm:gap-5 sm:text-sm">
                  {homepage.statistics.map((statistic) => (
                    <div
                      key={`${statistic.value}-${statistic.label}`}
                      className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-1 py-2 sm:border-0 sm:bg-transparent sm:p-0"
                    >
                      <p className="whitespace-nowrap text-[11px] font-bold tracking-tight text-white sm:whitespace-normal sm:text-2xl sm:tracking-normal">
                        {statistic.value}
                      </p>

                      <p className="mt-1 break-words text-[9px] leading-tight sm:text-sm sm:leading-normal">
                        {statistic.label}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="min-w-0 rounded-2xl border border-white/20 bg-white p-3 text-slate-950 shadow-2xl shadow-blue-950/30 sm:rounded-4xl sm:p-8">
            <p className="break-words text-[9px] font-bold uppercase tracking-[0.12em] text-blue-700 sm:text-sm sm:tracking-[0.18em]">
              {tr("Quick estimate","Preventivo rapido")}
            </p>

            <h2 className="mt-2 break-words text-lg font-extrabold leading-tight tracking-tight sm:mt-3 sm:text-3xl">
              {tr("Start planning your move","Inizia a pianificare il trasloco")}
            </h2>

            <p className="mt-2 break-words text-[10px] leading-4 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
              {tr("Give us the basic details and receive an estimated price range.","Fornisci i dettagli essenziali e ricevi una fascia di prezzo stimata.")}
            </p>

            <div className="mt-4 grid gap-2 sm:mt-7 sm:gap-4">
              <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:rounded-2xl sm:p-4">
                <p className="break-words text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                  {tr("Moving from","Partenza")}
                </p>

                <p className="mt-1 break-words text-[10px] font-semibold leading-tight text-slate-800 sm:text-base sm:leading-normal">
                  {tr("Terni, Perugia or Rome","Terni, Perugia o Roma")}
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:rounded-2xl sm:p-4">
                <p className="break-words text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                  {tr("Property","Immobile")}
                </p>

                <p className="mt-1 break-words text-[10px] font-semibold leading-tight text-slate-800 sm:text-base sm:leading-normal">
                  {tr("Studio, apartment, house or office","Monolocale, appartamento, casa o ufficio")}
                </p>
              </div>

              <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-2.5 sm:rounded-2xl sm:p-4">
                <p className="break-words text-[8px] font-bold uppercase tracking-wide text-slate-500 sm:text-xs">
                  {tr("Preferred date","Data preferita")}
                </p>

                <p className="mt-1 break-words text-[10px] font-semibold leading-tight text-slate-800 sm:text-base sm:leading-normal">
                  {tr("Choose your moving date","Scegli la data del trasloco")}
                </p>
              </div>
            </div>

            <Link
              href={localePath(locale,"/quote")}
              className="mt-4 flex min-w-0 w-full items-center justify-center gap-1 rounded-xl bg-blue-700 px-2 py-3 text-center text-[10px] font-bold leading-tight text-white transition hover:bg-blue-800 sm:mt-6 sm:gap-2 sm:rounded-2xl sm:px-6 sm:py-4 sm:text-base"
            >
              <span className="min-w-0 break-words">
                {tr("Calculate My Estimate","Calcola il mio preventivo")}
              </span>

              <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-5 sm:w-5" />
            </Link>

            <p className="mt-2 text-center text-[8px] text-slate-500 sm:mt-4 sm:text-xs">
              {tr("No registration required.","Nessuna registrazione richiesta.")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-24">
        <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
          <div className="grid grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] items-end gap-4 sm:block">
            <div className="min-w-0">
              <p className="break-words text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700 sm:text-sm sm:tracking-[0.2em]">
                {tr("What we do","Cosa facciamo")}
              </p>

              <h2 className="mt-2 break-words text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:mt-4 sm:text-5xl">
                {tr("Everything you need for a better move","Tutto ciò che serve per un trasloco migliore")}
              </h2>
            </div>

            <p className="min-w-0 break-words text-xs leading-5 text-slate-600 sm:mt-5 sm:max-w-3xl sm:text-lg sm:leading-8">
              {tr("One organised service for moving, transporting, packing and assembling your belongings.","Un servizio organizzato per traslocare, trasportare, imballare e montare i tuoi beni.")}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:rounded-3xl sm:p-7"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 sm:h-12 sm:w-12 sm:rounded-2xl">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  <h3 className="mt-4 break-words text-base font-bold leading-tight text-slate-950 sm:mt-6 sm:text-xl">
                    {service.title}
                  </h3>

                  <p className="mt-2 break-words text-[11px] leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-7 sm:mt-10">
            <Link
              href={localePath(locale,"/services")}
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900 sm:text-base"
            >
              {tr("View all Movento services","Scopri tutti i servizi Movento")}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </section>

      {homepage && (
        <section className="bg-slate-50 py-14 sm:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-stretch gap-3 px-3 sm:gap-8 sm:px-5 lg:gap-14 lg:px-8">
            <div className="min-w-0 py-2 sm:py-0">
              <p className="break-words text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700 sm:text-sm sm:tracking-[0.2em]">
                {tr("Why Movento","Perché Movento")}
              </p>

              <h2 className="mt-2 break-words text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:mt-4 sm:text-5xl">
                {homepage.whyChoose.title}
              </h2>

              <p className="mt-3 break-words text-xs leading-5 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
                {homepage.whyChoose.description}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-8 sm:gap-4">
                {homepage.whyChoose.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex min-w-0 items-start gap-1.5 rounded-xl bg-white p-2 shadow-sm sm:gap-3 sm:bg-transparent sm:p-0 sm:shadow-none"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700 sm:h-5 sm:w-5" />

                    <span className="min-w-0 break-words text-[10px] font-semibold leading-tight text-slate-800 sm:text-base sm:leading-normal">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 rounded-2xl bg-blue-900 p-4 text-white shadow-xl sm:rounded-4xl sm:p-10">
              <Clock3 className="h-7 w-7 text-blue-200 sm:h-10 sm:w-10" />

              <h3 className="mt-4 break-words text-lg font-extrabold leading-tight sm:mt-6 sm:text-3xl">
                {tr("Get a response without waiting for days","Ricevi una risposta senza aspettare giorni")}
              </h3>

              <p className="mt-3 break-words text-[11px] leading-5 text-blue-100 sm:mt-5 sm:text-base sm:leading-8">
                {tr("Request an estimate online, share the details of your move and communicate directly with Movento through WhatsApp.","Richiedi un preventivo online, condividi i dettagli e comunica direttamente con Movento tramite WhatsApp.")}
              </p>

              <Link
                href={localePath(locale,"/contact")}
                className="mt-5 inline-flex min-w-0 items-center justify-center gap-1 rounded-xl bg-white px-3 py-3 text-center text-[10px] font-bold leading-tight text-blue-900 sm:mt-8 sm:gap-2 sm:rounded-full sm:px-6 sm:text-base"
              >
                <span className="min-w-0 break-words">
                  {tr("Contact Movento","Contatta Movento")}
                </span>

                <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {homepage?.bannerSlides.some((slide) => slide.enabled && slide.imageUrl) && (
        <div className="bg-white px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <AnimatedPromoBanner slides={homepage.bannerSlides} locale={locale} />
          </div>
        </div>
      )}

      <HomepageSections
        callToAction={homepage?.callToAction ?? null}
        serviceAreas={serviceAreas}
        locale={locale}
      />

      <FeaturedReviews reviews={reviews} locale={locale} title={tr("What our customers say","Cosa dicono i nostri clienti")} />

      <HomeTrustSections questions={faqs.slice(0, 4)} locale={locale} />
    </>
  );
}
