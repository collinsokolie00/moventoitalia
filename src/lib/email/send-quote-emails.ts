import "server-only";

import { Resend } from "resend";

import type { QuoteRequestInput } from "@/lib/validation/quote";
import {
  formatCurrency,
  type SiteSettings,
} from "@/lib/database/settings";
import {
  escapeHtml,
  getSenderAddress,
  renderDetailRows,
  renderMoventoEmail,
} from "./template";

type SendQuoteEmailsOptions = {
  quoteId: string;
  quote: QuoteRequestInput;
  settings: SiteSettings | null;
};

type QuoteEmailStatus = {
  configurationValid: boolean;
  customerEmailAttempted: boolean;
  adminEmailAttempted: boolean;
  customerEmailSent: boolean;
  adminEmailSent: boolean;
  customerProviderMessageId?: string;
  adminProviderMessageId?: string;
};

type SendAdminCustomerEmailOptions = {
  to: string;
  subject: string;
  message: string;
  settings: SiteSettings | null;
};

export type AdminCustomerEmailResult =
  | { success: true; providerMessageId: string }
  | { success: false; code: "not-configured" | "delivery-failed" };

function getSafeErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    const name =
      "name" in error && typeof error.name === "string"
        ? `${error.name}: `
        : "";
    return `${name}${error.message}`.slice(0, 500);
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string"
  ) {
    return error.name;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "unknown-error";
}

