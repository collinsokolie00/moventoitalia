import type { QuoteRequestInput } from "@/lib/validation/quote";

export const quoteConfirmationStorageKey =
  "movento:recent-quote-confirmation:v1";

export const quoteConfirmationLifetimeMs = 30 * 60 * 1000;

export type QuoteConfirmationPayload = {
  version: 1;
  quoteId: string;
  submittedAt: number;
  expiresAt: number;
  currency: string;
  locale: string;
  quote: QuoteRequestInput;
};

export function isQuoteConfirmationPayload(
  value: unknown,
): value is QuoteConfirmationPayload {
  if (!value || typeof value !== "object") return false;

  const payload = value as Partial<QuoteConfirmationPayload>;
  const quote = payload.quote as Partial<QuoteRequestInput> | undefined;

  return (
    payload.version === 1 &&
    typeof payload.quoteId === "string" &&
    payload.quoteId.length >= 8 &&
    typeof payload.submittedAt === "number" &&
    typeof payload.expiresAt === "number" &&
    payload.expiresAt > Date.now() &&
    typeof payload.currency === "string" &&
    typeof payload.locale === "string" &&
    Boolean(quote) &&
    typeof quote?.name === "string" &&
    typeof quote?.email === "string" &&
    typeof quote?.phone === "string" &&
    typeof quote?.origin === "string" &&
    typeof quote?.destination === "string" &&
    typeof quote?.movingDate === "string" &&
    typeof quote?.propertyType === "string" &&
    typeof quote?.rooms === "number" &&
    typeof quote?.estimatedMinimum === "number" &&
    typeof quote?.estimatedMaximum === "number"
  );
}
