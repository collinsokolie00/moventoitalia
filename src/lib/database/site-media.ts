import "server-only";

import { adminDb } from "./firebase-admin";
import type { Locale } from "@/lib/i18n/config";

export const SITE_MEDIA_COLLECTION = "siteContent";
export const SITE_MEDIA_DOCUMENT = "visualMedia";

export type CmsImage = {
  url: string;
  path: string;
  alt: string;
  altIt:string;
  position: string;
};

export type PromoSlide = {
  id: string;
  imageUrl: string;
  imagePath: string;
  imageAlt: string;
  imageAltIt: string;
  label: string;
  labelIt: string;
  heading: string;
  headingIt: string;
  description: string;
  descriptionIt: string;
  ctaLabel: string;
  ctaLabelIt: string;
  ctaLink: string;
  enabled: boolean;
  displayOrder: number;
  overlayOpacity: number;
};

export type SiteMedia = {
  servicesHero: CmsImage;
  serviceAreasHero: CmsImage;
  servicesBannerSlides: PromoSlide[];
};

export function normalizeSlides(value: unknown,locale:Locale="en"): PromoSlide[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((slide, index) => {
      const data = (slide ?? {}) as Partial<PromoSlide>;
      const pick=(en:unknown,it:unknown)=>String(locale==="it"&&String(it??"").trim()?it:en??"");
      return {
        id: data.id || `slide-${index + 1}`,
        imageUrl: data.imageUrl ?? "",
        imagePath: data.imagePath ?? "",
        imageAlt: pick(data.imageAlt,data.imageAltIt),imageAltIt:data.imageAltIt??"",
        label: pick(data.label,data.labelIt),labelIt:data.labelIt??"",
        heading: pick(data.heading,data.headingIt),headingIt:data.headingIt??"",
        description: pick(data.description,data.descriptionIt),descriptionIt:data.descriptionIt??"",
        ctaLabel: pick(data.ctaLabel,data.ctaLabelIt),ctaLabelIt:data.ctaLabelIt??"",
        ctaLink: data.ctaLink ?? "",
        enabled: data.enabled !== false,
        displayOrder: Number(data.displayOrder ?? index),
        overlayOpacity: Math.min(85, Math.max(20, Number(data.overlayOpacity ?? 55))),
      };
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

function normalizeImage(value: unknown,locale:Locale="en"): CmsImage {
  const data = (value ?? {}) as Partial<CmsImage>;
  return {
    url: data.url ?? "",
    path: data.path ?? "",
    alt: locale==="it"&&data.altIt?.trim()?data.altIt:data.alt??"",
    altIt:data.altIt??"",
    position: data.position ?? "center",
  };
}

export async function getSiteMedia(locale:Locale="en"): Promise<SiteMedia> {
  const snapshot = await adminDb
    .collection(SITE_MEDIA_COLLECTION)
    .doc(SITE_MEDIA_DOCUMENT)
    .get();
  const data = snapshot.data() ?? {};
  return {
    servicesHero: normalizeImage(data.servicesHero,locale),
    serviceAreasHero: normalizeImage(data.serviceAreasHero,locale),
    servicesBannerSlides: normalizeSlides(data.servicesBannerSlides,locale),
  };
}
