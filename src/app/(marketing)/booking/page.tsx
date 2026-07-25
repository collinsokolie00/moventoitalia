import PageIntro from "@/components/layout/PageIntro";
import { getRequestLocale } from "@/lib/i18n/server";
import { text } from "@/lib/i18n/text";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createPageMetadata({
    path: "/booking",
    title: "Online Booking | Movento",
    description: "Movento online booking is not currently available.",
    index: false,
  });
}

export default async function BookingPage() {
  const locale=await getRequestLocale();
  return (
    <PageIntro
      eyebrow={text(locale,"Online Booking","Prenotazione online")}
      title={text(locale,"Reserve your preferred moving date","Prenota la data preferita per il trasloco")}
      description={text(locale,"Customers will be able to select a date, provide moving information, upload photographs and submit a booking request without being forced to create an account.","Puoi scegliere una data, fornire le informazioni sul trasloco, caricare fotografie e inviare una richiesta senza dover creare un account.")}
      locale={locale}
    />
  );
}
