import "server-only";
import { unstable_cache } from "next/cache";
import type { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import type { Locale } from "@/lib/i18n/config";
export const CONTACT_COLLECTION="siteContent";export const CONTACT_DOCUMENT="contact";
export type ContactContent={heading:string;headingIt:string;introductoryText:string;introductoryTextIt:string;address:string;addressIt:string;phone:string;email:string;whatsapp:string;callingHours:string;callingHoursIt:string;googleMapsUrl:string;mapEmbedUrl:string;formHeading:string;formHeadingIt:string;formSupportingText:string;formSupportingTextIt:string;callToActionText:string;callToActionTextIt:string;createdAt:string|null;updatedAt:string|null};

function timestampToISOString(value:unknown){
  if(value&&typeof(value as Timestamp).toDate==="function")return(value as Timestamp).toDate().toISOString();
  if(typeof value==="string"&&!Number.isNaN(Date.parse(value)))return new Date(value).toISOString();
  return null;
}

const getCachedContactContent=unstable_cache(async (locale:Locale="en"):Promise<ContactContent|null>=>{
  const snapshot=await adminDb.collection(CONTACT_COLLECTION).doc(CONTACT_DOCUMENT).get();
  if(!snapshot.exists)return null;
  const data=snapshot.data()??{};
  const pick=(en:unknown,it:unknown)=>String(locale==="it"&&String(it??"").trim()?it:en??"");
  return{
    heading:pick(data.heading,data.headingIt),headingIt:data.headingIt??"",
    introductoryText:pick(data.introductoryText,data.introductoryTextIt),introductoryTextIt:data.introductoryTextIt??"",
    address:pick(data.address,data.addressIt),addressIt:data.addressIt??"",
    phone:data.phone??"",
    email:data.email??"",
    whatsapp:data.whatsapp??"",
    callingHours:pick(data.callingHours,data.callingHoursIt),callingHoursIt:data.callingHoursIt??"",
    googleMapsUrl:data.googleMapsUrl??"",
    mapEmbedUrl:data.mapEmbedUrl??"",
    formHeading:pick(data.formHeading,data.formHeadingIt),formHeadingIt:data.formHeadingIt??"",
    formSupportingText:pick(data.formSupportingText,data.formSupportingTextIt),formSupportingTextIt:data.formSupportingTextIt??"",
    callToActionText:pick(data.callToActionText,data.callToActionTextIt),callToActionTextIt:data.callToActionTextIt??"",
    createdAt:timestampToISOString(data.createdAt),
    updatedAt:timestampToISOString(data.updatedAt),
  };
},["contact-content"],{revalidate:300,tags:["contact-content"]});

export async function getContactContent(locale:Locale="en") {
  return getCachedContactContent(locale);
}
