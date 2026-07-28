"use client";

import { Check, ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localeNames, locales, switchLocalePath, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

export default function LanguageSelector({ locale, labels, onSelect, mobile = false }: { locale: Locale; labels: Messages["language"]; onSelect?: () => void; mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function close(event: MouseEvent) { if (!root.current?.contains(event.target as Node)) setOpen(false); }
    function escape(event: KeyboardEvent) { if (event.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  function choose(next: Locale) {
    const query = searchParams.toString();
    const href = `${switchLocalePath(pathname, next)}${query ? `?${query}` : ""}`;
    setOpen(false);
    onSelect?.();
    window.location.assign(href);
  }

  return <div ref={root} className="relative">
    <button type="button" aria-label={`${labels.change}: ${localeNames[locale]}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(value => !value)} className="inline-flex h-10 min-w-16 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-bold uppercase text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      {locale}<ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
    </button>
    {open && <div role="menu" aria-label={labels.label} className={`absolute z-[70] min-w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ${mobile ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2"}`}>
      {locales.map(item => <button key={item} type="button" role="menuitemradio" aria-checked={item === locale} onClick={() => choose(item)} className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">
        <span>{localeNames[item]}</span>{item === locale && <Check className="h-4 w-4" aria-hidden="true" />}
      </button>)}
    </div>}
  </div>;
}
