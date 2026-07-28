
import Link from "next/link";
import Image from "next/image";
import { Clock3, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getContactContent } from "@/lib/database/contact";
import { getSiteChrome } from "@/lib/database/site-chrome";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/messages";
import { localePath } from "@/lib/i18n/config";

export default async function Footer() {
  const locale = await getRequestLocale();
  const [contact, chrome] = await Promise.all([getContactContent(locale), getSiteChrome(locale)]);
  const messages = getMessages(locale);
  if (!chrome) return null;
  const footerLabels: Record<string, string> = {
    "/": "Home", "/services": "Servizi", "/service-areas": "Zone servite",
    "/about": "Chi siamo", "/blog": "Blog", "/faq": "Domande frequenti",
    "/contact": "Contatti", "/quote": "Preventivo",
  };
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href={localePath(locale, "/")} aria-label={`${chrome.companyName} ${messages.navigation.home}`} className="inline-flex">
            <Image
              src={chrome.footerLogo}
              alt={chrome.companyName}
              width={1716}
              height={889}
              className="h-20 w-auto"
            />
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            {chrome.footerDescription}
          </p>
          <div className="mt-4 space-y-2">
            {chrome.socialLinks.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-slate-300 transition hover:text-white"><ExternalLink className="h-5 w-5 text-blue-400" />{link.label}</a>)}
          </div>
        </div>

        {chrome.footerNavigation.map((group, groupIndex) => <div key={`${group.title}-${groupIndex}`}><h2 className="font-semibold">{locale === "it" && !group.titleIt ? (group.title === "Services" ? "Servizi" : group.title === "Company" ? "Azienda" : group.title) : group.title}</h2><div className="mt-3 flex flex-col gap-2.5 text-sm text-slate-300">{group.links.map((link, linkIndex) => <Link key={`${groupIndex}-${linkIndex}-${link.href}`} href={localePath(locale,link.href)}>{locale === "it" && !link.labelIt ? footerLabels[link.href] ?? link.label : link.label}</Link>)}</div></div>)}

        <div>
          <h2 className="font-semibold">{locale === "it" && !chrome.footerCta.titleIt ? "Pronto a traslocare?" : chrome.footerCta.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {locale === "it" && !chrome.footerCta.descriptionIt ? "Raccontaci i dettagli del tuo trasloco e ricevi un preventivo chiaro." : chrome.footerCta.description}
          </p>

          <Link
            href={localePath(locale, chrome.footerCta.buttonHref)}
            className="mt-4 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            {locale === "it" && !chrome.footerCta.buttonLabelIt ? "Richiedi un preventivo" : chrome.footerCta.buttonLabel}
          </Link>
        </div>
      </div>

      {contact && <div className="border-t border-slate-800">
        <div className="mx-auto grid max-w-7xl items-center gap-x-6 gap-y-4 px-5 py-5 md:grid-cols-3 xl:grid-cols-[auto_auto_minmax(190px,auto)_minmax(220px,1fr)_minmax(260px,1.25fr)] xl:gap-0 lg:px-8">
          <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-3 text-sm text-slate-300 transition hover:text-white xl:pr-5"><WhatsAppIcon className="h-5 w-5 shrink-0 text-blue-400" /><span>{contact.whatsapp}</span></a>
          <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex min-w-0 items-center gap-3 text-sm text-slate-300 transition hover:text-white xl:border-l xl:border-slate-800 xl:px-5"><Phone className="h-5 w-5 shrink-0 text-blue-400" /><span>{contact.phone}</span></a>
          <a href={`mailto:${contact.email}`} className="flex min-w-0 items-center gap-3 text-sm text-slate-300 transition hover:text-white xl:border-l xl:border-slate-800 xl:px-5"><Mail className="h-5 w-5 shrink-0 text-blue-400" /><span className="min-w-0 break-words">{contact.email}</span></a>
          <a href={contact.googleMapsUrl} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-3 text-sm text-slate-300 transition hover:text-white xl:border-l xl:border-slate-800 xl:px-5"><MapPin className="h-5 w-5 shrink-0 text-blue-400" /><span className="min-w-0 break-words">{contact.address}</span></a>
          <p className="flex min-w-0 items-center gap-3 text-sm text-slate-300 xl:border-l xl:border-slate-800 xl:pl-5"><Clock3 className="h-5 w-5 shrink-0 text-blue-400" /><span className="whitespace-pre-line">{contact.callingHours}</span></p>
        </div>
      </div>}

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>{chrome.copyrightText.replace("{year}", String(new Date().getFullYear()))}</p>
          <p>{chrome.footerTagline}</p>
        </div>
      </div>
    </footer>
  );
}
