import type { Locale } from "./config";

export function text(locale: Locale, english: string, italian: string) {
  return locale === "it" ? italian : english;
}
