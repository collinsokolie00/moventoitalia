import Link from "next/link";
import {
    ArrowRight,
    CalendarCheck2,
    CheckCircle2,
    MapPin,
    MessageSquareText,
    PackageCheck,
} from "lucide-react";

const processSteps = [
    {
        number: "01",
        title: "Request your estimate",
        description:
            "Tell us where you are moving, your property size and the services you require.",
        icon: MessageSquareText,
    },
    {
        number: "02",
        title: "Confirm the plan",
        description:
            "We review the information, confirm availability and finalise your moving plan.",
        icon: CalendarCheck2,
    },
    {
        number: "03",
        title: "We complete the move",
        description:
            "Our team arrives, protects your belongings and manages the move carefully.",
        icon: PackageCheck,
    },
];

const locations = [
    {
        city: "Terni",
        description:
            "Home moves, furniture transport, packing and local relocation services.",
    },
    {
        city: "Perugia",
        description:
            "Apartment, office and long-distance moving services across the province.",
    },
    {
        city: "Rome",
        description:
            "Professional relocation support for homes, offices and furniture deliveries.",
    },
];

const priceExamples = [
    {
        label: "Studio apartment",
        price: "€250–€350",
    },
    {
        label: "One-bedroom apartment",
        price: "€350–€500",
    },
    {
        label: "Two-bedroom apartment",
        price: "€500–€800",
    },
    {
        label: "Three-bedroom home",
        price: "€800–€1,300",
    },
];

export default function HomepageSections() {
    return (
        <>
            <section className="bg-white py-24">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                            How it works
                        </p>

                        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                            A clear process from quotation to delivery
                        </h2>

                        <p className="mt-5 text-lg leading-8 text-slate-600">
                            Movento makes moving easier with straightforward planning,
                            transparent communication and professional execution.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-6 lg:grid-cols-3">
                        {processSteps.map((step) => {
                            const Icon = step.icon;

                            return (
                                <article
                                    key={step.number}
                                    className="relative rounded-4xl border border-slate-200 bg-slate-50 p-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white">
                                            <Icon className="h-7 w-7" />
                                        </div>

                                        <span className="text-4xl font-black text-blue-100">
                                            {step.number}
                                        </span>
                                    </div>

                                    <h3 className="mt-8 text-2xl font-bold text-slate-950">
                                        {step.title}
                                    </h3>

                                    <p className="mt-4 leading-7 text-slate-600">
                                        {step.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-slate-50 py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="relative overflow-hidden rounded-[2.25rem] bg-blue-950">
                        <div className="absolute inset-0">
                            <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
                            <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
                        </div>

                        <div className="relative grid min-h-110 items-center gap-10 px-7 py-14 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-200">
                                    Professional care
                                </p>

                                <h2 className="mt-5 max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                                    Your move deserves careful hands.
                                </h2>

                                <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
                                    From packing and furniture protection to transport and
                                    delivery, Movento manages every stage with care and precision.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <Link
                                        href="/quote"
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-950 transition hover:bg-blue-50"
                                    >
                                        Plan Your Move
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>

                                    <Link
                                        href="/services"
                                        className="inline-flex items-center rounded-full border border-white/30 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
                                    >
                                        View Services
                                    </Link>
                                </div>
                            </div>

                            <div className="rounded-4xl border border-white/15 bg-white/10 p-7 text-white backdrop-blur sm:p-9">
                                <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-200">
                                    Every move includes
                                </p>

                                <div className="mt-6 space-y-5">
                                    {[
                                        "Careful handling of furniture and belongings",
                                        "Clear communication before moving day",
                                        "Flexible service options",
                                        "Professional loading and transport",
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
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                                Service areas
                            </p>

                            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                                Moving services across Central Italy
                            </h2>

                            <p className="mt-5 text-lg leading-8 text-slate-600">
                                We initially serve Terni, Perugia, Rome and surrounding towns,
                                with longer-distance jobs available by quotation.
                            </p>
                        </div>

                        <Link
                            href="/service-areas"
                            className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"
                        >
                            Explore all service areas
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {locations.map((location) => (
                            <article
                                key={location.city}
                                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                    <MapPin className="h-6 w-6" />
                                </div>

                                <h3 className="mt-6 text-2xl font-bold text-slate-950">
                                    {location.city}
                                </h3>

                                <p className="mt-3 leading-7 text-slate-600">
                                    {location.description}
                                </p>

                                <Link
                                    href="/quote"
                                    className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700"
                                >
                                    Request a quote
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-24">
                <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                            Pricing guidance
                        </p>

                        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                            Understand the likely cost before booking
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-slate-600">
                            Final prices depend on distance, access, floors, volume, required
                            workers and additional services. These figures are starting
                            guidance only.
                        </p>

                        <Link
                            href="/quote"
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-700 px-7 py-4 font-bold text-white transition hover:bg-blue-800"
                        >
                            Calculate Your Estimate
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-4xl border border-slate-200 bg-slate-50">
                        {priceExamples.map((item, index) => (
                            <div
                                key={item.label}
                                className={[
                                    "flex items-center justify-between gap-5 px-6 py-6 sm:px-8",
                                    index !== priceExamples.length - 1
                                        ? "border-b border-slate-200"
                                        : "",
                                ].join(" ")}
                            >
                                <span className="font-semibold text-slate-800">
                                    {item.label}
                                </span>

                                <span className="text-lg font-extrabold text-blue-700">
                                    {item.price}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-blue-700 py-20 text-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                            Ready to get started?
                        </p>

                        <h2 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
                            Let us plan your next move.
                        </h2>

                        <p className="mt-4 max-w-2xl text-lg leading-8 text-blue-100">
                            Request your estimate today and receive a clear plan for your
                            relocation.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/quote"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-blue-800"
                        >
                            Get an Estimate
                            <ArrowRight className="h-5 w-5" />
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center rounded-full border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white/10"
                        >
                            Contact Movento
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}