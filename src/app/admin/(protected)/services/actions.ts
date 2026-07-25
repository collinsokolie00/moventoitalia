"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { adminDb } from "@/lib/database/firebase-admin";
import { SERVICES_COLLECTION } from "@/lib/database/services";
import { serviceIconNames } from "@/components/services/ServiceIcon";
import { localizedStringArray, localizedText, localizedFromForm, localizedLinesFromForm } from "@/lib/validation/localized";
import { revalidateLocalizedPaths } from "@/lib/i18n/revalidation";
import { SITE_MEDIA_COLLECTION, SITE_MEDIA_DOCUMENT } from "@/lib/database/site-media";
import { cmsImageSchema, promoSlideSchema, slidesFromForm } from "@/lib/validation/media";
import { deleteCmsImage } from "@/lib/firebase/admin-storage";

const serviceSchema = z.object({
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug"),
  title: localizedText(2,140),
  subtitle: localizedText(1,100),
  description: localizedText(10,1200),
  features: localizedStringArray(160,12),
  icon: z.enum(serviceIconNames),
  image: z.union([z.literal(""), z.url()]),
  seoTitle: localizedText(2,70),
  seoDescription: localizedText(10,180),
  published: z.boolean(),
  displayOrder: z.coerce.number().int().min(0).max(10000),
});

export type ServiceActionState = { status: "success" | "error"; message: string } | undefined;

function refreshServices() {
  revalidateLocalizedPaths(["/services"]);
  revalidatePath("/admin/services");
  revalidatePath("/admin");
}

export async function saveService(_state: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = serviceSchema.safeParse({
    slug: formData.get("slug"),
    title: localizedFromForm(formData,"title"),
    subtitle: localizedFromForm(formData,"subtitle"),
    description: localizedFromForm(formData,"description"),
    features: localizedLinesFromForm(formData,"features"),
    icon: formData.get("icon"),
    image: formData.get("image") ?? "",
    seoTitle: localizedFromForm(formData,"seoTitle"),
    seoDescription: localizedFromForm(formData,"seoDescription"),
    published: formData.get("published") === "on",
    displayOrder: formData.get("displayOrder"),
  });

  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the service fields." };

  const duplicate = await adminDb.collection(SERVICES_COLLECTION).where("slug", "==", parsed.data.slug).limit(2).get();
  if (duplicate.docs.some(document => document.id !== id)) return { status: "error", message: "A service with this slug already exists." };

  const reference = id ? adminDb.collection(SERVICES_COLLECTION).doc(id) : adminDb.collection(SERVICES_COLLECTION).doc();
  await reference.set({
    ...parsed.data,
    updatedAt: FieldValue.serverTimestamp(),
    ...(!id ? { createdAt: FieldValue.serverTimestamp() } : {}),
  }, { merge: true });
  refreshServices();
  return { status: "success", message: id ? "Service updated." : "Service created." };
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  const id = z.string().min(1).max(100).parse(formData.get("id"));
  await adminDb.collection(SERVICES_COLLECTION).doc(id).delete();
  refreshServices();
}

export async function saveServicesMedia(_state: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  await requireAdmin();
  const parsed = z.object({
    hero: cmsImageSchema,
    slides: z.array(promoSlideSchema).max(10),
  }).safeParse({
    hero: {
      url: formData.get("servicesHeroUrl") ?? "",
      path: formData.get("servicesHeroPath") ?? "",
      alt: formData.get("servicesHeroAlt") ?? "",
      altIt:formData.get("servicesHeroAltIt")??"",
      position: formData.get("servicesHeroPosition") ?? "center",
    },
    slides: slidesFromForm(formData, "servicesBanner"),
  });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the media fields." };
  const reference = adminDb.collection(SITE_MEDIA_COLLECTION).doc(SITE_MEDIA_DOCUMENT);
  const previous = await reference.get();
  await reference.set({
    servicesHero: parsed.data.hero,
    servicesBannerSlides: parsed.data.slides,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  const retained = new Set([parsed.data.hero.path, ...parsed.data.slides.map(slide => slide.imagePath)]);
  const old = previous.data() ?? {};
  const oldPaths = [
    old.servicesHero?.path ?? "",
    ...(Array.isArray(old.servicesBannerSlides) ? old.servicesBannerSlides.map((slide: { imagePath?: string }) => slide.imagePath ?? "") : []),
  ];
  await Promise.all(oldPaths.filter(path => path && !retained.has(path)).map(deleteCmsImage));
  refreshServices();
  return { status: "success", message: "Services media saved." };
}
