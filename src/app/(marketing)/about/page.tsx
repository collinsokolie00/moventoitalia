import PageIntro from "@/components/layout/PageIntro";
import { createPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/i18n/server";
import { text } from "@/lib/i18n/text";

export async function generateMetadata() {
  const locale=await getRequestLocale();
  return createPageMetadata({
    path: "/about",
    title: text(locale,"About Movento | Professional Moving Services","Chi è Movento | Servizi di trasloco professionali"),
    description: text(locale,"Learn how Movento combines careful moving services, clear communication and modern booking for a more professional move.","Scopri come Movento unisce servizi accurati, comunicazione chiara e prenotazioni moderne."),
  });
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  return (
    <PageIntro
      eyebrow={text(locale, "About Movento", "Chi è Movento")}
      title={text(locale, "A more professional way to move", "Un modo più professionale di traslocare")}
      description={text(locale, "Movento combines careful physical service with modern booking, transparent communication and technology that makes every move easier to manage.", "Movento unisce un servizio accurato a prenotazioni moderne, comunicazione trasparente e tecnologia, per rendere ogni trasloco più semplice da gestire.")}
      locale={locale}
    />
  );
}
