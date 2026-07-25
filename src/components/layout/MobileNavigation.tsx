import { Menu, X } from "lucide-react";
import Link from "next/link";

import type { ChromeLink } from "@/lib/database/site-chrome";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import LanguageSelector from "./LanguageSelector";

type MobileNavigationProps = {
    navigation: ChromeLink[];
    headerCta: {
        label: string;
        href: string;
    };
    locale: Locale;
    messages: Messages;
};

export default function MobileNavigation({
    navigation,
    headerCta,
    locale,
    messages,
}: MobileNavigationProps) {
    return (
        <details className="group lg:hidden">
            <summary
                role="button"
                aria-label={messages.navigation.open}
                className="flex h-11 w-11 shrink-0 cursor-pointer list-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition marker:content-none active:border-blue-300 active:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 [&::-webkit-details-marker]:hidden"
            >
                <span className="sr-only">{messages.navigation.open}</span>
                <Menu className="h-5 w-5 group-open:hidden" aria-hidden="true" />
                <X className="hidden h-5 w-5 group-open:block" aria-hidden="true" />
            </summary>

            <div
                className="fixed inset-x-0 bottom-0 top-20 z-40 lg:hidden"
                aria-label={locale==="it"?"Navigazione mobile":"Mobile navigation"}
            >
                <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />

                <div className="absolute inset-x-0 top-0 max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-slate-200 bg-white shadow-2xl">
                    <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
                            {locale === "it" ? "Menu" : "Menu"}
                        </p>

                        <nav
                            aria-label={locale === "it" ? "Collegamenti di navigazione mobile" : "Mobile navigation links"}
                            className="grid grid-cols-2 gap-3"
                        >
                            {navigation.map((item) => (
                                <Link
                                    key={`${item.href}-${item.label}`}
                                    href={localePath(locale, item.href)}
                                    className="flex min-h-14 min-w-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center text-sm font-bold leading-snug text-slate-800 transition active:border-blue-300 active:bg-blue-50 active:text-blue-700"
                                >
                                    <span className="min-w-0 wrap-break-word">
                                        {item.label}
                                    </span>
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] items-stretch gap-3 border-t border-slate-100 pt-5">
                            <LanguageSelector locale={locale} labels={messages.language} />

                            <Link
                                href={localePath(locale, headerCta.href)}
                                className="flex min-h-12 min-w-0 items-center justify-center rounded-2xl bg-blue-700 px-4 py-3 text-center text-sm font-bold leading-snug text-white transition active:bg-blue-800"
                            >
                                <span className="min-w-0 wrap-break-word">
                                    {headerCta.label}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </details>
    );
}
