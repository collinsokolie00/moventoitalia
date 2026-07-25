import { Star } from "lucide-react";

import type { Review } from "@/lib/database/reviews";
import type { Locale } from "@/lib/i18n/config";

export default function FeaturedReviews({
  reviews,
  title = "What our customers say",
  locale = "en",
}: {
  reviews: Review[];
  title?: string;
  locale?: Locale;
}) {
  if (!reviews.length) return null;

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
          {locale === "it" ? "Recensioni dei clienti" : "Customer reviews"}
        </p>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h2>
        <div
          aria-label={locale === "it" ? "Recensioni dei clienti" : "Customer reviews"}
          className="-mx-5 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3"
        >
          {reviews.map((review) => (
            <article
              key={review.id}
              className="flex w-[82vw] max-w-80 shrink-0 snap-start flex-col rounded-4xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none md:w-auto md:max-w-none md:p-7"
            >
              <div className="flex gap-1 text-amber-500" aria-label={locale === "it" ? `${review.starRating} stelle su 5` : `${review.starRating} out of 5 stars`}>
                {Array.from({ length: review.starRating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <p className="mt-5 flex-1 text-base leading-7 text-slate-700 md:text-lg md:leading-8">
                “{review.review}”
              </p>
              <div className="mt-6 flex items-center gap-3">
                {review.customerPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Customer photos can use validated external CMS URLs.
                  <img
                    src={review.customerPhoto}
                    alt=""
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-full bg-slate-100 object-cover"
                  />
                ) : (
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-100 font-extrabold text-blue-700">
                    {review.customerName.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="break-words font-bold text-slate-950">
                    {review.customerName}
                  </p>
                  <p className="mt-1 break-words text-sm text-slate-500">
                    {[review.city, review.serviceType].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
