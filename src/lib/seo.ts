import "server-only";

import type { Metadata } from "next";
import { headers } from "next/headers";
import { cache } from "react";

import { getSiteSettings } from "@/lib/database/settings";
import { intlLocales, localePath, locales, openGraphLocales } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

const developmentUrl = new URL("http://localhost:3000");
const productionUrl = new URL("https://moventoitalia.com");

function parseOrigin(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return null;
  }
}

function isLoopback(url: URL) {
  return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";
}

export const getSeoSettings = cache(async () => {
  try {
    return await getSiteSettings();
  } catch {
    console.error("[Movento SEO] Site settings are temporarily unavailable.");
    return null;
  }
});

export const getSiteUrl = cache(async () => {
  const configured = parseOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (configured && (process.env.NODE_ENV !== "production" || !isLoopback(configured))) {
    return configured;
  }

  if (process.env.NODE_ENV === "production") return productionUrl;

  const deployment = parseOrigin(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL,
  );
  if (deployment) return deployment;

  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol === "http" || forwardedProtocol === "https"
    ? forwardedProtocol
    : "http";
  const requestOrigin = parseOrigin(host ? `${protocol}://${host}` : null);
  return requestOrigin ?? developmentUrl;
});

export function canonicalPath(path: string, locale: Awaited<ReturnType<typeof getRequestLocale>> = "en") {
  return localePath(locale, path);
}

export async function absoluteUrl(value: string) {
  if (!value) return undefined;
  try {
    return new URL(value, await getSiteUrl()).toString();
  } catch {
    return undefined;
  }
}

type PageMetadataInput = {
  path: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  index?: boolean;
};

export async function createPageMetadata({
  path,
  title,
  description,
  image,
  imageAlt,
  index = true,
}: PageMetadataInput): Promise<Metadata> {
  const [settings, locale, baseUrl] = await Promise.all([
    getSeoSettings(),
    getRequestLocale(),
    getSiteUrl(),
  ]);
  const siteName = settings?.publicTradingName.trim() || "Movento";
  const localizedDefaultTitle=locale==="it"&&settings?.defaultSiteTitleIt.trim()?settings.defaultSiteTitleIt:settings?.defaultSiteTitle;
  const localizedDefaultDescription=locale==="it"&&settings?.defaultSiteDescriptionIt.trim()?settings.defaultSiteDescriptionIt:settings?.defaultSiteDescription;
  const safeTitle = title?.trim() || localizedDefaultTitle?.trim() || siteName;
  const safeDescription = description?.trim()
    || localizedDefaultDescription?.trim()
    || (locale==="it"?"Servizi di trasloco professionali.":"Professional moving services.");
  const canonical = new URL(canonicalPath(path, locale), baseUrl).toString();
  const languages = Object.fromEntries(
    locales.map((item) => [intlLocales[item], new URL(localePath(item, path), baseUrl).toString()]),
  );
  languages["x-default"] = new URL(localePath("en", path), baseUrl).toString();
  const socialImage = await absoluteUrl(image || settings?.defaultSeoImageUrl || "");

  return {
    title: safeTitle,
    description: safeDescription,
    alternates: index ? { canonical, languages } : undefined,
    robots: index
      ? undefined
      : {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false, noimageindex: true },
        },
    openGraph: {
      type: "website",
      siteName,
      title: safeTitle,
      description: safeDescription,
      url: index ? canonical : undefined,
      locale: openGraphLocales[locale],
      images: socialImage ? [{ url: socialImage, alt: imageAlt || safeTitle }] : undefined,
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title: safeTitle,
      description: safeDescription,
      images: socialImage ? [socialImage] : undefined,
    },
    other: {
      "content-language": intlLocales[locale],
    },
  };
}
