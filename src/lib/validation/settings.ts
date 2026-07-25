import { z } from "zod";

function validLocale(value: string) {
  try { Intl.getCanonicalLocales(value); return true; } catch { return false; }
}

function validTimeZone(value: string) {
  try { new Intl.DateTimeFormat("en", { timeZone: value }).format(); return true; } catch { return false; }
}

export const settingsSchema = z.object({
  legalCompanyName: z.string().trim().min(2).max(160),
  publicTradingName: z.string().trim().min(2).max(100),
  defaultSiteTitle: z.string().trim().min(3).max(70),
  defaultSiteTitleIt:z.string().trim().max(70),
  defaultSiteDescription: z.string().trim().min(20).max(180),
  defaultSiteDescriptionIt:z.string().trim().max(180),
  defaultSeoImageUrl: z.union([z.literal(""), z.url()]),
  siteLocale: z.string().trim().min(2).max(35).refine(validLocale, "Use a valid locale such as en-IT."),
  defaultCurrency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/, "Use a three-letter ISO currency code."),
  defaultCountry: z.string().trim().toUpperCase().regex(/^[A-Z]{2}$/, "Use a two-letter ISO country code."),
  defaultTimeZone: z.string().trim().min(3).max(100).refine(validTimeZone, "Use a valid IANA time zone such as Europe/Rome."),
  quoteReferencePrefix: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{2,12}$/, "Use 2–12 uppercase letters or numbers."),
  contactFormRecipientEmail: z.email(),
  quoteNotificationRecipientEmail: z.email(),
  customerEmailSenderName: z.string().trim().min(2).max(100).regex(/^[^\r\n<>]+$/, "Sender name contains unsupported characters."),
  emailReplyToAddress: z.email(),
  maintenanceModeEnabled: z.boolean(),
  maintenanceMessage: z.string().trim().min(10).max(500),
  maintenanceMessageIt:z.string().trim().max(500),
});
