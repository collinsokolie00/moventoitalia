"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { ChromeLink } from "@/lib/database/site-chrome";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import LanguageSelector from "./LanguageSelector";
import NavigationLinks from "./NavigationLinks";

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
  const [openedOnPathname, setOpenedOnPathname] = useState<string | null>(null);
  const pathname = usePathname();
  const open = openedOnPathname === pathname;

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedOnPathname(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const close = () => setOpenedOnPathname(null);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? messages.navigation.close : messages.navigation.open}
        aria-expanded={open}
        aria-controls="movento-mobile-navigation"
        onClick={() => setOpenedOnPathname(open ? null : pathname)}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition active:border-blue-300 active:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>

      {open &&
        createPortal(
          <div
            id="movento-mobile-navigation"
            className="fixed inset-x-0 bottom-0 top-20 z-[60] overflow-hidden lg:hidden"
            aria-label={locale === "it" ? "Navigazione mobile" : "Mobile navigation"}
          >
            <button
              type="button"
              aria-label={messages.navigation.close}
              onClick={close}
              className="absolute inset-0 h-full w-full bg-slate-950/45 backdrop-blur-[2px]"
            />

            <div className="absolute inset-x-0 top-0 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-slate-200 bg-white shadow-2xl">
              <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
                  Menu
                </p>

                <NavigationLinks
                  navigation={navigation}
                  mobile
                  locale={locale}
                  onNavigate={close}
                />

                <div className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] items-stretch gap-3 border-t border-slate-100 pt-5">
                  <LanguageSelector
                    locale={locale}
                    labels={messages.language}
                    onSelect={close}
                    mobile
                  />

                  <Link
                    href={localePath(locale, headerCta.href)}
                    onClick={close}
                    className="flex min-h-12 min-w-0 items-center justify-center rounded-2xl bg-blue-700 px-4 py-3 text-center text-sm font-bold leading-snug text-white transition active:bg-blue-800"
                  >
                    <span className="min-w-0 break-words">
                      {headerCta.label}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
