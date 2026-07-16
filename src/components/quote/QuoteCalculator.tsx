"use client";

import {
    ArrowLeft,
    ArrowRight,
    Building2,
    CalendarDays,
    Check,
    Home,
    MapPin,
    PackageCheck,
    Sofa,
} from "lucide-react";
import { useMemo, useState } from "react";

type PropertyType = "studio" | "apartment" | "house" | "office";

type QuoteForm = {
    origin: string;
    destination: string;
    propertyType: PropertyType | "";
    rooms: number;
    originFloor: number;
    destinationFloor: number;
    originElevator: boolean;
    destinationElevator: boolean;
    packing: boolean;
    assembly: boolean;
    heavyItems: boolean;
    movingDate: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
};

const initialForm: QuoteForm = {
    origin: "",
    destination: "",
    propertyType: "",
    rooms: 1,
    originFloor: 0,
    destinationFloor: 0,
    originElevator: false,
    destinationElevator: false,
    packing: false,
    assembly: false,
    heavyItems: false,
    movingDate: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
};

const steps = [
    "Route",
    "Property",
    "Access",
    "Services",
    "Date",
    "Estimate",
];

function calculateEstimate(form: QuoteForm) {
    let minimum = 180;
    let maximum = 260;

    const propertyPrices: Record<
        Exclude<PropertyType, "">,
        { minimum: number; maximum: number }
    > = {
        studio: { minimum: 70, maximum: 100 },
        apartment: { minimum: 140, maximum: 260 },
        house: { minimum: 350, maximum: 650 },
        office: { minimum: 400, maximum: 800 },
    };

    if (form.propertyType) {
        minimum += propertyPrices[form.propertyType].minimum;
        maximum += propertyPrices[form.propertyType].maximum;
    }

    if (form.rooms > 1) {
        minimum += (form.rooms - 1) * 55;
        maximum += (form.rooms - 1) * 90;
    }

    const difficultOriginAccess =
        form.originFloor > 0 && !form.originElevator;
    const difficultDestinationAccess =
        form.destinationFloor > 0 && !form.destinationElevator;

    if (difficultOriginAccess) {
        minimum += form.originFloor * 35;
        maximum += form.originFloor * 60;
    }

    if (difficultDestinationAccess) {
        minimum += form.destinationFloor * 35;
        maximum += form.destinationFloor * 60;
    }

    if (form.packing) {
        minimum += 100;
        maximum += 220;
    }

    if (form.assembly) {
        minimum += 80;
        maximum += 180;
    }

    if (form.heavyItems) {
        minimum += 100;
        maximum += 300;
    }

    return {
        minimum: Math.round(minimum / 10) * 10,
        maximum: Math.round(maximum / 10) * 10,
    };
}

