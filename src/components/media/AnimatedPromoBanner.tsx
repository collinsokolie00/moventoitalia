"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { PromoSlide } from "@/lib/database/site-media";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";

export default function AnimatedPromoBanner({
  slides,
  className = "",
  locale = "en",
}: {
  slides: PromoSlide[];
  className?: string;
  locale?:Locale;
}) {
  const enabled = useMemo(
    () =>
      slides
        .filter((slide) => slide.enabled && slide.imageUrl)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [slides],
  );
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (enabled.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    let timer: number | undefined;
    const start = () => {
      window.clearInterval(timer);
      if (!document.hidden) {
        timer = window.setInterval(
          () => setActive((current) => (current + 1) % enabled.length),
          5000,
        );
      }
    };
    const visibility = () => start();
    start();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [enabled.length]);

  if (!enabled.length) return null;
  const activeIndex = active % enabled.length;
  const current = enabled[activeIndex];
  const safeCtaLink = /^\/(?!\/)/.test(current.ctaLink)
    ? current.ctaLink
    : null;

  return (
    <section
      className={`relative min-h-80 overflow-hidden rounded-4xl bg-blue-950 text-white ${className}`}
      aria-roledescription="carousel"
      aria-label={locale==="it"?"Promozioni Movento":"Movento promotions"}
    >
      {enabled.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS images can be hosted on any approved public URL. */}
          <img
            src={slide.imageUrl}
            alt=""
            aria-hidden="true"
            loading={index === 0 ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS images can be hosted on any approved public URL. */}
          <img
            src={slide.imageUrl}
            alt={slide.imageAlt}
            loading={index === 0 ? "eager" : "lazy"}
            onError={(event) => {
              event.currentTarget.parentElement!.style.display = "none";
            }}
            className="absolute inset-0 h-full w-full object-contain object-center sm:object-right"
          />
        </div>
      ))}
      <div
        className="absolute inset-0 bg-slate-950"
        style={{ opacity: current.overlayOpacity / 100 }}
      />
      <div className="relative flex min-h-80 max-w-3xl flex-col justify-end p-6 sm:p-10 lg:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200 sm:text-sm">
          {current.label}
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
          {current.heading}
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-100">
          {current.description}
        </p>
        {safeCtaLink && (
          <Link
            href={localePath(locale,safeCtaLink)}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-blue-950"
          >
            {current.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {enabled.length > 1 && (
        <>
          <div className="absolute right-4 top-4 flex gap-2">
            <button
              type="button"
              aria-label={locale==="it"?"Slide precedente":"Previous slide"}
              onClick={() =>
                setActive((currentIndex) =>
                  (currentIndex - 1 + enabled.length) % enabled.length,
                )
              }
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-blue-950"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={locale==="it"?"Slide successiva":"Next slide"}
              onClick={() =>
                setActive((currentIndex) => (currentIndex + 1) % enabled.length)
              }
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-blue-950"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            {enabled.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={locale==="it"?`Mostra slide ${index+1}`:`Show slide ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
