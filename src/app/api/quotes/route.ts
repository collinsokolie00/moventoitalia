import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { adminDb } from "@/lib/database/firebase-admin";
import { sendQuoteEmails } from "@/lib/email/send-quote-emails";
import { quoteRequestSchema } from "@/lib/validation/quote";

export const runtime = "nodejs";

function createQuoteReference() {
    const date = new Date();
    const datePart = date.toISOString().slice(0, 10).replaceAll("-", "");
    const randomPart = crypto.randomUUID().slice(0, 6).toUpperCase();

    return `MOV-${datePart}-${randomPart}`;
}

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        const parsed = quoteRequestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please check the submitted information.",
                    errors: parsed.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const quote = parsed.data;
        const quoteId = createQuoteReference();

        await adminDb.collection("quotes").doc(quoteId).set({
            ...quote,
            reference: quoteId,
            status: "new",
            source: "website",
            customerAccountId: null,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        let emailStatus = {
            customerEmailSent: false,
            adminEmailSent: false,
        };

        try {
            emailStatus = await sendQuoteEmails({
                quoteId,
                quote,
            });
        } catch (emailError) {
            console.error("Quote email error:", emailError);
        }

        return NextResponse.json(
            {
                success: true,
                message: "Your quotation request has been received.",
                quoteId,
                emailStatus,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Quote submission error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    "We could not submit your quotation request. Please try again.",
            },
            { status: 500 },
        );
    }
}