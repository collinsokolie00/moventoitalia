import { defaultLocale, type Locale } from "./config";

export type Localized<T> = Record<Locale, T>;
export type Localizable<T> = T | Partial<Localized<T>>;

export function normalizeLocalized<T>(value: Localizable<T> | null | undefined, fallback: T): Localized<T> {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    const legacy = (value ?? fallback) as T;
    return { en: legacy, it: fallback };
  }
  const translations = value as Partial<Localized<T>>;
  const english = translations.en ?? translations.it ?? fallback;
  return {
    en: english,
    it: translations.it ?? fallback,
  };
}

export function hasCompleteLocalization<T>(value: Localizable<T> | null | undefined, valid: (item:T)=>boolean): value is Localized<T> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return (["en","it"] as const).every(locale => valid((value as Partial<Localized<T>>)[locale] as T));
}

export function localized<T>(value: Localizable<T> | null | undefined, locale: Locale): T | undefined {
  if (value == null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) return value as T;
  const translations = value as Partial<Localized<T>>;
  const result = translations[locale] ?? translations.en ?? translations[defaultLocale];
  if (result === undefined && process.env.NODE_ENV === "development") {
    console.warn(`[i18n] Missing ${locale} and English fallback for localized CMS value.`);
  }
  return result;
}

export function localizedRequired(value: Localizable<string> | null | undefined, locale: Locale) {
  return localized(value, locale) ?? "";
}
