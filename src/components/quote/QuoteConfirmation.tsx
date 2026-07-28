"use client";

import Link from "next/link";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  Home,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";

import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import {
  isQuoteConfirmationPayload,
  quoteConfirmationStorageKey,
  type QuoteConfirmationPayload,
} from "@/lib/quotes/confirmation";

type QuoteConfirmationProps = {
  homePath: string;
  contactPath: string;
  whatsapp: string;
  phone: string;
  email: string;
  locale:Locale;
};
const nextStepsEn = [
  "Movento reviews the quotation request.",
  "Movento contacts you to clarify the moving details.",
  "Availability and the final price are confirmed.",
  "The final written quotation and service agreement are prepared.",
  "Moving-day access, timing, parking and services are arranged.",
  "Your move is completed according to the confirmed agreement.",
];

const packingTipsEn = [
  "Label every carton by room.",
  "Pack fragile items separately.",
  "Do not overload cartons.",
  "Protect glass and ceramics with bubble wrap.",
  "Keep documents, money, keys and valuables with you.",
  "Photograph electronics before disconnecting them.",
  "Empty drawers before moving heavy furniture.",
  "Tell Movento about stairs, lifts, narrow entrances and parking restrictions.",
];

const packingOptionsEn = [
  ["Moving cartons / boxes", "Strong cartons for household and office belongings."],
  ["Bubble wrap", "Cushioning for fragile and breakable items."],
  ["Protective foam or Styrofoam", "Extra impact protection for delicate belongings."],
  ["Packing paper", "Clean wrapping and void filling for cartons."],
  ["Stretch film", "Secure wrapping for grouped or protected items."],
  ["Mattress protection bags", "Clean covers for mattresses during transport."],
  ["Furniture protection covers", "Protection against dust, marks and light impact."],
  ["Glass and dish protection", "Specialist protection for glassware and ceramics."],
  ["Tape and labels", "Secure sealing and clear room-by-room identification."],
  ["Professional packing service", "Movento can prepare and pack your belongings."],
  ["Professional unpacking service", "Movento can unpack items at the destination."],
] as const;

const propertyLabelsEn: Record<string, string> = {
  studio: "Studio",
  apartment: "Apartment",
  house: "House",
  office: "Office",
};

