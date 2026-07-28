import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MaintenancePage from "@/components/layout/MaintenancePage";
import RouteLoadingTransition from "@/components/layout/RouteLoadingTransition";
import CookieConsent from "@/components/cookies/CookieConsent";
import SiteStructuredData from "@/components/seo/SiteStructuredData";
import { getSiteChrome } from "@/lib/database/site-chrome";
import { getSiteSettings } from "@/lib/database/settings";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const locale = await getRequestLocale();
  if (settings?.maintenanceModeEnabled) {
    return <MaintenancePage settings={settings} chrome={await getSiteChrome()} locale={locale} />;
  }
  return (
    <>
      <SiteStructuredData />
      <RouteLoadingTransition />
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieConsent locale={locale} />
    </>
  );
}