export async function sendQuoteEmails({
  quoteId,
  quote,
  settings,
}: SendQuoteEmailsOptions): Promise<QuoteEmailStatus> {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM_EMAIL?.trim();

  const notificationEmail =
    process.env.MOVENTO_NOTIFICATION_EMAIL?.trim() ||
    settings?.quoteNotificationRecipientEmail?.trim() ||
    "";

  if (!apiKey || !sender) {
    console.error(
      "[Movento Email] Quote stored, but transactional email configuration is incomplete.",
      {
        reference: quoteId,
        resendApiKeyConfigured: Boolean(apiKey),
        resendFromEmailConfigured: Boolean(sender),
        customerEmailAttempted: false,
        adminEmailAttempted: false,
      },
    );

    return {
      configurationValid: false,
      customerEmailAttempted: false,
      adminEmailAttempted: false,
      customerEmailSent: false,
      adminEmailSent: false,
    };
  }

  const resend = new Resend(apiKey);
  const replyToAddress = getSenderAddress(sender);

  const minimum = settings
    ? formatCurrency(quote.estimatedMinimum, settings)
    : `€${quote.estimatedMinimum}`;

  const maximum = settings
    ? formatCurrency(quote.estimatedMaximum, settings)
    : `€${quote.estimatedMaximum}`;

  const safeName = escapeHtml(quote.name);
  const safeOrigin = escapeHtml(quote.origin);
  const safeDestination = escapeHtml(quote.destination);
  const safePhone = escapeHtml(quote.phone);
  const safeEmail = escapeHtml(quote.email);
  const safeMovingDate = escapeHtml(quote.movingDate);
  const safeNotes = escapeHtml(quote.notes || "None");
  const safePropertyType = escapeHtml(String(quote.propertyType));
  const safeRooms = escapeHtml(String(quote.rooms));

  const customerEmailAttempted = true;
  const adminEmailAttempted = Boolean(notificationEmail);

  console.info("[Movento Email] Starting quote email delivery", {
    reference: quoteId,
    customerEmailAttempted,
    adminEmailAttempted,
    notificationRecipientConfigured: Boolean(notificationEmail),
  });

  const sendCustomerConfirmation = async () => {
    const customerResult = await resend.emails.send({
      from: sender,
      to: quote.email,
      replyTo: replyToAddress,
      subject: `Movento quote request received — ${quoteId}`,
      html: renderMoventoEmail({
        eyebrow: "Quote confirmation",
        title: "Thank you for choosing Movento",
        preheader: `We received your quote request ${quoteId}.`,
        footerEmail: replyToAddress,
        cta: process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://")
          ? { href: process.env.NEXT_PUBLIC_SITE_URL, label: "Visit Movento" }
          : undefined,
        body: `
          <p style="margin:0 0 16px;font-size:17px;line-height:1.65">Hello ${safeName},</p>
          <p style="margin:0 0 24px;color:#334155;font-size:15px;line-height:1.75">
            We have received your moving quotation request. Our team will review the information and contact you as soon as possible to confirm availability and the final quotation.
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f6f8fc;border:1px solid #dbe4f0;border-radius:12px">
            <tr><td style="padding:20px">
              <p style="margin:0 0 10px;color:#0b3b8f;font-size:16px;font-weight:800">Quote details</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${renderDetailRows([
                  { label: "Reference", value: escapeHtml(quoteId) },
                  { label: "Moving from", value: safeOrigin },
                  { label: "Moving to", value: safeDestination },
                  { label: "Preferred date", value: safeMovingDate },
                  { label: "Property", value: safePropertyType },
                  { label: "Rooms", value: safeRooms },
                  { label: "Initial estimate", value: `${escapeHtml(minimum)}–${escapeHtml(maximum)}` },
                ])}
              </table>
            </td></tr>
          </table>
          <p style="margin:24px 0 12px;color:#334155;font-size:14px;line-height:1.7">
            This estimate is preliminary. The final price may change after Movento reviews the complete requirements of your move.
          </p>
          <p style="margin:0;color:#334155;font-size:14px;line-height:1.7">
            Please keep your reference number for future communication.
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-top:22px;background:#eaf2ff;border-radius:12px">
            <tr><td style="padding:18px">
              <p style="margin:0 0 6px;color:#0b3b8f;font-size:14px;font-weight:800">Need packing support?</p>
              <p style="margin:0;color:#334155;font-size:14px;line-height:1.65">
                Movento can add paid packing materials, professional packing or professional unpacking to your final quotation. Reply to this email and include reference ${escapeHtml(quoteId)}.
              </p>
            </td></tr>
          </table>
          <p style="margin:24px 0 0;color:#64748b;font-size:12px;line-height:1.6">
            This confirmation was sent automatically after your quotation request was submitted.
          </p>
        `,
      }),
    });

    if (customerResult.error) {
      throw new Error(
        `${customerResult.error.name ?? "provider-rejected"}: ${customerResult.error.message}`,
      );
    }
    if (!customerResult.data?.id) {
      throw new Error("Resend returned no customer message ID.");
    }
    return customerResult.data.id;
  };

  const sendAdminNotification = async () => {
    if (!notificationEmail) {
      throw new Error("MOVENTO_NOTIFICATION_EMAIL is not configured.");
    }
    const adminResult = await resend.emails.send({
      from: sender,
      to: notificationEmail,
      replyTo: quote.email,
      subject: `New Movento quote: ${quote.origin} → ${quote.destination}`,
      html: renderMoventoEmail({
        eyebrow: "New customer enquiry",
        title: "New quotation request",
        preheader: `${quote.name} requested a quote from ${quote.origin} to ${quote.destination}.`,
        footerEmail: replyToAddress,
        body: `
          <p style="margin:0 0 22px;color:#334155;font-size:15px;line-height:1.7">
            A customer has submitted a new moving quotation request. Replying to this email will reply directly to the customer.
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f6f8fc;border:1px solid #dbe4f0;border-radius:12px">
            <tr><td style="padding:20px">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${renderDetailRows([
                  { label: "Reference", value: escapeHtml(quoteId) },
                  { label: "Customer", value: safeName },
                  { label: "Email", value: safeEmail },
                  { label: "Telephone", value: safePhone },
                  { label: "Route", value: `${safeOrigin} → ${safeDestination}` },
                  { label: "Property", value: safePropertyType },
                  { label: "Rooms", value: safeRooms },
                  { label: "Date", value: safeMovingDate },
                  { label: "Estimate", value: `${escapeHtml(minimum)}–${escapeHtml(maximum)}` },
                  { label: "Notes", value: safeNotes.replaceAll("\n", "<br>") },
                ])}
              </table>
            </td></tr>
          </table>
        `,
      }),
    });
    if (adminResult.error) {
      throw new Error(
        `${adminResult.error.name ?? "provider-rejected"}: ${adminResult.error.message}`,
      );
    }
    if (!adminResult.data?.id) {
      throw new Error("Resend returned no admin message ID.");
    }
    return adminResult.data.id;
  };

  const [customerResult, adminResult] = await Promise.allSettled([
    sendCustomerConfirmation(),
    notificationEmail
      ? sendAdminNotification()
      : Promise.reject(new Error("MOVENTO_NOTIFICATION_EMAIL is not configured.")),
  ]);

  const customerEmailSent = customerResult.status === "fulfilled";
  const adminEmailSent = adminResult.status === "fulfilled";
  const customerProviderMessageId =
    customerResult.status === "fulfilled" ? customerResult.value : undefined;
  const adminProviderMessageId =
    adminResult.status === "fulfilled" ? adminResult.value : undefined;

  if (customerResult.status === "fulfilled") {
    console.info("[Movento Email] Customer confirmation accepted by Resend", {
      reference: quoteId,
      customerEmailAttempted: true,
      providerMessageId: customerResult.value,
    });
  } else {
    console.error("[Movento Email] Customer confirmation failed", {
      reference: quoteId,
      customerEmailAttempted: true,
      error: getSafeErrorMessage(customerResult.reason),
    });
  }

  if (adminResult.status === "fulfilled") {
    console.info("[Movento Email] Admin notification accepted by Resend", {
      reference: quoteId,
      adminEmailAttempted: true,
      providerMessageId: adminResult.value,
    });
  } else {
    console.error("[Movento Email] Admin notification failed", {
      reference: quoteId,
      adminEmailAttempted,
      error: getSafeErrorMessage(adminResult.reason),
    });
  }

  return {
    configurationValid: true,
    customerEmailAttempted,
    adminEmailAttempted,
    customerEmailSent,
    adminEmailSent,
    customerProviderMessageId,
    adminProviderMessageId,
  };
}

