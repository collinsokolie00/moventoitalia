import type { Metadata } from "next";

import QuoteConfirmation from "@/components/quote/QuoteConfirmation";
import { getContactContent } from "@/lib/database/contact";
import { getRequestLocale } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export async function generateMetadata():Promise<Metadata>{const locale=await getRequestLocale();return{title:locale==="it"?"Preventivo ricevuto | Movento":"Quotation Received | Movento",description:locale==="it"?"Conferma della ricezione della richiesta di preventivo da parte di Movento.":"Confirmation that Movento has received your moving quotation request.",robots:{index:false,follow:false}};}

export default async function QuoteConfirmationPage() {
  const locale=await getRequestLocale();
  const contact=await getContactContent(locale);

  return (
    <QuoteConfirmation
      homePath={localePath(locale, "/")}
      contactPath={localePath(locale, "/contact")}
      whatsapp={contact?.whatsapp ?? ""}
      phone={contact?.phone ?? ""}
      email={contact?.email ?? ""}
      locale={locale}
    />
  );
}
