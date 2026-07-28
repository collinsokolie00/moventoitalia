import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalPageProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  introduction: string;
  sections: LegalSection[];
  updatedLabel: string;
  reviewNotice: string;
  path: string;
};

export default function LegalPage({
  locale,
  eyebrow,
  title,
  introduction,
  sections,
  updatedLabel,
  reviewNotice,
  path,
}: LegalPageProps) {
  return (
    <main className="bg-white text-slate-950">
      <BreadcrumbJsonLd locale={locale} items={[
        { name: "Home", path: "/" },
        { name: title, path },
      ]} />
      <header className="bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 text-white">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-100">
            {introduction}
          </p>
          <p className="mt-5 text-sm text-blue-200">{updatedLabel}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_220px] lg:px-8">
        <article className="space-y-11">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc space-y-2 pl-6">
                    {section.bullets.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </div>
            </section>
          ))}

          <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            {reviewNotice}
          </aside>
        </article>

        <nav aria-label={locale === "it" ? "Documenti legali" : "Legal documents"} className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:sticky lg:top-28">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-blue-700">
            {locale === "it" ? "Documenti legali" : "Legal documents"}
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm font-semibold text-slate-700">
            <Link href={localePath(locale, "/terms")} className="hover:text-blue-700">
              {locale === "it" ? "Termini e condizioni" : "Terms and Conditions"}
            </Link>
            <Link href={localePath(locale, "/privacy")} className="hover:text-blue-700">
              {locale === "it" ? "Informativa sulla privacy" : "Privacy Policy"}
            </Link>
            <Link href={localePath(locale, "/cookies")} className="hover:text-blue-700">
              {locale === "it" ? "Informativa sui cookie" : "Cookie Policy"}
            </Link>
            <a href="mailto:info@moventoitalia.com" className="break-all text-blue-700 hover:text-blue-900">
              info@moventoitalia.com
            </a>
          </div>
        </nav>
      </div>
    </main>
  );
}
