"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import {
  getQuote,
  recordQuoteEmailContact,
  updateQuoteWorkflowStatus,
} from "@/lib/database/quotes";
import { getSiteSettings } from "@/lib/database/settings";
import { sendAdminCustomerEmail } from "@/lib/email/send-quote-emails";
import { quoteWorkflowStatuses } from "@/lib/quotes/types";

export type QuoteActionState = { status: "success" | "error"; message: string } | undefined;

const quoteIdSchema = z.string().trim().min(1).max(100).regex(/^[A-Za-z0-9_-]+$/);
const statusSchema = z.enum(quoteWorkflowStatuses);
const customerEmailSchema = z.object({
  quoteId: quoteIdSchema,
  recipient: z.email().max(320),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000),
});

function revalidateQuotePages(quoteId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${quoteId}`);
}

export async function updateQuoteStatus(_state: QuoteActionState, formData: FormData): Promise<QuoteActionState> {
  await requireAdmin();
  const parsed = z.object({
    quoteId: quoteIdSchema,
    status: statusSchema,
    confirmCompletedRegression: z.boolean(),
  }).safeParse({
    quoteId: formData.get("quoteId"),
    status: formData.get("status"),
    confirmCompletedRegression: formData.get("confirmCompletedRegression") === "yes",
  });
  if (!parsed.success) return { status: "error", message: "Select a valid workflow status." };

  const result = await updateQuoteWorkflowStatus(parsed.data);
  if (!result.ok && result.reason === "not-found") return { status: "error", message: "This quote request no longer exists." };
  if (!result.ok && result.reason === "confirm-completed-regression") {
    return { status: "error", message: "Confirm that you want to reopen this completed request." };
  }

  revalidateQuotePages(parsed.data.quoteId);
  return { status: "success", message: "Workflow status saved." };
}

export async function sendQuoteCustomerEmail(_state: QuoteActionState, formData: FormData): Promise<QuoteActionState> {
  const administrator = await requireAdmin();
  const parsed = customerEmailSchema.safeParse({
    quoteId: formData.get("quoteId"),
    recipient: formData.get("recipient"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the email fields." };

  const quote = await getQuote(parsed.data.quoteId);
  if (!quote) return { status: "error", message: "This quote request no longer exists." };
  if (quote.email.trim().toLowerCase() !== parsed.data.recipient.trim().toLowerCase()) {
    return { status: "error", message: "The recipient must match the customer email stored with this request." };
  }

  const settings = await getSiteSettings();
  const result = await sendAdminCustomerEmail({
    to: quote.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    settings,
  });

  await recordQuoteEmailContact({
    quoteId: quote.id,
    subject: parsed.data.subject,
    deliveryStatus: result.success ? "sent" : "failed",
    providerMessageId: result.success ? result.providerMessageId : undefined,
    administrator,
  });
  revalidateQuotePages(quote.id);

  if (!result.success) {
    return {
      status: "error",
      message: result.code === "not-configured"
        ? "Email is not configured. The customer was not marked as contacted."
        : "The email could not be delivered. The customer was not marked as contacted.",
    };
  }
  return { status: "success", message: "Email sent successfully. The contact attempt has been recorded." };
}
