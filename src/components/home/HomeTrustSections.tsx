import Link from "next/link";
import {
    ArrowRight,
    ChevronRight,
    MessageCircleMore,
    ShieldCheck,
    Star,
} from "lucide-react";

const testimonials = [
    {
        name: "Local apartment move",
        location: "Terni",
        text: "Careful handling, clear communication and an organised moving process from beginning to end.",
    },
    {
        name: "Furniture transport",
        location: "Perugia",
        text: "Furniture was protected properly, transported safely and delivered without unnecessary delays.",
    },
    {
        name: "Home relocation",
        location: "Rome",
        text: "A professional service designed around planning, protection and respect for the customer’s belongings.",
    },
];

const questions = [
    {
        question: "How is the final moving price calculated?",
        answer:
            "The price depends on distance, property size, floors, elevator access, parking, number of workers, furniture volume and any additional packing or assembly services.",
    },
    {
        question: "Do I need an account to request an estimate?",
        answer:
            "No. Customers can calculate an estimate, request a quotation and contact Movento without creating an account.",
    },
    {
        question: "Can Movento pack and protect my furniture?",
        answer:
            "Yes. Movento can provide furniture protection, packing, disassembly, careful loading and reassembly where required.",
    },
    {
        question: "Which areas do you currently serve?",
        answer:
            "Our initial coverage includes Terni, Perugia, Rome and nearby towns. Longer-distance moves can be arranged through a custom quotation.",
    },
];

export default function HomeTrustSections() {
    return (
        <>
            <section className="bg-slate-50 py-24">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                                Built on practical experience
                            </p>

                            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                                We understand how belongings should be handled.
                            </h2>

                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                Movento is being built around real moving experience—not only
                                technology. We understand packing, furniture protection,
                                careful lifting, secure loading and respectful delivery.
                            </p>

                            <div className="mt-8 space-y-5">
                                <div className="flex gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-950">
                                            Proper protection
                                        </h3>
                                        <p className="mt-1 leading-7 text-slate-600">
                                            Furniture and fragile belongings are prepared carefully
                                            before loading.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                        <MessageCircleMore className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-950">
                                            Clear communication
                                        </h3>
                                        <p className="mt-1 leading-7 text-slate-600">
                                            Customers receive a clear plan before moving day and
                                            updates throughout the process.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {testimonials.map((testimonial, index) => (
                                <article
                                    key={`${testimonial.name}-${testimonial.location}`}
                                    className={[
                                        "rounded-4xl border border-slate-200 bg-white p-7 shadow-sm",
                                        index === 2 ? "md:col-span-2" : "",
                                    ].join(" ")}
                                >
                                    <div className="flex gap-1 text-amber-500">
                                        {Array.from({ length: 5 }).map((_, starIndex) => (
                                            <Star
                                                key={starIndex}
                                                className="h-4 w-4 fill-current"
                                            />
                                        ))}
                                    </div>

                                    <p className="mt-5 text-lg leading-8 text-slate-700">
                                        “{testimonial.text}”
                                    </p>

                                    <div className="mt-6">
                                        <p className="font-bold text-slate-950">
                                            {testimonial.name}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {testimonial.location}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <p className="mt-8 text-sm leading-6 text-slate-500">
                        These are temporary service examples. We will replace them with
                        verified customer reviews after Movento completes its first jobs.
                    </p>
                </div>
            </section>

            <section className="bg-white py-24">
                <div className="mx-auto max-w-5xl px-5 lg:px-8">
                    <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                            Frequently asked questions
                        </p>

                        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                            Important answers before your move
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                            Clear information helps customers plan with confidence and avoids
                            unexpected problems on moving day.
                        </p>
                    </div>

                    <div className="mt-12 space-y-4">
                        {questions.map((item) => (
                            <details
                                key={item.question}
                                className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 open:border-blue-200 open:bg-blue-50/50"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold text-slate-950">
                                    <span>{item.question}</span>

                                    <ChevronRight className="h-5 w-5 shrink-0 text-blue-700 transition group-open:rotate-90" />
                                </summary>

                                <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href="/faq"
                            className="inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-900"
                        >
                            View all frequently asked questions
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}