export async function sendAdminCustomerEmail({
  to,
  subject,
  message,
  settings,
}: SendAdminCustomerEmailOptions): Promise<AdminCustomerEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !sender) {
    console.error(
      "[Movento Email] Manual customer email skipped because RESEND_API_KEY or RESEND_FROM_EMAIL is missing.",
    );
    return {
      success: false,
      code: "not-configured",
    };
  }

  const replyToAddress = getSenderAddress(sender);

  try {
    const result = await new Resend(apiKey).emails.send({
      from: sender,
      to,
      replyTo: replyToAddress,
      subject,
      text: message,
      html: renderMoventoEmail({
        eyebrow: `Message from ${settings?.publicTradingName?.trim() || "Movento"}`,
        title: subject,
        preheader: message.slice(0, 140),
        footerEmail: replyToAddress,
        body: `
          <div style="color:#334155;font-size:15px;line-height:1.75">
            ${escapeHtml(message).replaceAll("\n", "<br>")}
          </div>
        `,
      }),
    });

    if (result.error || !result.data?.id) {
      console.error("[Movento Email] Manual customer email rejected", {
        code: result.error?.name ?? "provider-rejected",
        message: result.error?.message,
      });

      return {
        success: false,
        code: "delivery-failed",
      };
    }

    return {
      success: true,
      providerMessageId: result.data.id,
    };
  } catch (error) {
    console.error("[Movento Email] Manual customer email request failed", {
      error: getSafeErrorMessage(error),
    });

    return {
      success: false,
      code: "delivery-failed",
    };
  }
}
