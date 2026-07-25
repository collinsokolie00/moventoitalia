import type { Locale } from "./config";

const it = {
  language: { label: "Lingua", change: "Cambia lingua" },
  navigation: { open: "Apri menu di navigazione", close: "Chiudi menu di navigazione", home: "pagina iniziale" },
  common: { estimate: "Richiedi un preventivo", contact: "Contatta Movento", loading: "Caricamento…", unavailable: "Contenuto temporaneamente non disponibile." },
};

export type Messages = typeof it;
const messages: Record<Locale, Messages> = {
  it,
  en: { language: { label: "Language", change: "Change language" }, navigation: { open: "Open navigation menu", close: "Close navigation menu", home: "home" }, common: { estimate: "Get an Estimate", contact: "Contact Movento", loading: "Loading…", unavailable: "Content is temporarily unavailable." } },
};

export function getMessages(locale: Locale): Messages { return messages[locale] ?? it; }
