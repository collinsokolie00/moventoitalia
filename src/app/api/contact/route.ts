import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getContactContent } from "@/lib/database/contact";
import { getSiteSettings } from "@/lib/database/settings";
import {
  escapeHtml,
  getSenderAddress,
  renderDetailRows,
  renderMoventoEmail,
} from "@/lib/email/template";
import { contactRequestSchema } from "@/lib/validation/contact";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const italian = request.headers.get("x-movento-locale") === "it";
  const tr = (en: string, it: string) => (italian ? it : en);

  try {
    const body: unknown = await request.json();
    const parsed = contactRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: tr(
            "Please check the submitted information.",
            "Controlla le informazioni inserite.",
          ),
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const sender = process.env.RESEND_FROM_EMAIL?.trim();
    if (!apiKey || !sender) {
      console.error(
        "[Movento Email] Contact emails skipped because RESEND_API_KEY or RESEND_FROM_EMAIL is missing.",
      );
      return NextResponse.json(
        {
          success: false,
          message: tr(
            "Email delivery is temporarily unavailable.",
            "L’invio email non è momentaneamente disponibile.",
          ),
        },
        { status: 503 },
      );
    }

    const [contact, settings] = await Promise.all([
      getContactContent(),
      getSiteSettings(),
    ]);
    const to =
      settings?.contactFormRecipientEmail ??
      process.env.MOVENTO_NOTIFICATION_EMAIL ??
      contact?.email;

    if (!to) {
      return NextResponse.json(
        {
          success: false,
          message: tr(
            "Contact email is not configured.",
            "L’indirizzo email di contatto non è configurato.",
          ),
        },
        { status: 503 },
      );
    }

    const value = parsed.data;
    const resend = new Resend(apiKey);
    const replyToAddress = getSenderAddress(sender);
    const safeName = escapeHtml(value.name);
    const safeEmail = escapeHtml(value.email);
    const safePhone = escapeHtml(value.phone || "Not provided");
    const safeSubject = escapeHtml(value.subject);
    const safeMessage = escapeHtml(value.message).replaceAll("\n", "<br>");
    const tradingName = settings?.publicTradingName?.trim() || "Movento";

    const adminResult = await resend.emails.send({
      from: sender,
      to,
      replyTo: value.email,
      subject: `${tradingName} contact request: ${value.subject}`,
      html: renderMoventoEmail({
        eyebrow: "New customer message",
        title: "New contact request",
        preheader: `${value.name} sent a new contact request.`,
        footerEmail: replyToAddress,
        body: `
          <p style="margin:0 0 22px;color:#334155;font-size:15px;line-height:1.7">
            A customer submitted the contact form. Replying to this notification will reply directly to the customer.
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f6f8fc;border:1px solid #dbe4f0;border-radius:12px">
            <tr><td style="padding:20px">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${renderDetailRows([
                  { label: "Name", value: safeName },
                  { label: "Email", value: safeEmail },
                  { label: "Telephone", value: safePhone },
                  { label: "Subject", value: safeSubject },
                  { label: "Message", value: safeMessage },
                ])}
              </table>
            </td></tr>
          </table>
          <p style="margin:22px 0 0;color:#64748b;font-size:12px;line-height:1.6">
            Delivered for ${escapeHtml(settings?.legalCompanyName || "Movento")}
          </p>
        `,
      }),
    });

    if (adminResult.error) {
      console.error("Contact email error:", adminResult.error);
      return NextResponse.json(
        {
          success: false,
          message: tr(
            "Your message could not be sent. Please try again.",
            "Non è stato possibile inviare il messaggio. Riprova.",
          ),
        },
        { status: 502 },
      );
    }

    try {
      const customerResult = await resend.emails.send({
        from: sender,
        to: value.email,
        replyTo: replyToAddress,
        subject: tr(
          "Movento received your message",
          "Movento ha ricevuto il tuo messaggio",
        ),
        html: renderMoventoEmail({
          eyebrow: tr("Contact confirmation", "Conferma di contatto"),
          title: tr(
            "Thank you for contacting Movento",
            "Grazie per aver contattato Movento",
          ),
          preheader: tr(
            "We received your message and will reply as soon as possible.",
            "Abbiamo ricevuto il tuo messaggio e risponderemo al più presto.",
          ),
          footerEmail: replyToAddress,
          body: `
            <p style="margin:0 0 16px;font-size:17px;line-height:1.65">
              ${tr("Hello", "Ciao")} ${safeName},
            </p>
            <p style="margin:0 0 22px;color:#334155;font-size:15px;line-height:1.75">
              ${tr(
                "We have received your contact request. Our team will review your message and reply as soon as possible.",
                "Abbiamo ricevuto la tua richiesta di contatto. Il nostro team esaminerà il messaggio e risponderà al più presto.",
              )}
            </p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f6f8fc;border:1px solid #dbe4f0;border-radius:12px">
              <tr><td style="padding:20px">
                <p style="margin:0 0 8px;color:#0b3b8f;font-size:14px;font-weight:800">${tr("Your subject", "Oggetto")}</p>
                <p style="margin:0;color:#334155;font-size:14px;line-height:1.7">${safeSubject}</p>
              </td></tr>
            </table>
          `,
        }),
      });

      if (customerResult.error) {
        console.error(
          "[Movento Email] Contact confirmation rejected",
          customerResult.error,
        );
      }
    } catch (confirmationError) {
      console.error(
        "[Movento Email] Contact confirmation request failed",
        confirmationError,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: tr(
          "Your message has been sent.",
          "Il tuo messaggio è stato inviato.",
        ),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: tr(
          "Your message could not be sent. Please try again.",
          "Non è stato possibile inviare il messaggio. Riprova.",
        ),
      },
      { status: 500 },
    );
  }
}
