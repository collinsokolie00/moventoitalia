import { z } from "zod";
export const contactRequestSchema=z.object({name:z.string().trim().min(2).max(120),email:z.email(),phone:z.string().trim().max(40).default(""),subject:z.string().trim().min(2).max(120),message:z.string().trim().min(10).max(5000)});
export type ContactRequest=z.infer<typeof contactRequestSchema>;
