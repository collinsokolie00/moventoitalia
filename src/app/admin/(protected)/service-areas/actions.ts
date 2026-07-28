"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { adminDb } from "@/lib/database/firebase-admin";
import { SERVICE_AREAS_COLLECTION } from "@/lib/database/service-areas";
import { SITE_MEDIA_COLLECTION, SITE_MEDIA_DOCUMENT } from "@/lib/database/site-media";
import { cmsImageSchema } from "@/lib/validation/media";
import { deleteCmsImage } from "@/lib/firebase/admin-storage";

const schema = z.object({
  areaName: z.string().trim().min(2).max(140),
  areaNameIt: z.string().trim().max(140),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug"),
  shortDescription: z.string().trim().min(10).max(300),
  shortDescriptionIt: z.string().trim().max(300),
  fullDescription: z.string().trim().min(10).max(2000),
  fullDescriptionIt: z.string().trim().max(2000),
  featuredImage: z.union([z.literal(""), z.url()]),
  mapsUrl: z.url(),
  seoTitle: z.string().trim().min(2).max(70),
  seoTitleIt: z.string().trim().max(70),
  seoDescription: z.string().trim().min(10).max(180),
  seoDescriptionIt: z.string().trim().max(180),
  featured: z.boolean(),
  nearbyCities: z.array(z.string().trim().min(1).max(100)).max(30),
  nearbyCitiesIt: z.array(z.string().trim().min(1).max(100)).max(30),
  availabilityNotes: z.string().trim().max(600),
  availabilityNotesIt: z.string().trim().max(600),
  published: z.boolean(),
  displayOrder: z.coerce.number().int().min(0).max(10000),
});

export type ServiceAreaActionState = { status: "success" | "error"; message: string } | undefined;
function refresh() { revalidateTag("service-areas","max");revalidateTag("site-media","max");revalidatePath("/service-areas"); revalidatePath("/admin/service-areas"); revalidatePath("/admin"); }

export async function saveServiceArea(_state: ServiceAreaActionState, formData: FormData): Promise<ServiceAreaActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = schema.safeParse({
    areaName: formData.get("areaName.en"), areaNameIt:formData.get("areaName.it")??"", slug: formData.get("slug"), shortDescription: formData.get("shortDescription.en"),shortDescriptionIt:formData.get("shortDescription.it")??"", fullDescription: formData.get("fullDescription.en"),fullDescriptionIt:formData.get("fullDescription.it")??"", featuredImage: formData.get("featuredImage") ?? "", mapsUrl: formData.get("mapsUrl"), seoTitle: formData.get("seoTitle.en"),seoTitleIt:formData.get("seoTitle.it")??"", seoDescription: formData.get("seoDescription.en"),seoDescriptionIt:formData.get("seoDescription.it")??"", featured: formData.get("featured") === "on", nearbyCities: String(formData.get("nearbyCities") ?? "").split("\n").map(value => value.trim()).filter(Boolean), nearbyCitiesIt: String(formData.get("nearbyCitiesIt") ?? "").split("\n").map(value => value.trim()).filter(Boolean), availabilityNotes: formData.get("availabilityNotes.en") ?? "",availabilityNotesIt:formData.get("availabilityNotes.it")??"", published: formData.get("published") === "on", displayOrder: formData.get("displayOrder"),
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the service area fields." };
  const duplicate = await adminDb.collection(SERVICE_AREAS_COLLECTION).where("slug", "==", parsed.data.slug).limit(2).get();
  if (duplicate.docs.some(document => document.id !== id)) return { status: "error", message: "A service area with this slug already exists." };
  const reference = id ? adminDb.collection(SERVICE_AREAS_COLLECTION).doc(id) : adminDb.collection(SERVICE_AREAS_COLLECTION).doc();
  await reference.set({ ...parsed.data, updatedAt: FieldValue.serverTimestamp(), ...(!id ? { createdAt: FieldValue.serverTimestamp() } : {}) }, { merge: true });
  refresh();
  return { status: "success", message: id ? "Service area updated." : "Service area created." };
}

export async function deleteServiceArea(formData: FormData) {
  await requireAdmin();
  const id = z.string().min(1).max(100).parse(formData.get("id"));
  await adminDb.collection(SERVICE_AREAS_COLLECTION).doc(id).delete();
  refresh();
}

export async function saveServiceAreasHero(_state: ServiceAreaActionState, formData: FormData): Promise<ServiceAreaActionState> {
  await requireAdmin();
  const parsed = cmsImageSchema.safeParse({
    url: formData.get("serviceAreasHeroUrl") ?? "",
    path: formData.get("serviceAreasHeroPath") ?? "",
    alt: formData.get("serviceAreasHeroAlt") ?? "",
    altIt:formData.get("serviceAreasHeroAltIt")??"",
    position: formData.get("serviceAreasHeroPosition") ?? "center",
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the hero image." };
  const reference = adminDb.collection(SITE_MEDIA_COLLECTION).doc(SITE_MEDIA_DOCUMENT);
  const previous = await reference.get();
  await reference.set({
    serviceAreasHero: parsed.data,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  const oldPath = previous.data()?.serviceAreasHero?.path ?? "";
  if (oldPath && oldPath !== parsed.data.path) await deleteCmsImage(oldPath);
  refresh();
  return { status: "success", message: "Service Areas hero saved." };
}
