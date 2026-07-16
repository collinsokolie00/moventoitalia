import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Moving & Relocation Services | Movento",
  description:
    "Explore Movento home moves, office relocations, furniture transport, packing, assembly, storage and house clearance services.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
              Movento services
            </p>

            <h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Complete support for every stage of your move.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-blue-100 sm:text-xl">
              From packing and furniture protection to transport, delivery and
              assembly, Movento provides one organised moving service across
              Terni, Perugia, Rome and nearby areas.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-900 transition hover:bg-blue-50"
              >
                Get an Estimate
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/booking"
                className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
              >
                Book a Move
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Our services
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Choose the help your move requires
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Customers can select a complete relocation service or combine
              individual services according to their needs.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.slug}
                  className="group rounded-4xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:p-8"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                      <Icon className="h-7 w-7" />
                    </div>

                    <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                      {service.price}
                    </span>
                  </div>

                  <h3 className="mt-7 text-2xl font-extrabold text-slate-950">
                    {service.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-sm font-medium text-slate-700"
                      >
                        <Check className="h-4 w-4 shrink-0 text-blue-700" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 border-t border-slate-200 pt-6">
                    <Link
                      href={`/quote?service=${service.slug}`}
                      className="inline-flex items-center gap-2 font-bold text-blue-700 transition hover:text-blue-900"
                    >
                      Request this service
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-4xl bg-blue-950">
            <div className="absolute inset-0">
              <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
              <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
            </div>

            <div className="relative grid min-h-110 items-center gap-12 px-7 py-14 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
                  Complete moving support
                </p>

                <h2 className="mt-5 max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  One team from packing to final delivery.
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
                  Avoid coordinating several different providers. Movento can
                  manage packing, disassembly, transport, unloading and
                  reassembly as one organised service.
                </p>

                <Link
                  href="/quote"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-950 transition hover:bg-blue-50"
                >
                  Plan Your Move
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="rounded-4xl border border-white/15 bg-white/10 p-7 text-white backdrop-blur sm:p-9">
                <ShieldCheck className="h-10 w-10 text-blue-200" />

                <h3 className="mt-6 text-2xl font-extrabold">
                  Designed around proper handling
                </h3>

                <div className="mt-6 space-y-4">
                  {[
                    "Furniture protected before loading",
                    "Fragile belongings handled carefully",
                    "Access and parking planned in advance",
                    "Clear communication throughout the job",
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-200" />
                      <span className="leading-7 text-blue-50">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Flexible service
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Only pay for the help you need
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Some customers need a complete move. Others only need furniture
              transport, packing or assembly. Movento can build the service
              around the actual job instead of forcing every customer into one
              fixed package.
            </p>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-extrabold text-slate-950">
              Your quotation can include:
            </h3>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                "Number of workers",
                "Vehicle size",
                "Travel distance",
                "Packing materials",
                "Furniture assembly",
                "Floor access",
                "Elevator availability",
                "Heavy or fragile items",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-700" />
                  <span className="font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href="/quote"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-4 font-bold text-white transition hover:bg-blue-800"
            >
              Build Your Estimate
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}