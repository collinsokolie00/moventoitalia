import { z } from "zod";

export const cmsImageSchema = z.object({
  url: z.union([z.literal(""), z.url()]),
  path: z.string().max(500),
  alt: z.string().trim().max(180),
  altIt:z.string().trim().max(180),
  position: z.enum(["center", "top", "bottom"]).default("center"),
}).superRefine((image, context) => {
  if (image.url && !image.alt) {
    context.addIssue({
      code: "custom",
      path: ["alt"],
      message: "Add descriptive alt text for the image.",
    });
  }
});

export const promoSlideSchema = z.object({
  id: z.string().min(1).max(100),
  imageUrl: z.union([z.literal(""), z.url()]),
  imagePath: z.string().max(500),
  imageAlt: z.string().trim().max(180),
  imageAltIt: z.string().trim().max(180),
  label: z.string().trim().min(1).max(80),
  labelIt: z.string().trim().max(80),
  heading: z.string().trim().min(1).max(180),
  headingIt: z.string().trim().max(180),
  description: z.string().trim().min(1).max(600),
  descriptionIt: z.string().trim().max(600),
  ctaLabel: z.string().trim().min(1).max(80),
  ctaLabelIt: z.string().trim().max(80),
  ctaLink: z.string().trim().regex(/^\/(?!\/)/, "Use an internal CTA path beginning with /"),
  enabled: z.boolean(),
  displayOrder: z.coerce.number().int().min(0).max(10000),
  overlayOpacity: z.coerce.number().int().min(20).max(85),
}).superRefine((slide, context) => {
  if (slide.imageUrl && !slide.imageAlt) {
    context.addIssue({
      code: "custom",
      path: ["imageAlt"],
      message: "Add descriptive alt text for each uploaded slide image.",
    });
  }
});

export function slidesFromForm(formData: FormData, prefix: string) {
  const values = (name: string) => formData.getAll(`${prefix}${name}`);
  return values("Id").map((id, index) => ({
    id,
    imageUrl: values("ImageUrl")[index],
    imagePath: values("ImagePath")[index],
    imageAlt: values("ImageAlt")[index],
    imageAltIt: values("ImageAltIt")[index],
    label: values("Label")[index],
    labelIt: values("LabelIt")[index],
    heading: values("Heading")[index],
    headingIt: values("HeadingIt")[index],
    description: values("Description")[index],
    descriptionIt: values("DescriptionIt")[index],
    ctaLabel: values("CtaLabel")[index],
    ctaLabelIt: values("CtaLabelIt")[index],
    ctaLink: values("CtaLink")[index],
    enabled: values("Enabled")[index] === "true",
    displayOrder: values("DisplayOrder")[index],
    overlayOpacity: values("OverlayOpacity")[index],
  }));
}
