import "server-only";

import { Resend } from "resend";

import type { QuoteRequestInput } from "@/lib/validation/quote";
import {
  formatCurrency,
  formatSender,
  type SiteSettings,
} from "@/lib/database/settings";

type SendQuoteEmailsOptions = {
  quoteId: string;
  quote: QuoteRequestInput;
  settings: SiteSettings | null;
};

type QuoteEmailStatus = {
  customerEmailSent: boolean;
  adminEmailSent: boolean;
  customerProviderMessageId?: string;
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

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSafeErrorCode(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof error.name === "string"
  ) {
    return error.name;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
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
  const from = process.env.EMAIL_FROM;

  const notificationEmail =
    settings?.quoteNotificationRecipientEmail ??
    process.env.MOVENTO_NOTIFICATION_EMAIL;

  if (!apiKey || !from) {
    console.warn(
      "[Movento Email] Quote stored, but emails were skipped because RESEND_API_KEY or EMAIL_FROM is missing.",
    );

    return {
      customerEmailSent: false,
      adminEmailSent: false,
    };
  }

  const resend = new Resend(apiKey);

  const sender = settings
    ? formatSender(from, settings.customerEmailSenderName)
    : from;

  const replyToAddress =
    settings?.emailReplyToAddress?.trim() || undefined;

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

  let customerEmailSent = false;
  let adminEmailSent = false;
  let customerProviderMessageId: string | undefined;

  /*
   * Automatic customer confirmation
   */
  try {
    const customerResult = await resend.emails.send({
      from: sender,
      to: quote.email,
      replyTo: replyToAddress,
      subject: `Movento quote request received — ${quoteId}`,
      html: `
        <div style="background:#f3f6fb;padding:32px 16px;font-family:Arial,sans-serif;color:#172033">
          <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #dbe4f0">
            <div style="background:#1d4ed8;padding:28px 32px">
              <p style="margin:0 0 8px;color:#bfdbfe;font-size:13px;font-weight:700;letter-spacing:2px">
                MOVENTO
              </p>

              <h1 style="margin:0;color:#ffffff;font-size:28px;line-height:1.25">
                Thank you for choosing Movento
              </h1>
            </div>

            <div style="padding:32px">
              <p style="margin:0 0 18px;font-size:17px;line-height:1.6">
                Hello ${safeName},
              </p>

              <p style="margin:0 0 24px;line-height:1.7">
                We have received your moving quotation request. Our team will
                review the information and contact you as soon as possible to
                confirm availability and the final quotation.
              </p>

              <div style="background:#f3f6fb;padding:22px;border-radius:14px;margin:24px 0">
                <p style="margin:0 0 14px;font-size:17px">
                  <strong>Reference:</strong> ${quoteId}
                </p>

                <p style="margin:8px 0">
                  <strong>Moving from:</strong> ${safeOrigin}
                </p>

                <p style="margin:8px 0">
                  <strong>Moving to:</strong> ${safeDestination}
                </p>

                <p style="margin:8px 0">
                  <strong>Preferred date:</strong> ${safeMovingDate}
                </p>

                <p style="margin:8px 0">
                  <strong>Property:</strong> ${safePropertyType}
                </p>

                <p style="margin:8px 0">
                  <strong>Rooms:</strong> ${safeRooms}
                </p>

                <p style="margin:8px 0">
                  <strong>Initial estimate:</strong> ${minimum}–${maximum}
                </p>
              </div>

              <p style="margin:24px 0 12px;line-height:1.7">
                This estimate is preliminary. The final price may change after
                Movento reviews the complete requirements of your move.
              </p>

              <p style="margin:0;line-height:1.7">
                Please keep your reference number for future communication.
              </p>

              <div style="background:#eff6ff;padding:20px;border-radius:14px;margin:24px 0">
                <p style="margin:0 0 8px;font-weight:700;color:#1e3a8a">
                  Need packing support?
                </p>
                <p style="margin:0;line-height:1.7;color:#334155">
                  Movento can add paid packing materials, professional packing
                  or professional unpacking to your final quotation. Reply to
                  this email and include reference ${quoteId}.
                </p>
              </div>

              ${process.env.NEXT_PUBLIC_SITE_URL ? `
                <p style="margin:24px 0 0">
                  <a href="${escapeHtml(process.env.NEXT_PUBLIC_SITE_URL)}"
                     style="display:inline-block;background:#1d4ed8;color:#ffffff;text-decoration:none;padding:13px 20px;border-radius:999px;font-weight:700">
                    Visit Movento
                  </a>
                </p>
              ` : ""}

              <div style="border-top:1px solid #e2e8f0;margin-top:30px;padding-top:22px">
                <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6">
                  This confirmation was sent automatically after your quotation
                  request was submitted.
                </p>
              </div>
            </div>
          </div>
        </div>
      `,
    });

    if (customerResult.error) {
      console.error("[Movento Email] Customer confirmation rejected", {
        reference: quoteId,
        code: customerResult.error.name ?? "provider-rejected",
        message: customerResult.error.message,
      });
    } else if (customerResult.data?.id) {
      customerEmailSent = true;
      customerProviderMessageId = customerResult.data.id;

      console.log("[Movento Email] Customer confirmation sent", {
        reference: quoteId,
        providerMessageId: customerResult.data.id,
      });
    } else {
      console.error(
        "[Movento Email] Customer confirmation returned no provider message ID",
        {
          reference: quoteId,
        },
      );
    }
  } catch (error) {
    console.error("[Movento Email] Customer confirmation request failed", {
      reference: quoteId,
      code: getSafeErrorCode(error),
    });
  }

  /*
   * Automatic administrator notification
   */
  if (notificationEmail) {
    try {
      const adminResult = await resend.emails.send({
        from: sender,
        to: notificationEmail,
        replyTo: quote.email,
        subject: `New Movento quote: ${safeOrigin} → ${safeDestination}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#172033">
            <h1>New quotation request</h1>

            <p><strong>Reference:</strong> ${quoteId}</p>
            <p><strong>Customer:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Telephone:</strong> ${safePhone}</p>
            <p>
              <strong>Route:</strong>
              ${safeOrigin} → ${safeDestination}
            </p>
            <p><strong>Property:</strong> ${safePropertyType}</p>
            <p><strong>Rooms:</strong> ${safeRooms}</p>
            <p><strong>Date:</strong> ${safeMovingDate}</p>
            <p>
              <strong>Estimate:</strong>
              ${minimum}–${maximum}
            </p>
            <p><strong>Notes:</strong> ${safeNotes}</p>
          </div>
        `,
      });

      if (adminResult.error) {
        console.error("[Movento Email] Admin notification rejected", {
          reference: quoteId,
          code: adminResult.error.name ?? "provider-rejected",
          message: adminResult.error.message,
        });
      } else if (adminResult.data?.id) {
        adminEmailSent = true;

        console.log("[Movento Email] Admin notification sent", {
          reference: quoteId,
          providerMessageId: adminResult.data.id,
        });
      } else {
        console.error(
          "[Movento Email] Admin notification returned no provider message ID",
          {
            reference: quoteId,
          },
        );
      }
    } catch (error) {
      console.error("[Movento Email] Admin notification request failed", {
        reference: quoteId,
        code: getSafeErrorCode(error),
      });
    }
  } else {
    console.warn(
      "[Movento Email] Admin notification skipped because no notification email is configured.",
    );
  }

  return {
    customerEmailSent,
    adminEmailSent,
    customerProviderMessageId,
  };
}

export async function sendAdminCustomerEmail({
  to,
  subject,
  message,
  settings,
}: SendAdminCustomerEmailOptions): Promise<AdminCustomerEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      success: false,
      code: "not-configured",
    };
  }

  const sender = settings
    ? formatSender(from, settings.customerEmailSenderName)
    : from;

  const replyToAddress =
    settings?.emailReplyToAddress?.trim() || undefined;

  try {
    const result = await new Resend(apiKey).emails.send({
      from: sender,
      to,
      replyTo: replyToAddress,
      subject,
      text: message,
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
      code: getSafeErrorCode(error),
    });

    return {
      success: false,
      code: "delivery-failed",
    };
  }
}
