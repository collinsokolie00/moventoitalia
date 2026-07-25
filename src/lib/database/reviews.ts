import "server-only";
import type { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import type { Locale } from "@/lib/i18n/config";

export type Review = { id:string; customerName:string; city:string; review:string;reviewIt:string; starRating:number; customerPhoto:string; serviceType:string;serviceTypeIt:string; featured:boolean; published:boolean; displayOrder:number };
function mapReview(doc: QueryDocumentSnapshot<DocumentData>,locale:Locale="en"): Review { const value=doc.data();const pick=(en:unknown,it:unknown)=>String(locale==="it"&&String(it??"").trim()?it:en??""); return { id:doc.id, customerName:value.customerName??"", city:value.city??"", review:pick(value.review,value.reviewIt),reviewIt:value.reviewIt??"", starRating:Number(value.starRating??5), customerPhoto:value.customerPhoto??"", serviceType:pick(value.serviceType,value.serviceTypeIt),serviceTypeIt:value.serviceTypeIt??"", featured:Boolean(value.featured), published:Boolean(value.published), displayOrder:Number(value.displayOrder??0) }; }
export async function listReviews(locale:Locale="en") { const snapshot=await adminDb.collection("reviews").get(); return snapshot.docs.map(doc=>mapReview(doc,locale)).sort((a,b)=>a.displayOrder-b.displayOrder||a.customerName.localeCompare(b.customerName)); }
export async function listFeaturedPublishedReviews(locale:Locale="en") { return (await listReviews(locale)).filter(item=>item.published&&item.featured); }
