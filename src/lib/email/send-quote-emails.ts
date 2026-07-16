import { Resend } from "resend";

import type { QuoteRequestInput } from "@/lib/validation/quote";

type SendQuoteEmailsOptions = {
    quoteId: string;
    quote: QuoteRequestInput;
};

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

export async function sendQuoteEmails({
    quoteId,
    quote,
}: SendQuoteEmailsOptions) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    const notificationEmail = process.env.MOVENTO_NOTIFICATION_EMAIL;

    if (!apiKey || !from) {
        console.warn(
            "Quote stored successfully, but email was skipped because Resend is not configured.",
        );

        return {
            customerEmailSent: false,
            adminEmailSent: false,
        };
    }

    const resend = new Resend(apiKey);

    const safeName = escapeHtml(quote.name);
    const safeOrigin = escapeHtml(quote.origin);
    const safeDestination = escapeHtml(quote.destination);
    const safePhone = escapeHtml(quote.phone);
    const safeEmail = escapeHtml(quote.email);

    const customerResult = await resend.emails.send({
        from,
        to: quote.email,
        subject: `Movento quote request received — ${quoteId}`,
        html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#172033">
        <h1 style="color:#1d4ed8">Thank you, ${safeName}</h1>

        <p>Movento has received your moving quotation request.</p>

        <div style="background:#f3f6fb;padding:20px;border-radius:14px;margin:24px 0">
          <p><strong>Reference:</strong> ${quoteId}</p>
          <p><strong>Moving from:</strong> ${safeOrigin}</p>
          <p><strong>Moving to:</strong> ${safeDestination}</p>
          <p><strong>Preferred date:</strong> ${escapeHtml(quote.movingDate)}</p>
          <p>
            <strong>Initial estimate:</strong>
            €${quote.estimatedMinimum}–€${quote.estimatedMaximum}
          </p>
        </div>

        <p>
          This is an initial estimate. The Movento team will review your
          information and contact you to confirm the final price and availability.
        </p>

        <p>Keep your reference number for future communication.</p>
      </div>
    `,
    });

    let adminEmailSent = false;

    if (notificationEmail) {
        const adminResult = await resend.emails.send({
            from,
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
          <p><strong>Route:</strong> ${safeOrigin} → ${safeDestination}</p>
          <p><strong>Property:</strong> ${quote.propertyType}</p>
          <p><strong>Rooms:</strong> ${quote.rooms}</p>
          <p><strong>Date:</strong> ${escapeHtml(quote.movingDate)}</p>
          <p>
            <strong>Estimate:</strong>
            €${quote.estimatedMinimum}–€${quote.estimatedMaximum}
          </p>
          <p><strong>Notes:</strong> ${escapeHtml(quote.notes || "None")}</p>
        </div>
      `,
        });

        adminEmailSent = !adminResult.error;
    }

    return {
        customerEmailSent: !customerResult.error,
        adminEmailSent,
    };
}