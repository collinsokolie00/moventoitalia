export const locales = ["en", "it"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const publicLocale: Locale = "en";
export const localeCookieName = "movento-locale";
export const localeHeaderName = "x-movento-locale";

export const localeNames: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
};

export const intlLocales: Record<Locale, string> = {
  it: "it-IT",
  en: "en-GB",
};

export const openGraphLocales: Record<Locale, string> = {
  it: "it_IT",
  en: "en_GB",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function localePath(locale: Locale, href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (href.startsWith("/admin") || href.startsWith("/api") || href.startsWith("/_next")) return href;
  const [path, suffix = ""] = href.split(/(?=[?#])/u, 2);
  const segments = path.split("/");
  if (isLocale(segments[1])) segments.splice(1, 1);
  const normalized = segments.join("/") || "/";
  return `/${locale}${normalized === "/" ? "" : normalized}${suffix}`;
}

export function switchLocalePath(pathname: string, locale: Locale) {
  return localePath(locale, pathname);
}

export function pathnameWithoutLocale(pathname:string) {
  const segments=pathname.split("/");
  if(isLocale(segments[1])) segments.splice(1,1);
  return segments.join("/")||"/";
}

export function isNavigationPathActive(pathname:string,href:string) {
  const current=pathnameWithoutLocale(pathname);
  const target=pathnameWithoutLocale(href);
  if(target==="/") return current==="/";
  return current===target||current.startsWith(`${target}/`);
}
