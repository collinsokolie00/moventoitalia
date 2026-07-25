"use server";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { adminDb } from "@/lib/database/firebase-admin";
import { FAQS_COLLECTION } from "@/lib/database/faqs";

const schema=z.object({
  question:z.string().trim().min(5).max(300),questionIt:z.string().trim().max(300),
  answer:z.string().trim().min(10).max(3000),answerIt:z.string().trim().max(3000),
  category:z.string().trim().min(2).max(120),categoryIt:z.string().trim().max(120),
  categoryDescription:z.string().trim().max(300),categoryDescriptionIt:z.string().trim().max(300),
  published:z.boolean(),displayOrder:z.coerce.number().int().min(0).max(10000),
});
export type FAQActionState={status:"success"|"error";message:string}|undefined;
function refresh(){revalidatePath("/faq");revalidatePath("/");revalidatePath("/admin/faq");revalidatePath("/admin");}
export async function saveFAQ(_state:FAQActionState,formData:FormData):Promise<FAQActionState>{
  await requireAdmin();const id=String(formData.get("id")??"");
  const parsed=schema.safeParse({
    question:formData.get("question.en"),questionIt:formData.get("question.it")??"",
    answer:formData.get("answer.en"),answerIt:formData.get("answer.it")??"",
    category:formData.get("category.en"),categoryIt:formData.get("category.it")??"",
    categoryDescription:formData.get("categoryDescription.en")??"",categoryDescriptionIt:formData.get("categoryDescription.it")??"",
    published:formData.get("published")==="on",displayOrder:formData.get("displayOrder"),
  });
  if(!parsed.success)return{status:"error",message:parsed.error.issues[0]?.message??"Check the FAQ fields."};
  const reference=id?adminDb.collection(FAQS_COLLECTION).doc(id):adminDb.collection(FAQS_COLLECTION).doc();
  await reference.set({...parsed.data,updatedAt:FieldValue.serverTimestamp(),...(!id?{createdAt:FieldValue.serverTimestamp()}: {})},{merge:true});
  refresh();return{status:"success",message:id?"FAQ updated.":"FAQ created."};
}
export async function deleteFAQ(formData:FormData){await requireAdmin();const id=z.string().min(1).max(100).parse(formData.get("id"));await adminDb.collection(FAQS_COLLECTION).doc(id).delete();refresh();}
