import Link from "next/link";
import { ArrowRight, Clock3, Mail, MapPin, Phone } from "lucide-react";

import ContactForm from "@/components/contact/ContactForm";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getContactContent } from "@/lib/database/contact";
import { createPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/i18n/server";
import { text } from "@/lib/i18n/text";
import { localePath } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale=await getRequestLocale();
  return createPageMetadata({
    path: "/contact",
    title: text(locale,"Contact Movento | Moving Services","Contatta Movento | Servizi di trasloco"),
    description:text(locale,"Contact Movento about moving quotations, service availability and planning your move across Central Italy.","Contatta Movento per preventivi, disponibilità e pianificazione del trasloco nel Centro Italia."),
  });
}

export default async function ContactPage() {
  const locale=await getRequestLocale();
  const contact=await getContactContent(locale);

  if (!contact) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-24 text-center text-slate-500">
        {text(locale, "Contact information is currently unavailable.", "Le informazioni di contatto non sono al momento disponibili.")}
      </main>
    );
  }

  const whatsapp = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`;

  return (
    <main className="bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
              {text(locale, "Contact Movento", "Contatta Movento")}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.5rem]">
              {contact.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {contact.introductoryText}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 px-3 py-12 sm:gap-8 sm:px-6 sm:py-20 lg:gap-12 lg:px-8 lg:py-28">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-sm sm:tracking-[0.25em]">
            {text(locale, "Contact information", "Informazioni di contatto")}
          </p>
          <h2 className="mt-2 text-base font-bold leading-5 tracking-tight sm:mt-4 sm:text-3xl sm:leading-tight lg:text-4xl">
            {text(locale, "Speak directly with our moving team", "Parla direttamente con il nostro team traslochi")}
          </h2>
          <p className="mt-3 text-xs leading-5 text-slate-600 sm:mt-5 sm:text-base sm:leading-7">
            {text(locale, "Choose the most convenient way to reach us. For faster pricing, complete the estimate form with the details of your move.", "Scegli il modo più comodo per contattarci. Per ricevere rapidamente un prezzo, compila il modulo con i dettagli del trasloco.")}
          </p>

          <div className="mt-5 space-y-2 sm:mt-10 sm:space-y-4">
            <Card
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
              icon={<Phone className="h-4 w-4 sm:h-5 sm:w-5" />}
              title={text(locale, "Telephone", "Telefono")}
              text={contact.phone}
            />
            <Card
              href={`mailto:${contact.email}`}
              icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}
              title="Email"
              text={contact.email}
            />
            <Card
              href={whatsapp}
              external
              icon={<WhatsAppIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
              title="WhatsApp"
              text={contact.whatsapp}
            />
            <Card
              href={contact.googleMapsUrl}
              external
              icon={<MapPin className="h-4 w-4 sm:h-5 sm:w-5" />}
              title={text(locale, "Company address", "Sede aziendale")}
              text={contact.address}
            />

            <div className="flex min-w-0 gap-2 rounded-xl border border-slate-200 p-2 sm:gap-4 sm:rounded-2xl sm:p-5">
              <Icon>
                <Clock3 className="h-4 w-4 sm:h-5 sm:w-5" />
              </Icon>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold leading-4 sm:text-base">
                  {text(locale, "Calling hours", "Orari telefonici")}
                </p>
                <p className="mt-1 whitespace-pre-line text-[10px] leading-4 text-slate-600 sm:text-base sm:leading-6">
                  {contact.callingHours}
                </p>
              </div>
            </div>
          </div>

          {contact.mapEmbedUrl && (
            <iframe
              src={contact.mapEmbedUrl}
              title={text(locale, "Movento location", "Sede Movento")}
              loading="lazy"
              className="mt-3 h-40 w-full rounded-xl border-0 sm:mt-6 sm:h-72 sm:rounded-2xl"
            />
          )}
        </div>

        <ContactForm
          heading={contact.formHeading}
          supportingText={contact.formSupportingText}
          locale={locale}
        />
      </section>

      <section className="bg-white px-3 pb-8 sm:px-6 sm:pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950">
          <div className="flex flex-col gap-6 px-5 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                {text(locale, "Planning a move?", "Stai pianificando un trasloco?")}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                {text(locale, "Get your moving estimate today", "Richiedi oggi il tuo preventivo")}
              </h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                {contact.callToActionText}
              </p>
            </div>
            <Link
              href={localePath(locale, "/quote")}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-600 px-7 py-4 font-semibold text-white"
            >
              {text(locale, "Get an Estimate", "Richiedi un preventivo")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 sm:h-12 sm:w-12 sm:rounded-xl">
      {children}
    </div>
  );
}

function Card({
  href,
  icon,
  title,
  text,
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex min-w-0 gap-2 rounded-xl border border-slate-200 p-2 transition hover:border-blue-300 hover:bg-blue-50/40 sm:gap-4 sm:rounded-2xl sm:p-5"
    >
      <Icon>{icon}</Icon>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold leading-4 sm:text-base">
          {title}
        </p>
        <p className="mt-1 break-words text-[10px] leading-4 text-slate-600 sm:text-base sm:leading-6">
          {text}
        </p>
      </div>
    </a>
  );
}