export default function QuoteCalculator() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<QuoteForm>(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submittedQuoteId, setSubmittedQuoteId] = useState("");

    const estimate = useMemo(() => calculateEstimate(form), [form]);

    function updateForm<K extends keyof QuoteForm>(
        field: K,
        value: QuoteForm[K],
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function nextStep() {
        setStep((current) => Math.min(current + 1, steps.length - 1));
    }

    function previousStep() {
        setStep((current) => Math.max(current - 1, 0));
    }

    async function submitQuote() {
        if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
            setSubmitError(
                "Please enter your name, email address and phone number.",
            );
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const response = await fetch("/api/quotes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    estimatedMinimum: estimate.minimum,
                    estimatedMaximum: estimate.maximum,
                }),
            });

            const result = (await response.json()) as {
                success?: boolean;
                message?: string;
                quoteId?: string;
            };

            if (!response.ok || !result.success || !result.quoteId) {
                throw new Error(
                    result.message ??
                    "The quotation request could not be submitted.",
                );
            }

            setSubmittedQuoteId(result.quoteId);
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function canContinue() {
        if (step === 0) {

            return form.origin.trim() !== "" && form.destination.trim() !== "";
        }

        if (step === 1) {
            return form.propertyType !== "";
        }

        if (step === 4) {
            return form.movingDate !== "";
        }

        return true;
    }

    return (
        <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-6 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-bold text-blue-700">
                            Step {step + 1} of {steps.length}
                        </p>
                        <h2 className="mt-1 text-2xl font-extrabold text-slate-950">
                            {steps[step]}
                        </h2>
                    </div>

                    <span className="text-sm font-semibold text-slate-500">
                        {Math.round(((step + 1) / steps.length) * 100)}%
                    </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                        className="h-full rounded-full bg-blue-700 transition-all duration-300"
                        style={{
                            width: `${((step + 1) / steps.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            <div className="p-6 sm:p-8">
                {step === 0 && (
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                            <MapPin className="h-6 w-6" />
                        </div>

                        <h3 className="mt-5 text-3xl font-extrabold text-slate-950">
                            Where are you moving?
                        </h3>

                        <p className="mt-3 leading-7 text-slate-600">
                            Enter the starting location and destination.
                        </p>

                        <div className="mt-8 grid gap-5">
                            <label>
                                <span className="text-sm font-bold text-slate-700">
                                    Moving from
                                </span>
                                <input
                                    value={form.origin}
                                    onChange={(event) =>
                                        updateForm("origin", event.target.value)
                                    }
                                    placeholder="Example: Terni"
                                    className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                />
                            </label>

                            <label>
                                <span className="text-sm font-bold text-slate-700">
                                    Moving to
                                </span>
                                <input
                                    value={form.destination}
                                    onChange={(event) =>
                                        updateForm("destination", event.target.value)
                                    }
                                    placeholder="Example: Rome"
                                    className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                />
                            </label>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                            <Home className="h-6 w-6" />
                        </div>

                        <h3 className="mt-5 text-3xl font-extrabold text-slate-950">
                            Tell us about the property
                        </h3>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            {[
                                {
                                    value: "studio",
                                    label: "Studio",
                                    icon: Home,
                                },
                                {
                                    value: "apartment",
                                    label: "Apartment",
                                    icon: Building2,
                                },
                                {
                                    value: "house",
                                    label: "House",
                                    icon: Home,
                                },
                                {
                                    value: "office",
                                    label: "Office",
                                    icon: Building2,
                                },
                            ].map((option) => {
                                const Icon = option.icon;
                                const selected = form.propertyType === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            updateForm(
                                                "propertyType",
                                                option.value as PropertyType,
                                            )
                                        }
                                        className={[
                                            "flex items-center gap-4 rounded-3xl border p-5 text-left transition",
                                            selected
                                                ? "border-blue-700 bg-blue-50 text-blue-800"
                                                : "border-slate-200 hover:border-blue-300",
                                        ].join(" ")}
                                    >
                                        <Icon className="h-6 w-6" />
                                        <span className="font-bold">{option.label}</span>

                                        {selected && (
                                            <Check className="ml-auto h-5 w-5" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <label className="mt-7 block">
                            <span className="text-sm font-bold text-slate-700">
                                Number of rooms
                            </span>

                            <select
                                value={form.rooms}
                                onChange={(event) =>
                                    updateForm("rooms", Number(event.target.value))
                                }
                                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            >
                                {[1, 2, 3, 4, 5, 6].map((room) => (
                                    <option key={room} value={room}>
                                        {room} {room === 1 ? "room" : "rooms"}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3 className="text-3xl font-extrabold text-slate-950">
                            Property access
                        </h3>

                        <p className="mt-3 leading-7 text-slate-600">
                            Floors and elevator access affect the required time and workers.
                        </p>

                        <div className="mt-8 grid gap-8 md:grid-cols-2">
                            <AccessFields
                                title="Current property"
                                floor={form.originFloor}
                                elevator={form.originElevator}
                                onFloorChange={(value) =>
                                    updateForm("originFloor", value)
                                }
                                onElevatorChange={(value) =>
                                    updateForm("originElevator", value)
                                }
                            />

                            <AccessFields
                                title="Destination property"
                                floor={form.destinationFloor}
                                elevator={form.destinationElevator}
                                onFloorChange={(value) =>
                                    updateForm("destinationFloor", value)
                                }
                                onElevatorChange={(value) =>
                                    updateForm("destinationElevator", value)
                                }
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                            <PackageCheck className="h-6 w-6" />
                        </div>

                        <h3 className="mt-5 text-3xl font-extrabold text-slate-950">
                            Additional services
                        </h3>

                        <div className="mt-8 grid gap-4">
                            <ServiceOption
                                title="Packing service"
                                description="Movento packs and protects your belongings."
                                selected={form.packing}
                                onClick={() => updateForm("packing", !form.packing)}
                                icon={<PackageCheck className="h-6 w-6" />}
                            />

                            <ServiceOption
                                title="Furniture assembly"
                                description="Disassembly before transport and reassembly afterward."
                                selected={form.assembly}
                                onClick={() => updateForm("assembly", !form.assembly)}
                                icon={<Sofa className="h-6 w-6" />}
                            />

                            <ServiceOption
                                title="Heavy or special items"
                                description="Pianos, safes, large appliances or unusually heavy furniture."
                                selected={form.heavyItems}
                                onClick={() =>
                                    updateForm("heavyItems", !form.heavyItems)
                                }
                                icon={<Building2 className="h-6 w-6" />}
                            />
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                            <CalendarDays className="h-6 w-6" />
                        </div>

                        <h3 className="mt-5 text-3xl font-extrabold text-slate-950">
                            When would you like to move?
                        </h3>

                        <label className="mt-8 block">
                            <span className="text-sm font-bold text-slate-700">
                                Preferred moving date
                            </span>

                            <input
                                type="date"
                                value={form.movingDate}
                                min={new Date().toISOString().split("T")[0]}
                                onChange={(event) =>
                                    updateForm("movingDate", event.target.value)
                                }
                                className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            />
                        </label>

                        <label className="mt-6 block">
                            <span className="text-sm font-bold text-slate-700">
                                Additional information
                            </span>

                            <textarea
                                value={form.notes}
                                onChange={(event) =>
                                    updateForm("notes", event.target.value)
                                }
                                rows={5}
                                placeholder="Tell us about parking, fragile belongings or anything else we should know."
                                className="mt-2 w-full resize-none rounded-2xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            />
                        </label>
                    </div>
                )}

                {step === 5 && (
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                            Estimated range
                        </p>

                        <div className="mt-5 rounded-4xl bg-blue-950 p-7 text-white sm:p-9">
                            <p className="text-blue-200">Your initial estimate</p>

                            <p className="mt-3 text-4xl font-extrabold sm:text-5xl">
                                €{estimate.minimum}–€{estimate.maximum}
                            </p>

                            <p className="mt-5 leading-7 text-blue-100">
                                This is an initial estimate. Movento will review the
                                information and confirm the final quotation before booking.
                            </p>
                        </div>

                        <div className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-2">
                            <Summary label="Moving from" value={form.origin} />
                            <Summary label="Moving to" value={form.destination} />
                            <Summary
                                label="Property"
                                value={form.propertyType || "Not selected"}
                            />
                            <Summary
                                label="Rooms"
                                value={String(form.rooms)}
                            />
                            <Summary
                                label="Moving date"
                                value={form.movingDate}
                            />
                            <Summary
                                label="Additional services"
                                value={
                                    [
                                        form.packing && "Packing",
                                        form.assembly && "Assembly",
                                        form.heavyItems && "Heavy items",
                                    ]
                                        .filter(Boolean)
                                        .join(", ") || "None"
                                }
                            />
                        </div>

                        <div className="mt-8">
                            <h3 className="text-2xl font-extrabold text-slate-950">
                                Request the final quotation
                            </h3>

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                <input
                                    value={form.name}
                                    onChange={(event) =>
                                        updateForm("name", event.target.value)
                                    }
                                    placeholder="Full name"
                                    className="rounded-2xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                />

                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(event) =>
                                        updateForm("phone", event.target.value)
                                    }
                                    placeholder="Phone number"
                                    className="rounded-2xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                />

                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        updateForm("email", event.target.value)
                                    }
                                    placeholder="Email address"
                                    className="rounded-2xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 sm:col-span-2"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={submitQuote}
                                disabled={
                                    isSubmitting ||
                                    !form.name.trim() ||
                                    !form.email.trim() ||
                                    !form.phone.trim() ||
                                    Boolean(submittedQuoteId)
                                }
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-4 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {isSubmitting
                                    ? "Submitting..."
                                    : submittedQuoteId
                                        ? "Quote Request Submitted"
                                        : "Submit Quote Request"}

                                {!isSubmitting && !submittedQuoteId && (
                                    <ArrowRight className="h-5 w-5" />
                                )}
                            </button>

                            {submitError && (
                                <p
                                    role="alert"
                                    className="mt-4 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-700"
                                >
                                    {submitError}
                                </p>
                            )}

                            {submittedQuoteId && (
                                <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                                    <p className="text-xl font-extrabold text-emerald-900">
                                        Your request has been received.
                                    </p>

                                    <p className="mt-2 leading-7 text-emerald-800">
                                        Your reference number is{" "}
                                        <strong>{submittedQuoteId}</strong>. Movento will review your
                                        information and contact you to confirm the final quotation.
                                    </p>

                                    {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER && (
                                        <a
                                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
                                                `Hello Movento, I submitted quotation ${submittedQuoteId}.`,
                                            )}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-5 inline-flex rounded-full bg-emerald-700 px-6 py-3 font-bold text-white"
                                        >
                                            Continue on WhatsApp
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
                    <button
                        type="button"
                        onClick={previousStep}
                        disabled={step === 0}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-100 disabled:invisible"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back
                    </button>

                    {step < steps.length - 1 && (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!canContinue()}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            Continue
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

type AccessFieldsProps = {
    title: string;
    floor: number;
    elevator: boolean;
    onFloorChange: (value: number) => void;
    onElevatorChange: (value: boolean) => void;
};

function AccessFields({
    title,
    floor,
    elevator,
    onFloorChange,
    onElevatorChange,
}: AccessFieldsProps) {
    return (
        <div className="rounded-3xl border border-slate-200 p-6">
            <h4 className="font-extrabold text-slate-950">{title}</h4>

            <label className="mt-5 block">
                <span className="text-sm font-bold text-slate-700">Floor</span>

                <select
                    value={floor}
                    onChange={(event) =>
                        onFloorChange(Number(event.target.value))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                >
                    <option value={0}>Ground floor</option>
                    {[1, 2, 3, 4, 5, 6].map((value) => (
                        <option key={value} value={value}>
                            Floor {value}
                        </option>
                    ))}
                </select>
            </label>

            <label className="mt-5 flex cursor-pointer items-center gap-3">
                <input
                    type="checkbox"
                    checked={elevator}
                    onChange={(event) =>
                        onElevatorChange(event.target.checked)
                    }
                    className="h-5 w-5 rounded border-slate-300 text-blue-700"
                />
                <span className="font-semibold text-slate-700">
                    Elevator available
                </span>
            </label>
        </div>
    );
}

type ServiceOptionProps = {
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
};

function ServiceOption({
    title,
    description,
    selected,
    onClick,
    icon,
}: ServiceOptionProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex items-start gap-4 rounded-3xl border p-5 text-left transition",
                selected
                    ? "border-blue-700 bg-blue-50"
                    : "border-slate-200 hover:border-blue-300",
            ].join(" ")}
        >
            <span className="text-blue-700">{icon}</span>

            <span>
                <span className="block font-extrabold text-slate-950">
                    {title}
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">
                    {description}
                </span>
            </span>

            {selected && (
                <Check className="ml-auto h-5 w-5 shrink-0 text-blue-700" />
            )}
        </button>
    );
}

function Summary({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {label}
            </p>
            <p className="mt-1 font-bold capitalize text-slate-900">
                {value}
            </p>
        </div>
    );
}
