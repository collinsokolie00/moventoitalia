import HomeTrustSections from "@/components/home/HomeTrustSections";
import HomepageSections from "@/components/home/HomepageSections";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ShieldCheck,
  Sofa,
  Truck,
} from "lucide-react";

const services = [
  {
    title: "Home Moves",
    description:
      "Professional apartment and house moving services handled with care.",
    icon: Truck,
  },
  {
    title: "Office Relocation",
    description:
      "Organised business relocations designed to reduce interruptions.",
    icon: Building2,
  },
  {
    title: "Furniture Transport",
    description:
      "Reliable transport for furniture, marketplace purchases and deliveries.",
    icon: Sofa,
  },
  {
    title: "Packing & Assembly",
    description:
      "Packing, disassembly, transport and reassembly from one trusted team.",
    icon: PackageCheck,
  },
];

const benefits = [
  "Transparent estimates",
  "Careful and trained moving teams",
  "Flexible booking dates",
  "Fast WhatsApp communication",
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-blue-300 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-cyan-300 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-180 max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-50 backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Premium moving services across Central Italy
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Moving made simple, secure and professional.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-blue-100 sm:text-xl">
              Movento provides modern home moves, office relocations, furniture
              transport and packing services across Terni, Perugia, Rome and
              nearby areas.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-900 transition hover:bg-blue-50"
              >
                Get Your Estimate
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Explore Services
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl gap-5 text-sm text-blue-100 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-bold text-white">Fast</p>
                <p className="mt-1">Quotation response</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Flexible</p>
                <p className="mt-1">Booking options</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Careful</p>
                <p className="mt-1">Handling from start to finish</p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-white/20 bg-white p-6 text-slate-950 shadow-2xl shadow-blue-950/30 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Quick estimate
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
              Start planning your move
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Give us the basic details and receive an estimated price range.
            </p>

            <div className="mt-7 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Moving from
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  Terni, Perugia or Rome
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Property
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  Studio, apartment, house or office
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Preferred date
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  Choose your moving date
                </p>
              </div>
            </div>

            <Link
              href="/quote"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-4 font-bold text-white transition hover:bg-blue-800"
            >
              Calculate My Estimate
              <ArrowRight className="h-5 w-5" />
            </Link>

            <p className="mt-4 text-center text-xs text-slate-500">
              No registration required.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              What we do
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Everything you need for a better move
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              One organised service for moving, transporting, packing and
              assembling your belongings.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-950">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"
            >
              View all Movento services
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
              Why Movento
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              A more modern moving experience
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              We combine careful moving work with modern communication,
              transparent planning and technology that keeps customers informed.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-700" />
                  <span className="font-semibold text-slate-800">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl bg-blue-900 p-8 text-white shadow-xl sm:p-10">
            <Clock3 className="h-10 w-10 text-blue-200" />

            <h3 className="mt-6 text-3xl font-extrabold">
              Get a response without waiting for days
            </h3>

            <p className="mt-5 leading-8 text-blue-100">
              Request an estimate online, share the details of your move and
              communicate directly with Movento through WhatsApp.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-blue-900"
            >
              Contact Movento
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      <HomepageSections />
      <HomeTrustSections />
    </>
  );
}
