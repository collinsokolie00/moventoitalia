import Link from "next/link";
import Image from "next/image";

import MobileNavigation from "./MobileNavigation";
import NavigationLinks from "./NavigationLinks";
import { getSiteChrome } from "@/lib/database/site-chrome";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n/messages";
import { localePath } from "@/lib/i18n/config";
import LanguageSelector from "./LanguageSelector";

const italianNavigation: Record<string, string> = {
  "/": "Home",
  "/services": "Servizi",
  "/service-areas": "Zone servite",
  "/about": "Chi siamo",
  "/blog": "Blog",
  "/faq": "Domande frequenti",
  "/contact": "Contatti",
};

export default async function Header() {
  const locale = await getRequestLocale();
  const chrome = await getSiteChrome(locale);
  const messages = getMessages(locale);
  if (!chrome) return null;
  const navigation = chrome.navigation.filter(item => item.visible).map(item => ({
    ...item,
    label: locale === "it" && !item.labelIt ? italianNavigation[item.href] ?? item.label : item.label,
  }));
  const headerCta = {
    ...chrome.headerCta,
    label: locale === "it" && !chrome.headerCta.labelIt ? "Richiedi un preventivo" : chrome.headerCta.label,
  };
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-5 px-5 lg:px-8">
        <Link
          href={localePath(locale, "/")}
          className="shrink-0"
          aria-label={`${chrome.companyName} ${messages.navigation.home}`}
        >
          <Image
            src={chrome.companyLogo}
            alt={chrome.companyName}
            width={1716}
            height={889}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </Link>

        <NavigationLinks navigation={navigation} locale={locale} />

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSelector locale={locale} labels={messages.language} />
          <Link
            href={localePath(locale, headerCta.href)}
            className="rounded-full bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            {headerCta.label}
          </Link>

        </div>

        <MobileNavigation navigation={navigation} headerCta={headerCta} locale={locale} messages={messages} />
      </div>
    </header>
  );
}
