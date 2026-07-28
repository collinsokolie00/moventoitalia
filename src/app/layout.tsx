import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getRequestLocale } from "@/lib/i18n/server";
import { intlLocales, openGraphLocales } from "@/lib/i18n/config";
import { absoluteUrl, getSeoSettings, getSiteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale, metadataBase] = await Promise.all([
    getSeoSettings(),
    getRequestLocale(),
    getSiteUrl(),
  ]);
  const siteName = settings?.publicTradingName.trim() || "Movento";
  const title =
    (locale === "it" ? settings?.defaultSiteTitleIt.trim() : "") ||
    settings?.defaultSiteTitle.trim() ||
    siteName;
  const description =
    (locale === "it" ? settings?.defaultSiteDescriptionIt.trim() : "") ||
    settings?.defaultSiteDescription.trim() ||
    (locale === "it"
      ? "Servizi di trasloco professionali."
      : "Professional moving services.");
  const image = await absoluteUrl(settings?.defaultSeoImageUrl || "");
  return {
    metadataBase,
    applicationName: siteName,
    title,
    description,
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      locale: openGraphLocales[locale],
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
    other: {
      google: "notranslate",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  return (
    <html
      lang={intlLocales[locale]}
      translate="no"
      className={`${geistSans.variable} notranslate h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
