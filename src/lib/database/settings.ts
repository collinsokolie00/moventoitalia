import "server-only";

import { unstable_cache } from "next/cache";
import { adminDb } from "./firebase-admin";

export const SETTINGS_COLLECTION = "siteContent";
export const SETTINGS_DOCUMENT = "settings";

export type SiteSettings = {
  legalCompanyName: string;
  publicTradingName: string;
  defaultSiteTitle: string;
  defaultSiteTitleIt:string;
  defaultSiteDescription: string;
  defaultSiteDescriptionIt:string;
  defaultSeoImageUrl: string;
  siteLocale: string;
  defaultCurrency: string;
  defaultCountry: string;
  defaultTimeZone: string;
  quoteReferencePrefix: string;
  contactFormRecipientEmail: string;
  quoteNotificationRecipientEmail: string;
  customerEmailSenderName: string;
  emailReplyToAddress: string;
  maintenanceModeEnabled: boolean;
  maintenanceMessage: string;
  maintenanceMessageIt:string;
};

const getCachedSiteSettings = unstable_cache(async (): Promise<SiteSettings | null> => {
  const snapshot = await adminDb.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOCUMENT).get();
  if (!snapshot.exists) return null;
  const data = snapshot.data() ?? {};
  return {
    legalCompanyName: data.legalCompanyName ?? "",
    publicTradingName: data.publicTradingName ?? "",
    defaultSiteTitle: data.defaultSiteTitle ?? "",
    defaultSiteTitleIt:data.defaultSiteTitleIt??"",
    defaultSiteDescription: data.defaultSiteDescription ?? "",
    defaultSiteDescriptionIt:data.defaultSiteDescriptionIt??"",
    defaultSeoImageUrl: data.defaultSeoImageUrl ?? "",
    siteLocale: data.siteLocale ?? "en-IT",
    defaultCurrency: data.defaultCurrency ?? "EUR",
    defaultCountry: data.defaultCountry ?? "IT",
    defaultTimeZone: data.defaultTimeZone ?? "Europe/Rome",
    quoteReferencePrefix: data.quoteReferencePrefix ?? "MOV",
    contactFormRecipientEmail: data.contactFormRecipientEmail ?? "",
    quoteNotificationRecipientEmail: data.quoteNotificationRecipientEmail ?? "",
    customerEmailSenderName: data.customerEmailSenderName ?? "Movento",
    emailReplyToAddress: data.emailReplyToAddress ?? "",
    maintenanceModeEnabled: Boolean(data.maintenanceModeEnabled),
    maintenanceMessage: data.maintenanceMessage ?? "",
    maintenanceMessageIt:data.maintenanceMessageIt??"",
  };
},["site-settings"],{revalidate:300,tags:["site-settings"]});

export async function getSiteSettings() {
  return getCachedSiteSettings();
}

export function formatSender(from: string, senderName: string) {
  const address = from.match(/<([^>]+)>/)?.[1] ?? from;
  return `${senderName.replace(/[\r\n<>]/g, "").trim()} <${address.trim()}>`;
}

export function formatCurrency(amount: number, settings: Pick<SiteSettings, "siteLocale" | "defaultCurrency">, locale = settings.siteLocale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: settings.defaultCurrency,
    maximumFractionDigits: 0,
  }).format(amount);
}
