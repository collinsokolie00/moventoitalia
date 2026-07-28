import Image from "next/image";
import Link from "next/link";
import { Clock3, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import CookieSettingsButton from "@/components/cookies/CookieSettingsButton";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { getContactContent } from "@/lib/database/contact";
import { getSiteChrome, type FooterGroup } from "@/lib/database/site-chrome";
import { localePath } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function Footer() {
  const locale = await getRequestLocale();
  const [contact, chrome] = await Promise.all([
    getContactContent(locale),
    getSiteChrome(locale),
  ]);
  const messages = getMessages(locale);
  if (!chrome) return null;

  const it = locale === "it";
  const footerLabels: Record<string, string> = {
    "/": "Home",
    "/services": "Servizi",
    "/service-areas": "Zone servite",
    "/about": "Chi siamo",
    "/blog": "Blog",
    "/faq": "Domande frequenti",
    "/contact": "Contatti",
    "/quote": "Preventivo",
  };
  const servicesGroup = chrome.footerNavigation.find((group) =>
    group.title.toLowerCase().includes("serv"),
  );
  const companyGroup = chrome.footerNavigation.find((group) => group !== servicesGroup);
  const mobileGroups = [servicesGroup, companyGroup].filter(
    (group): group is FooterGroup => Boolean(group),
  );
  const legalLinks = [
    { href: "/terms", label: it ? "Termini" : "Terms" },
    { href: "/privacy", label: it ? "Privacy" : "Privacy" },
    { href: "/cookies", label: it ? "Cookie" : "Cookie Policy" },
  ];
  const groupTitle = (group: FooterGroup) =>
    it && !group.titleIt
      ? group.title === "Services"
        ? "Servizi"
        : group.title === "Company"
          ? "Azienda"
          : group.title
      : group.title;
  const linkLabel = (link: FooterGroup["links"][number]) =>
    it && !link.labelIt ? footerLabels[link.href] ?? link.label : link.label;

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 md:grid-cols-2 md:gap-8 md:py-10 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href={localePath(locale, "/")} aria-label={`${chrome.companyName} ${messages.navigation.home}`} className="inline-flex">
            <Image src={chrome.footerLogo} alt={chrome.companyName} width={1716} height={889} className="h-16 w-auto md:h-20" />
          </Link>
          <p className="mt-2 max-w-sm text-sm leading-5 text-slate-300 md:mt-3 md:leading-6">
            {chrome.footerDescription}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-semibold text-slate-400 md:mt-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={localePath(locale, link.href)} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
            <CookieSettingsButton label={it ? "Impostazioni cookie" : "Cookie settings"} />
          </div>
          {chrome.socialLinks.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 md:mt-4 md:block md:space-y-2">
              {chrome.socialLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-slate-300 transition hover:text-white md:gap-3 md:text-sm">
                  <ExternalLink className="h-4 w-4 text-blue-400 md:h-5 md:w-5" />
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-5 border-t border-slate-800 pt-5 md:hidden">
          {mobileGroups.map((group, groupIndex) => (
            <FooterNavigationGroup key={`${group.title}-${groupIndex}`} group={group} locale={locale} title={groupTitle(group)} getLabel={linkLabel} compact />
          ))}
        </div>

        <div className="hidden md:contents">
          {chrome.footerNavigation.map((group, groupIndex) => (
            <FooterNavigationGroup key={`${group.title}-${groupIndex}`} group={group} locale={locale} title={groupTitle(group)} getLabel={linkLabel} />
          ))}
        </div>

        <div className="border-t border-slate-800 pt-5 md:border-0 md:pt-0">
          <h2 className="font-semibold">
            {it && !chrome.footerCta.titleIt ? "Pronto a traslocare?" : chrome.footerCta.title}
          </h2>
          <p className="mt-2 text-sm leading-5 text-slate-300 md:mt-3 md:leading-6">
            {it && !chrome.footerCta.descriptionIt
              ? "Raccontaci i dettagli del tuo trasloco e ricevi un preventivo chiaro."
              : chrome.footerCta.description}
          </p>
          <Link href={localePath(locale, chrome.footerCta.buttonHref)} className="mt-3 inline-flex rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 md:mt-4 md:py-3">
            {it && !chrome.footerCta.buttonLabelIt ? "Richiedi un preventivo" : chrome.footerCta.buttonLabel}
          </Link>
        </div>
      </div>

      {contact && (
        <div className="border-t border-slate-800">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-5 md:hidden">
            <div className="space-y-3 rounded-xl bg-white/5 p-3">
              <FooterContact href={`tel:${contact.phone.replace(/\s/g, "")}`} icon={<Phone />} value={contact.phone} />
              <FooterContact href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} icon={<WhatsAppIcon />} value={contact.whatsapp} external />
            </div>
            <div className="space-y-3 rounded-xl bg-white/5 p-3">
              <FooterContact href={`mailto:${contact.email}`} icon={<Mail />} value={contact.email} />
              <FooterContact href={contact.googleMapsUrl} icon={<MapPin />} value={contact.address} external />
            </div>
          </div>

          <div className="mx-auto hidden max-w-7xl items-center gap-x-6 gap-y-4 px-5 py-5 md:grid md:grid-cols-3 xl:grid-cols-[auto_auto_minmax(190px,auto)_minmax(220px,1fr)_minmax(260px,1.25fr)] xl:gap-0 lg:px-8">
            <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-3 text-sm text-slate-300 transition hover:text-white xl:pr-5"><WhatsAppIcon className="h-5 w-5 shrink-0 text-blue-400" /><span>{contact.whatsapp}</span></a>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex min-w-0 items-center gap-3 text-sm text-slate-300 transition hover:text-white xl:border-l xl:border-slate-800 xl:px-5"><Phone className="h-5 w-5 shrink-0 text-blue-400" /><span>{contact.phone}</span></a>
            <a href={`mailto:${contact.email}`} className="flex min-w-0 items-center gap-3 text-sm text-slate-300 transition hover:text-white xl:border-l xl:border-slate-800 xl:px-5"><Mail className="h-5 w-5 shrink-0 text-blue-400" /><span className="min-w-0 break-words">{contact.email}</span></a>
            <a href={contact.googleMapsUrl} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-3 text-sm text-slate-300 transition hover:text-white xl:border-l xl:border-slate-800 xl:px-5"><MapPin className="h-5 w-5 shrink-0 text-blue-400" /><span className="min-w-0 break-words">{contact.address}</span></a>
            <p className="flex min-w-0 items-center gap-3 text-sm text-slate-300 xl:border-l xl:border-slate-800 xl:pl-5"><Clock3 className="h-5 w-5 shrink-0 text-blue-400" /><span className="whitespace-pre-line">{contact.callingHours}</span></p>
          </div>
        </div>
      )}

      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-5 py-4 text-xs text-slate-400 sm:text-sm lg:px-8">
          {contact && (
            <p className="mb-2 flex items-start gap-2 whitespace-pre-line md:hidden">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              {contact.callingHours}
            </p>
          )}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            <p>{chrome.copyrightText.replace("{year}", String(new Date().getFullYear()))}</p>
            <p>{chrome.footerTagline}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterNavigationGroup({ group, locale, title, getLabel, compact = false }: { group: FooterGroup; locale: "en" | "it"; title: string; getLabel: (link: FooterGroup["links"][number]) => string; compact?: boolean }) {
  return (
    <div>
      <h2 className="font-semibold">{title}</h2>
      <div className={`${compact ? "mt-2 gap-1.5 text-xs" : "mt-3 gap-2.5 text-sm"} flex flex-col text-slate-300`}>
        {group.links.map((link, linkIndex) => (
          <Link key={`${linkIndex}-${link.href}`} href={localePath(locale, link.href)} className="break-words transition hover:text-white">
            {getLabel(link)}
          </Link>
        ))}
      </div>
    </div>
  );
}

function FooterContact({ href, icon, value, external = false }: { href: string; icon: React.ReactNode; value: string; external?: boolean }) {
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className="flex min-w-0 items-start gap-2 text-[11px] leading-4 text-slate-300 transition hover:text-white">
      <span className="mt-0.5 shrink-0 text-blue-400 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <span className="min-w-0 break-words">{value}</span>
    </a>
  );
}
