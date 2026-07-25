import QuoteCalculator from "@/components/quote/QuoteCalculator";
import { getSiteSettings } from "@/lib/database/settings";
import { getRequestLocale } from "@/lib/i18n/server";
import { intlLocales, localePath } from "@/lib/i18n/config";
import { createPageMetadata } from "@/lib/seo";
import { text } from "@/lib/i18n/text";

export async function generateMetadata() {
  const locale=await getRequestLocale();
  return createPageMetadata({
    path: "/quote",
    title: text(locale,"Moving Cost Estimate | Movento","Preventivo costo trasloco | Movento"),
    description: text(locale,"Calculate an initial moving-price estimate for home moves, office relocations, furniture transport, packing and assembly.","Calcola una stima iniziale per traslochi casa e ufficio, trasporto mobili, imballaggio e montaggio."),
  });
}

export const dynamic = "force-dynamic";

export default async function QuotePage() {
  const [settings, locale] = await Promise.all([getSiteSettings(), getRequestLocale()]);
  return (
    <>
      <section className="bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
            {text(locale, "Moving estimate", "Preventivo di trasloco")}
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl">
            {text(locale, "Calculate the likely cost of your move.", "Calcola il costo indicativo del tuo trasloco.")}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            {text(locale, "Complete the short questionnaire to receive an initial price range. No account is required.", "Compila il breve questionario per ricevere una prima fascia di prezzo. Non è necessario creare un account.")}
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <QuoteCalculator
            language={locale}
            locale={intlLocales[locale]}
            currency={settings?.defaultCurrency}
            confirmationPath={localePath(locale, "/quote/confirmation")}
          />
        </div>
      </section>
    </>
  );
}
