import { z } from "zod";

export const quoteRequestSchema = z.object({
    requestType: z.enum(["standard", "custom"]).default("standard"),
    customRequestDescription: z.string().trim().max(4000).optional().default(""),
    multiplePickupLocations: z.string().trim().max(2000).optional().default(""),
    specialHandlingRequirements: z.string().trim().max(2000).optional().default(""),
    customAdditionalNotes: z.string().trim().max(2000).optional().default(""),
    origin: z.string().trim().min(2).max(150),
    destination: z.string().trim().min(2).max(150),

    propertyType: z.enum(["studio", "apartment", "house", "office"]),
    rooms: z.number().int().min(1).max(20),

    originFloor: z.number().int().min(0).max(30),
    destinationFloor: z.number().int().min(0).max(30),
    originElevator: z.boolean(),
    destinationElevator: z.boolean(),

    packing: z.boolean(),
    assembly: z.boolean(),
    heavyItems: z.boolean(),

    movingDate: z.string().min(1),
    notes: z.string().trim().max(2000).optional().default(""),

    name: z.string().trim().min(2).max(100),
    email: z.email(),
    phone: z.string().trim().min(6).max(40),

    estimatedMinimum: z.number().int().nonnegative(),
    estimatedMaximum: z.number().int().nonnegative(),
}).superRefine((value, context) => {
    if (value.requestType === "custom" && !value.customRequestDescription) {
        context.addIssue({ code: "custom", path: ["customRequestDescription"], message: "Please describe your custom moving request." });
    }
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
