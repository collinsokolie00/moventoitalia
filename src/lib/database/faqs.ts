import "server-only";
import type { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import type { Locale } from "@/lib/i18n/config";

export const FAQS_COLLECTION = "faqs";
export type FAQItem = { id:string; question:string;questionIt:string; answer:string;answerIt:string; category:string;categoryIt:string; categoryDescription:string;categoryDescriptionIt:string; published:boolean; displayOrder:number };
function mapFAQ(document:QueryDocumentSnapshot<DocumentData>,locale:Locale="en"):FAQItem { const data=document.data();const pick=(en:unknown,it:unknown)=>String(locale==="it"&&String(it??"").trim()?it:en??""); return { id:document.id, question:pick(data.question,data.questionIt),questionIt:data.questionIt??"", answer:pick(data.answer,data.answerIt),answerIt:data.answerIt??"", category:pick(data.category,data.categoryIt),categoryIt:data.categoryIt??"", categoryDescription:pick(data.categoryDescription,data.categoryDescriptionIt),categoryDescriptionIt:data.categoryDescriptionIt??"", published:Boolean(data.published), displayOrder:Number(data.displayOrder??0) }; }
export async function listFAQs(locale:Locale="en"){const snapshot=await adminDb.collection(FAQS_COLLECTION).get();return snapshot.docs.map(document=>mapFAQ(document,locale)).sort((a,b)=>a.displayOrder-b.displayOrder||a.question.localeCompare(b.question));}
export async function listPublishedFAQs(locale:Locale="en"){return (await listFAQs(locale)).filter(item=>item.published);}
