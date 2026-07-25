import "server-only";

import { headers } from "next/headers";
import { defaultLocale, isLocale, localeHeaderName, type Locale } from "./config";

export async function getRequestLocale(): Promise<Locale> {
  const value = (await headers()).get(localeHeaderName);
  return isLocale(value) ? value : defaultLocale;
}