export default function QuoteConfirmation({
  homePath,
  contactPath,
  whatsapp,
  phone,
  email,
  locale,
}: QuoteConfirmationProps) {
  const it=locale==="it";const tr=(en:string,itText:string)=>it?itText:en;
  const nextSteps=it?["Movento esamina la richiesta di preventivo.","Movento ti contatta per chiarire i dettagli del trasloco.","Vengono confermati disponibilità e prezzo finale.","Vengono preparati il preventivo scritto e l’accordo di servizio.","Si organizzano accessi, orari, parcheggio e servizi.","Il trasloco viene completato secondo l’accordo confermato."]:nextStepsEn;
  const packingTips=it?["Etichetta ogni scatola indicando la stanza.","Imballa separatamente gli oggetti fragili.","Non sovraccaricare le scatole.","Proteggi vetro e ceramica con pluriball.","Tieni con te documenti, denaro, chiavi e oggetti di valore.","Fotografa i dispositivi elettronici prima di scollegarli.","Svuota i cassetti prima di spostare mobili pesanti.","Informa Movento su scale, ascensori, ingressi stretti e limiti di parcheggio."]:packingTipsEn;
  const packingOptions=it?[
    ["Scatole da trasloco","Scatole robuste per beni domestici e da ufficio."],["Pluriball","Protezione ammortizzante per oggetti fragili."],["Schiuma protettiva o polistirolo","Protezione aggiuntiva dagli urti."],["Carta da imballaggio","Avvolgimento pulito e riempimento degli spazi."],["Pellicola estensibile","Avvolgimento sicuro di oggetti raggruppati o protetti."],["Sacchi proteggi materasso","Coperture pulite per i materassi durante il trasporto."],["Coperture protettive per mobili","Protezione da polvere, segni e piccoli urti."],["Protezione per vetri e stoviglie","Protezione specifica per vetro e ceramica."],["Nastro ed etichette","Chiusura sicura e identificazione per stanza."],["Servizio di imballaggio professionale","Movento può preparare e imballare i tuoi beni."],["Servizio di disimballaggio professionale","Movento può disimballare a destinazione."],
  ] as const:packingOptionsEn;
  const propertyLabels=it?{studio:"Monolocale",apartment:"Appartamento",house:"Casa",office:"Ufficio"}:propertyLabelsEn;
  const [payload, setPayload] = useState<
    QuoteConfirmationPayload | null | undefined
  >(undefined);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = sessionStorage.getItem(quoteConfirmationStorageKey);
        const parsed: unknown = stored ? JSON.parse(stored) : null;

        if (isQuoteConfirmationPayload(parsed)) {
          setPayload(parsed);
          return;
        }

        sessionStorage.removeItem(quoteConfirmationStorageKey);
        setPayload(null);
      } catch {
        setPayload(null);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (payload === undefined) {
    return (
      <main className="min-h-[60vh] bg-slate-50 px-5 py-24">
        <div className="mx-auto max-w-xl rounded-4xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Clock3 className="mx-auto h-9 w-9 animate-pulse text-blue-700" />
          <p className="mt-4 font-bold text-slate-700">
            {tr("Preparing your quotation confirmation…","Preparazione della conferma del preventivo…")}
          </p>
        </div>
      </main>
    );
  }

  if (!payload) {
    return (
      <main className="min-h-[65vh] bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-2xl rounded-4xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-12">
          <CircleAlert className="mx-auto h-12 w-12 text-blue-700" />
          <h1 className="mt-6 text-3xl font-extrabold text-slate-950 sm:text-4xl">
            {tr("Quotation summary unavailable","Riepilogo del preventivo non disponibile")}
          </h1>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-600">
            {tr("This private summary is available only for a short time after a successful submission. Movento can still help using your reference from the confirmation email.","Questo riepilogo privato è disponibile solo per un breve periodo dopo l’invio. Movento può comunque aiutarti usando il riferimento presente nell’email di conferma.")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={homePath}
              className="rounded-full bg-blue-700 px-6 py-3 font-bold text-white"
            >
              {tr("Return to homepage","Torna alla pagina iniziale")}
            </Link>
            <Link
              href={contactPath}
              className="rounded-full border border-slate-300 px-6 py-3 font-bold text-slate-700"
            >
              {tr("Contact Movento","Contatta Movento")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { quote } = payload;
  const money = new Intl.NumberFormat(payload.locale, {
    style: "currency",
    currency: payload.currency,
    maximumFractionDigits: 0,
  });
  const date = new Intl.DateTimeFormat(payload.locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${quote.movingDate}T00:00:00Z`));
  const services = [
    quote.packing && tr("Packing","Imballaggio"),
    quote.assembly && tr("Furniture assembly","Montaggio mobili"),
    quote.heavyItems && tr("Heavy-item handling","Gestione oggetti pesanti"),
  ].filter(Boolean) as string[];
  const selectedServices = services.length
    ? services.join(", ")
    : tr("Standard moving service","Servizio di trasloco standard");
  const additionalNotes = [
    quote.notes,
    quote.customAdditionalNotes,
    quote.specialHandlingRequirements,
  ]
    .filter(Boolean)
    .join(" · ");
  const packingMessage = it?`Ciao Movento, vorrei aggiungere materiali o assistenza per l’imballaggio al preventivo ${payload.quoteId}.`:`Hello Movento, I would like to add paid packing materials or packing support to quotation ${payload.quoteId}.`;
  const whatsappNumber = whatsapp.replace(/\D/g, "");
  const packingHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(packingMessage)}`
    : `${contactPath}?reference=${encodeURIComponent(payload.quoteId)}`;

  return (
    <main className="bg-slate-50 text-slate-950">
      <section className="bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="flex max-w-4xl items-center gap-3 text-blue-100">
            <CheckCircle2 className="h-6 w-6" />
            <p className="text-sm font-bold uppercase tracking-[0.2em]">
              {tr("Quotation received","Preventivo ricevuto")}
            </p>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            {tr("Thank you for choosing Movento","Grazie per aver scelto Movento")}
          </h1>
          <p className="mt-5 text-xl font-bold text-white sm:text-2xl">
            {quote.name}
          </p>
          <div className="mt-8 inline-flex max-w-full flex-col rounded-3xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur sm:px-7">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
              {tr("Your reference number","Il tuo numero di riferimento")}
            </span>
            <strong className="mt-2 break-all text-2xl tracking-wide sm:text-4xl">
              {payload.quoteId}
            </strong>
          </div>
          <p className="mt-7 max-w-3xl text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
            {tr("We have received your request. Our team will review the details and contact you as soon as possible to confirm availability and prepare the final quotation.","Abbiamo ricevuto la tua richiesta. Il nostro team esaminerà i dettagli e ti contatterà al più presto per confermare la disponibilità e preparare il preventivo finale.")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow={tr("Your request","La tua richiesta")}
          title={tr("Complete quotation summary","Riepilogo completo del preventivo")}
          description={tr("Please keep your reference number available when contacting Movento.","Tieni a disposizione il numero di riferimento quando contatti Movento.")}
        />
        <dl className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <SummaryCard icon={<MapPin />} label={tr("Moving from","Partenza")} value={quote.origin} />
          <SummaryCard icon={<MapPin />} label={tr("Moving to","Destinazione")} value={quote.destination} />
          <SummaryCard icon={<Clock3 />} label={tr("Preferred date","Data preferita")} value={date} />
          <SummaryCard
            icon={<Home />}
            label={tr("Property type","Tipo di immobile")}
            value={propertyLabels[quote.propertyType] ?? quote.propertyType}
          />
          <SummaryCard
            icon={<Box />}
            label={tr("Number of rooms","Numero di stanze")}
            value={String(quote.rooms)}
          />
          <SummaryCard
            icon={<PackageCheck />}
            label={tr("Selected services","Servizi selezionati")}
            value={selectedServices}
          />
          <SummaryCard
            icon={<Tag />}
            label={tr("Estimated price range","Fascia di prezzo stimata")}
            value={`${money.format(quote.estimatedMinimum)}–${money.format(
              quote.estimatedMaximum,
            )}`}
          />
          <SummaryCard
            icon={<ClipboardCheck />}
            label={tr("Additional notes","Note aggiuntive")}
            value={additionalNotes || tr("No additional notes supplied","Nessuna nota aggiuntiva")}
          />
          <SummaryCard icon={<Mail />} label={tr("Customer email","Email del cliente")} value={quote.email} />
          <SummaryCard icon={<Phone />} label={tr("Customer phone","Telefono del cliente")} value={quote.phone} />
        </dl>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading
            eyebrow={tr("What happens next","Cosa succede ora")}
            title={tr("A clear path from review to moving day","Un percorso chiaro fino al giorno del trasloco")}
            description={tr("Your online estimate is preliminary. The confirmed written quotation follows Movento’s review.","La stima online è preliminare. Il preventivo scritto confermato viene preparato dopo la verifica di Movento.")}
          />
          <ol className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {nextSteps.map((step) => (
              <li
                key={step}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6"
              >
                <span aria-hidden="true" className="block h-7" />
                <p className="mt-3 text-sm font-bold leading-6 text-slate-800 sm:text-base">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow={tr("Prepare with confidence","Preparati con sicurezza")}
          title={tr("Practical packing tips","Consigli pratici per l’imballaggio")}
          description={tr("A little preparation helps protect belongings and keeps moving day organised.","Una buona preparazione protegge i beni e mantiene organizzato il giorno del trasloco.")}
        />
        <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {packingTips.map((tip) => (
            <div
              key={tip}
              className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4"
            >
              <ShieldCheck className="h-5 w-5 shrink-0 text-blue-700" />
              <p className="text-sm font-semibold leading-5 text-blue-950">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
              {tr("Optional paid support","Assistenza facoltativa a pagamento")}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
              {tr("Packing materials and professional packing services","Materiali e servizi professionali di imballaggio")}
            </h2>
            <p className="mt-5 text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
              {tr("Packing materials are paid products. Professional packing and unpacking are paid services. You may request materials only, a full packing service, or both. Movento will add your selections to the final quotation before you approve it.","I materiali di imballaggio sono prodotti a pagamento. Imballaggio e disimballaggio professionali sono servizi a pagamento. Puoi richiedere solo i materiali, il servizio completo o entrambi. Movento aggiungerà le scelte al preventivo finale prima dell’approvazione.")}
            </p>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {packingOptions.map(([title, description]) => (
              <article
                key={title}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur sm:p-5"
              >
                <PackageCheck className="h-5 w-5 text-blue-200" />
                <h3 className="mt-3 text-sm font-extrabold leading-5 sm:text-base">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-blue-100 sm:text-sm">
                  {description}
                </p>
              </article>
            ))}
          </div>
          <a
            href={packingHref}
            target={whatsappNumber ? "_blank" : undefined}
            rel={whatsappNumber ? "noreferrer" : undefined}
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-bold text-blue-950"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {tr("Add packing support to my quotation","Aggiungi l’imballaggio al preventivo")}
          </a>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          <div className="rounded-4xl border border-slate-200 bg-slate-50 p-6 sm:p-9">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                  {tr("Need help?","Hai bisogno di aiuto?")}
                </p>
                <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                  {tr("Movento is ready to discuss your request.","Movento è pronto a parlare della tua richiesta.")}
                </h2>
                {(phone || email) && (
                  <p className="mt-3 break-words text-sm leading-6 text-slate-600">
                    {[phone, email].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={packingHref}
                  target={whatsappNumber ? "_blank" : undefined}
                  rel={whatsappNumber ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-bold text-white"
                >
                  {tr("Add packing support","Aggiungi assistenza imballaggio")}
                </a>
                <Link
                  href={contactPath}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700"
                >
                  {tr("Contact Movento","Contatta Movento")}
                </Link>
                <Link
                  href={homePath}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700"
                >
                  {tr("Return to homepage","Torna alla pagina iniziale")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-4xl">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-slate-600 sm:text-lg sm:leading-8">
        {description}
      </p>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </div>
      <dt className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-bold leading-6 text-slate-900 sm:text-base">
        {value}
      </dd>
    </div>
  );
}
