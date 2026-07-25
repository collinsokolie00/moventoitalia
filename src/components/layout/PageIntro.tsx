import Link from "next/link";
import { localePath,type Locale } from "@/lib/i18n/config";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  locale:Locale;
};

export default function PageIntro({
  eyebrow,
  title,
  description,
  locale,
}: PageIntroProps) {
  return (
    <section className="min-h-[65vh] bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
          {eyebrow}
        </p>

        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          {description}
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href={localePath(locale,"/quote")}
            className="rounded-full bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            {locale==="it"?"Richiedi un preventivo":"Get an Estimate"}
          </Link>

          <Link
            href={localePath(locale,"/contact")}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-blue-300 hover:text-blue-700"
          >
            {locale==="it"?"Contatta Movento":"Contact Movento"}
          </Link>
        </div>
      </div>
    </section>
  );
}
