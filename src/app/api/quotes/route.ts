import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { adminDb } from "@/lib/database/firebase-admin";
import { sendQuoteEmails } from "@/lib/email/send-quote-emails";
import { quoteRequestSchema } from "@/lib/validation/quote";
import { getSiteSettings } from "@/lib/database/settings";
import { recordAutomaticQuoteEmailContact } from "@/lib/database/quotes";

export const runtime = "nodejs";

function createQuoteReference(prefix: string) {
    const date = new Date();
    const datePart = date.toISOString().slice(0, 10).replaceAll("-", "");
    const randomPart = crypto.randomUUID().slice(0, 6).toUpperCase();

    return `${prefix}-${datePart}-${randomPart}`;
}

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        const italian=Boolean(body&&typeof body==="object"&&"language" in body&&(body as {language?:unknown}).language==="it");
        const parsed = quoteRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: italian?"Controlla le informazioni inserite.":"Please check the submitted information.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const quote = parsed.data;
        const settings = await getSiteSettings();
        const quoteId = createQuoteReference(settings?.quoteReferencePrefix ?? "MOV");

        await adminDb.collection("quotes").doc(quoteId).set({
            ...quote,
            reference: quoteId,
            status: "new",
            readAt: null,
            contactedAt: null,
            quotedAt: null,
            completedAt: null,
            statusUpdatedAt: FieldValue.serverTimestamp(),
            source: "website",
            customerAccountId: null,
            currency: settings?.defaultCurrency ?? "EUR",
            country: settings?.defaultCountry ?? "IT",
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        let emailStatus: {
            customerEmailSent: boolean;
            adminEmailSent: boolean;
            customerProviderMessageId?: string;
        } = {
            customerEmailSent: false,
            adminEmailSent: false,
        };

        try {
            emailStatus = await sendQuoteEmails({
                quoteId,
                quote,
                settings,
            });

            if (emailStatus.customerEmailSent) {
                try {
                    await recordAutomaticQuoteEmailContact({
                        quoteId,
                        recipientEmail: quote.email,
                        providerMessageId: emailStatus.customerProviderMessageId,
                    });
                } catch (historyError) {
                    console.error(
                        "Automatic quote email history error:",
                        historyError,
                    );
                }
            }
        } catch (emailError) {
            console.error("Quote email error:", emailError);
        }

        return NextResponse.json(
            {
                success: true,
                message: italian?"La richiesta di preventivo è stata ricevuta.":"Your quotation request has been received.",
                quoteId,
                emailStatus: {
                    customerEmailSent: emailStatus.customerEmailSent,
                    adminEmailSent: emailStatus.adminEmailSent,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Quote submission error:", error);

        const italian=request.headers.get("x-movento-locale")==="it";
        return NextResponse.json(
            {
                success: false,
                message:
                    italian?"Non è stato possibile inviare la richiesta di preventivo. Riprova.":"We could not submit your quotation request. Please try again.",
            },
            { status: 500 },
        );
    }
}
