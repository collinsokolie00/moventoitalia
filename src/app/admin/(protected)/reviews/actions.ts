"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { adminDb } from "@/lib/database/firebase-admin";

const schema = z.object({
  customerName: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),
  review: z.string().trim().min(10).max(3000),
  reviewIt:z.string().trim().max(3000),
  starRating: z.coerce.number().int().min(1).max(5),
  customerPhoto: z.union([z.literal(""), z.url()]).default(""),
  serviceType: z.string().trim().max(120).default(""),
  serviceTypeIt:z.string().trim().max(120).default(""),
  displayOrder: z.coerce.number().int().min(0).max(10000),
  featured: z.boolean(),
  published: z.boolean(),
});

export type ReviewActionState =
  | { status: "success" | "error"; message: string }
  | undefined;

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/services");
}

export async function saveReview(
  _state: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = schema.safeParse({
    customerName: formData.get("customerName"),
    city: formData.get("city"),
    review: formData.get("review"),
    reviewIt:formData.get("reviewIt")??"",
    starRating: formData.get("starRating"),
    customerPhoto: formData.get("customerPhoto") ?? "",
    serviceType: formData.get("serviceType") ?? "",
    serviceTypeIt:formData.get("serviceTypeIt")??"",
    displayOrder: formData.get("displayOrder"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the review fields.",
    };
  }

  try {
    const reference = id
      ? adminDb.collection("reviews").doc(id)
      : adminDb.collection("reviews").doc();
    await reference.set(
      {
        ...parsed.data,
        updatedAt: FieldValue.serverTimestamp(),
        ...(!id ? { createdAt: FieldValue.serverTimestamp() } : {}),
      },
      { merge: true },
    );
    refresh();
    return {
      status: "success",
      message: id ? "Review updated." : "Review created.",
    };
  } catch {
    return {
      status: "error",
      message: "The review could not be saved. Please try again.",
    };
  }
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const id = z.string().min(1).max(100).parse(formData.get("id"));
  await adminDb.collection("reviews").doc(id).delete();
  refresh();
}
