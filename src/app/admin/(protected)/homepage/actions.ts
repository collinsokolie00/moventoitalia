"use server";

import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/session";
import { adminDb } from "@/lib/database/firebase-admin";
import {
  HOMEPAGE_COLLECTION,
  HOMEPAGE_DOCUMENT,
} from "@/lib/database/homepage";
import { deleteCmsImage } from "@/lib/firebase/admin-storage";
import { promoSlideSchema, slidesFromForm } from "@/lib/validation/media";

const buttonSchema = z.object({
  label: z.string().trim().min(1).max(80),
  labelIt: z.string().trim().max(80),
  href: z.string().trim().regex(/^\/(?!\/)/, "Use an internal path beginning with /"),
});

const homepageSchema = z.object({
  hero: z.object({
    title: z.string().trim().min(1).max(180),
    titleIt:z.string().trim().max(180),
    subtitle: z.string().trim().min(1).max(600),
    subtitleIt:z.string().trim().max(600),
    primaryButton: buttonSchema,
    secondaryButton: buttonSchema,
  }),
  statistics: z.array(z.object({
    value: z.string().trim().min(1).max(40),
    valueIt:z.string().trim().max(40),
    label: z.string().trim().min(1).max(100),
    labelIt:z.string().trim().max(100),
  })).min(1).max(6),
  whyChoose: z.object({
    title: z.string().trim().min(1).max(180),
    titleIt:z.string().trim().max(180),
    description: z.string().trim().min(1).max(800),
    descriptionIt:z.string().trim().max(800),
    benefits: z.array(z.string().trim().min(1).max(160)).min(1).max(8),
    benefitsIt:z.array(z.string().trim().min(1).max(160)).max(8),
  }),
  callToAction: z.object({
    eyebrow: z.string().trim().min(1).max(80),
    eyebrowIt:z.string().trim().max(80),
    title: z.string().trim().min(1).max(180),
    titleIt:z.string().trim().max(180),
    description: z.string().trim().min(1).max(600),
    descriptionIt:z.string().trim().max(600),
    primaryButton: buttonSchema,
    secondaryButton: buttonSchema,
  }),
  bannerSlides: z.array(promoSlideSchema).max(10),
});

export type HomepageActionState =
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | undefined;

export async function saveHomepage(
  _state: HomepageActionState,
  formData: FormData,
): Promise<HomepageActionState> {
  await requireAdmin();

  const parsed = homepageSchema.safeParse({
    hero: {
      title: formData.get("heroTitle"),
      titleIt:formData.get("heroTitleIt")??"",
      subtitle: formData.get("heroSubtitle"),
      subtitleIt:formData.get("heroSubtitleIt")??"",
      primaryButton: {
        label: formData.get("heroPrimaryLabel"),
        labelIt:formData.get("heroPrimaryLabelIt")??"",
        href: formData.get("heroPrimaryHref"),
      },
      secondaryButton: {
        label: formData.get("heroSecondaryLabel"),
        labelIt:formData.get("heroSecondaryLabelIt")??"",
        href: formData.get("heroSecondaryHref"),
      },
    },
    statistics: formData.getAll("statisticValue").map((value, index) => ({
      value,
      valueIt:formData.getAll("statisticValueIt")[index]??"",
      label: formData.getAll("statisticLabel")[index],
      labelIt:formData.getAll("statisticLabelIt")[index]??"",
    })),
    whyChoose: {
      title: formData.get("whyTitle"),
      titleIt:formData.get("whyTitleIt")??"",
      description: formData.get("whyDescription"),
      descriptionIt:formData.get("whyDescriptionIt")??"",
      benefits: formData.getAll("whyBenefit"),
      benefitsIt:formData.getAll("whyBenefitIt").filter(value=>String(value).trim()),
    },
    callToAction: {
      eyebrow: formData.get("ctaEyebrow"),
      eyebrowIt:formData.get("ctaEyebrowIt")??"",
      title: formData.get("ctaTitle"),
      titleIt:formData.get("ctaTitleIt")??"",
      description: formData.get("ctaDescription"),
      descriptionIt:formData.get("ctaDescriptionIt")??"",
      primaryButton: {
        label: formData.get("ctaPrimaryLabel"),
        labelIt:formData.get("ctaPrimaryLabelIt")??"",
        href: formData.get("ctaPrimaryHref"),
      },
      secondaryButton: {
        label: formData.get("ctaSecondaryLabel"),
        labelIt:formData.get("ctaSecondaryLabelIt")??"",
        href: formData.get("ctaSecondaryHref"),
      },
    },
    bannerSlides: slidesFromForm(formData, "homeBanner"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Check the homepage fields.",
    };
  }

  const reference = adminDb
    .collection(HOMEPAGE_COLLECTION)
    .doc(HOMEPAGE_DOCUMENT);
  const previous = await reference.get();
  await reference.set({
      ...parsed.data,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

  const retained = new Set(parsed.data.bannerSlides.map((slide) => slide.imagePath));
  const previousPaths = Array.isArray(previous.data()?.bannerSlides)
    ? previous.data()!.bannerSlides.map((slide: { imagePath?: string }) => slide.imagePath ?? "")
    : [];
  await Promise.all(previousPaths.filter((path: string) => path && !retained.has(path)).map(deleteCmsImage));

  revalidateTag("homepage-content", "max");
  revalidatePath("/");
  revalidatePath("/admin/homepage");

  return { status: "success", message: "Homepage saved successfully." };
}
