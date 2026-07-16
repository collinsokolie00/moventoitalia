import type { Metadata } from "next";

import QuoteCalculator from "@/components/quote/QuoteCalculator";

export const metadata: Metadata = {
  title: "Moving Cost Estimate | Movento",
  description:
    "Calculate an initial moving-price estimate for home moves, office relocations, furniture transport, packing and assembly.",
};

export default function QuotePage() {
  return (
    <>
      <section className="bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
            Moving estimate
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl">
            Calculate the likely cost of your move.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Complete the short questionnaire to receive an initial price range.
            No account is required.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <QuoteCalculator />
        </div>
      </section>
    </>
  );
}