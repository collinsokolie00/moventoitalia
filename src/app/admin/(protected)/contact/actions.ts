"use server";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { adminDb } from "@/lib/database/firebase-admin";
import { CONTACT_COLLECTION,CONTACT_DOCUMENT } from "@/lib/database/contact";
const schema=z.object({
  heading:z.string().trim().min(2).max(180),headingIt:z.string().trim().max(180),
  introductoryText:z.string().trim().min(10).max(800),introductoryTextIt:z.string().trim().max(800),
  address:z.string().trim().min(2).max(300),addressIt:z.string().trim().max(300),phone:z.string().trim().min(6).max(40),email:z.email(),whatsapp:z.string().trim().min(6).max(40),
  callingHours:z.string().trim().min(2).max(300),callingHoursIt:z.string().trim().max(300),
  googleMapsUrl:z.url(),mapEmbedUrl:z.union([z.literal(""),z.url()]),
  formHeading:z.string().trim().min(2).max(180),formHeadingIt:z.string().trim().max(180),
  formSupportingText:z.string().trim().min(10).max(600),formSupportingTextIt:z.string().trim().max(600),
  callToActionText:z.string().trim().min(2).max(300),callToActionTextIt:z.string().trim().max(300),
});
export type ContactActionState={status:"success"|"error";message:string}|undefined;
export async function saveContact(_state:ContactActionState,formData:FormData):Promise<ContactActionState>{
  await requireAdmin();const parsed=schema.safeParse({
    heading:formData.get("heading.en"),headingIt:formData.get("heading.it")??"",
    introductoryText:formData.get("introductoryText.en"),introductoryTextIt:formData.get("introductoryText.it")??"",
    address:formData.get("address.en"),addressIt:formData.get("address.it")??"",phone:formData.get("phone"),email:formData.get("email"),whatsapp:formData.get("whatsapp"),
    callingHours:formData.get("callingHours.en"),callingHoursIt:formData.get("callingHours.it")??"",
    googleMapsUrl:formData.get("googleMapsUrl"),mapEmbedUrl:formData.get("mapEmbedUrl")??"",
    formHeading:formData.get("formHeading.en"),formHeadingIt:formData.get("formHeading.it")??"",
    formSupportingText:formData.get("formSupportingText.en"),formSupportingTextIt:formData.get("formSupportingText.it")??"",
    callToActionText:formData.get("callToActionText.en"),callToActionTextIt:formData.get("callToActionText.it")??"",
  });
  if(!parsed.success)return{status:"error",message:parsed.error.issues[0]?.message??"Check the contact fields."};
  await adminDb.collection(CONTACT_COLLECTION).doc(CONTACT_DOCUMENT).set({...parsed.data,updatedAt:FieldValue.serverTimestamp()},{merge:true});
  revalidateTag("contact-content","max");revalidatePath("/contact");revalidatePath("/","layout");revalidatePath("/admin/contact");return{status:"success",message:"Contact information saved."};
}
