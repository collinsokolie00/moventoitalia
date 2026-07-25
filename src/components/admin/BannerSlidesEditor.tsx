"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import AdminImageUploadField, {
  type UploadFolder,
} from "@/components/admin/AdminImageUploadField";
import type { PromoSlide } from "@/lib/database/site-media";

const input =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600";

export default function BannerSlidesEditor({
  initialSlides,
  prefix,
  folder,
}: {
  initialSlides: PromoSlide[];
  prefix: string;
  folder: UploadFolder;
}) {
  const [slides, setSlides] = useState(initialSlides);

  function addSlide() {
    setSlides((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        imageUrl: "",
        imagePath: "",
        imageAlt: "",
        imageAltIt: "",
        label: "",
        labelIt: "",
        heading: "",
        headingIt: "",
        description: "",
        descriptionIt: "",
        ctaLabel: "",
        ctaLabelIt: "",
        ctaLink: "/quote",
        enabled: true,
        displayOrder: current.length,
        overlayOpacity: 55,
      },
    ]);
  }

  return (
    <div>
      {slides.length === 0 && (
        <p className="rounded-2xl border border-dashed border-blue-300 bg-white px-5 py-6 text-sm font-semibold leading-6 text-blue-950">
          No banner slides exist yet. Add a slide, upload its image, complete
          the text, and save. The enabled banner will appear on the public page
          immediately.
        </p>
      )}
      <div className="space-y-5">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
          >
            <input type="hidden" name={`${prefix}Id`} value={slide.id} />
            <input
              type="hidden"
              name={`${prefix}Enabled`}
              value={String(slide.enabled)}
            />
            <div className="flex items-center justify-between gap-4">
              <p className="font-extrabold text-slate-900">Slide {index + 1}</p>
              <button
                type="button"
                aria-label={`Remove slide ${index + 1}`}
                onClick={() =>
                  window.confirm(`Remove slide ${index + 1}? The image is deleted after you save.`) &&
                  setSlides((items) => items.filter((item) => item.id !== slide.id))
                }
                className="grid h-10 w-10 place-items-center rounded-xl border border-red-200 text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <AdminImageUploadField
                  label="Slide background image"
                  folder={folder}
                  urlName={`${prefix}ImageUrl`}
                  pathName={`${prefix}ImagePath`}
                  initialUrl={slide.imageUrl}
                  initialPath={slide.imagePath}
                />
              </div>
              <Field name={`${prefix}ImageAlt`} label="Image alt text" value={slide.imageAlt} required={false} />
              <Field name={`${prefix}ImageAltIt`} label="Testo alternativo — Italiano" value={slide.imageAltIt} required={false} />
              <Field name={`${prefix}Label`} label="Small label" value={slide.label} />
              <Field name={`${prefix}LabelIt`} label="Etichetta — Italiano" value={slide.labelIt} required={false} />
              <Field name={`${prefix}Heading`} label="Heading" value={slide.heading} />
              <Field name={`${prefix}HeadingIt`} label="Titolo — Italiano" value={slide.headingIt} required={false} />
              <Field name={`${prefix}CtaLabel`} label="CTA label" value={slide.ctaLabel} />
              <Field name={`${prefix}CtaLabelIt`} label="CTA — Italiano" value={slide.ctaLabelIt} required={false} />
              <label className="sm:col-span-2">
                <span className="text-sm font-bold text-slate-700">Description</span>
                <textarea
                  name={`${prefix}Description`}
                  defaultValue={slide.description}
                  required
                  rows={3}
                  className={`${input} resize-y`}
                />
              </label>
              <label className="sm:col-span-2"><span className="text-sm font-bold text-slate-700">Descrizione — Italiano</span><textarea name={`${prefix}DescriptionIt`} defaultValue={slide.descriptionIt} rows={3} className={`${input} resize-y`} /></label>
              <Field name={`${prefix}CtaLink`} label="CTA internal link" value={slide.ctaLink} />
              <Field
                name={`${prefix}DisplayOrder`}
                label="Display order"
                value={String(slide.displayOrder)}
                type="number"
              />
              <Field
                name={`${prefix}OverlayOpacity`}
                label="Overlay darkness (20–85)"
                value={String(slide.overlayOpacity)}
                type="number"
              />
              <label className="flex items-center gap-3 self-end rounded-xl bg-white px-4 py-3 font-bold">
                <input
                  type="checkbox"
                  checked={slide.enabled}
                  onChange={(event) =>
                    setSlides((items) =>
                      items.map((item) =>
                        item.id === slide.id
                          ? { ...item, enabled: event.target.checked }
                          : item,
                      ),
                    )
                  }
                  className="h-5 w-5"
                />
                Enabled
              </label>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addSlide}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-blue-700"
      >
        <Plus className="h-4 w-4" />
        Add slide
      </button>
    </div>
  );
}

function Field({
  name,
  label,
  value,
  type,
  required = true,
}: {
  name: string;
  label: string;
  value: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        name={name}
        defaultValue={value}
        required={required}
        type={type}
        min={type === "number" ? 0 : undefined}
        max={name.endsWith("OverlayOpacity") ? 85 : undefined}
        className={input}
      />
    </label>
  );
}
