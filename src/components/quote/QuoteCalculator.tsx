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
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

import {
    quoteConfirmationLifetimeMs,
    quoteConfirmationStorageKey,
    type QuoteConfirmationPayload,
} from "@/lib/quotes/confirmation";

type PropertyType = "studio" | "apartment" | "house" | "office";

type QuoteForm = {
    requestType: "standard" | "custom";
    customRequestDescription: string;
    multiplePickupLocations: string;
    specialHandlingRequirements: string;
    customAdditionalNotes: string;
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
    requestType: "standard",
    customRequestDescription: "",
    multiplePickupLocations: "",
    specialHandlingRequirements: "",
    customAdditionalNotes: "",
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

const englishSteps = [
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

export default function QuoteCalculator({
    language = "en",
    locale = "en-GB",
    currency = "EUR",
    confirmationPath,
}: {
    language?: Locale;
    locale?: string;
    currency?: string;
    confirmationPath: string;
}) {
    const steps = language === "it"
        ? ["Percorso", "Immobile", "Accesso", "Servizi", "Data", "Preventivo"]
        : englishSteps;
    const tr=(en:string,it:string)=>language==="it"?it:en;
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<QuoteForm>(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const estimate = useMemo(() => calculateEstimate(form), [form]);
    const money = useMemo(() => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }), [locale, currency]);

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
                tr("Please enter your name, email address and phone number.","Inserisci nome, email e numero di telefono."),
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
                    "x-movento-locale":language,
                },
                body: JSON.stringify({
                    ...form,
                    language,
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
                    tr("The quotation request could not be submitted.","Non è stato possibile inviare la richiesta di preventivo."),
                );
            }

            const submittedAt = Date.now();
            const confirmation: QuoteConfirmationPayload = {
                version: 1,
                quoteId: result.quoteId,
                submittedAt,
                expiresAt: submittedAt + quoteConfirmationLifetimeMs,
                currency,
                locale,
                quote: {
                    ...form,
                    propertyType: form.propertyType as PropertyType,
                    estimatedMinimum: estimate.minimum,
                    estimatedMaximum: estimate.maximum,
                },
            };

            try {
                sessionStorage.setItem(
                    quoteConfirmationStorageKey,
                    JSON.stringify(confirmation),
                );
            } catch {
                // The quote is already saved. The confirmation route will show
                // its privacy-safe empty state if browser storage is unavailable.
            }
            router.push(confirmationPath);
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : tr("Something went wrong. Please try again.","Si è verificato un errore. Riprova."),
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
                            {tr("Step","Passaggio")} {step + 1} {tr("of","di")} {steps.length}
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
                            {tr("Where are you moving?","Da dove a dove traslochi?")}
                        </h3>

                        <p className="mt-3 leading-7 text-slate-600">
                            {tr("Enter the starting location and destination.","Inserisci il luogo di partenza e la destinazione.")}
                        </p>

                        <div className="mt-8 grid gap-5">
                            <label>
                                <span className="text-sm font-bold text-slate-700">
                                    {tr("Moving from","Partenza")}
                                </span>
                                <input
                                    value={form.origin}
                                    onChange={(event) =>
                                        updateForm("origin", event.target.value)
                                    }
                                    placeholder={tr("Example: Terni","Esempio: Terni")}
                                    className="mt-2 w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                />
                            </label>

                            <label>
                                <span className="text-sm font-bold text-slate-700">
                                    {tr("Moving to","Destinazione")}
                                </span>
                                <input
                                    value={form.destination}
                                    onChange={(event) =>
                                        updateForm("destination", event.target.value)
                                    }
                                    placeholder={tr("Example: Rome","Esempio: Roma")}
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
                            {tr("Tell us about the property","Descrivi l’immobile")}
                        </h3>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            {[
                                {
                                    value: "studio",
                                    label: tr("Studio","Monolocale"),
                                    icon: Home,
                                },
                                {
                                    value: "apartment",
                                    label: tr("Apartment","Appartamento"),
                                    icon: Building2,
                                },
                                {
                                    value: "house",
                                    label: tr("House","Casa"),
                                    icon: Home,
                                },
                                {
                                    value: "office",
                                    label: tr("Office","Ufficio"),
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
                                {tr("Number of rooms","Numero di stanze")}
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
                                        {room} {room===1?tr("room","stanza"):tr("rooms","stanze")}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3 className="text-3xl font-extrabold text-slate-950">
                            {tr("Property access","Accesso all’immobile")}
                        </h3>

                        <p className="mt-3 leading-7 text-slate-600">
                            {tr("Floors and elevator access affect the required time and workers.","I piani e la presenza dell’ascensore incidono sui tempi e sul personale necessario.")}
                        </p>

                        <div className="mt-8 grid gap-8 md:grid-cols-2">
                            <AccessFields
                                title={tr("Current property","Immobile di partenza")}
                                language={language}
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
                                title={tr("Destination property","Immobile di destinazione")}
                                language={language}
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
                            {tr("Additional services","Servizi aggiuntivi")}
                        </h3>

                        <div className="mt-8 grid gap-4">
                            <ServiceOption
                                title={tr("Packing service","Servizio di imballaggio")}
                                description={tr("Movento packs and protects your belongings.","Movento imballa e protegge i tuoi beni.")}
                                selected={form.packing}
                                onClick={() => updateForm("packing", !form.packing)}
                                icon={<PackageCheck className="h-6 w-6" />}
                            />

                            <ServiceOption
                                title={tr("Furniture assembly","Montaggio mobili")}
                                description={tr("Disassembly before transport and reassembly afterward.","Smontaggio prima del trasporto e rimontaggio a destinazione.")}
                                selected={form.assembly}
                                onClick={() => updateForm("assembly", !form.assembly)}
                                icon={<Sofa className="h-6 w-6" />}
                            />

                            <ServiceOption
                                title={tr("Heavy or special items","Oggetti pesanti o speciali")}
                                description={tr("Pianos, safes, large appliances or unusually heavy furniture.","Pianoforti, casseforti, grandi elettrodomestici o mobili particolarmente pesanti.")}
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
                            {tr("When would you like to move?","Quando desideri traslocare?")}
                        </h3>

                        <label className="mt-8 block">
                            <span className="text-sm font-bold text-slate-700">
                                {tr("Preferred moving date","Data preferita")}
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
                                {tr("Additional information","Informazioni aggiuntive")}
                            </span>

                            <textarea
                                value={form.notes}
                                onChange={(event) =>
                                    updateForm("notes", event.target.value)
                                }
                                rows={5}
                                placeholder={tr("Tell us about parking, fragile belongings or anything else we should know.","Indicaci informazioni su parcheggio, oggetti fragili o altri dettagli utili.")}
                                className="mt-2 w-full resize-none rounded-2xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                            />
                        </label>
                    </div>
                )}

                {step === 5 && (
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
                            {tr("Estimated range","Fascia di prezzo stimata")}
                        </p>

                        <div className="mt-5 rounded-4xl bg-blue-950 p-7 text-white sm:p-9">
                            <p className="text-blue-200">{tr("Your initial estimate","Il tuo preventivo iniziale")}</p>

                            <p className="mt-3 text-4xl font-extrabold sm:text-5xl">
                                {money.format(estimate.minimum)}–{money.format(estimate.maximum)}
                            </p>

                            <p className="mt-5 leading-7 text-blue-100">
                                {tr("This is an initial estimate. Movento will review the information and confirm the final quotation before booking.","Questa è una stima iniziale. Movento esaminerà le informazioni e confermerà il preventivo finale prima della prenotazione.")}
                            </p>
                        </div>

                        <div className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-2">
                            <Summary label={tr("Moving from","Partenza")} value={form.origin} />
                            <Summary label={tr("Moving to","Destinazione")} value={form.destination} />
                            <Summary
                                label={tr("Property","Immobile")}
                                value={form.propertyType || tr("Not selected","Non selezionato")}
                            />
                            <Summary
                                label={tr("Rooms","Stanze")}
                                value={String(form.rooms)}
                            />
                            <Summary
                                label={tr("Moving date","Data del trasloco")}
                                value={form.movingDate}
                            />
                            <Summary
                                label={tr("Additional services","Servizi aggiuntivi")}
                                value={
                                    [
                                        form.packing && tr("Packing","Imballaggio"),
                                        form.assembly && tr("Assembly","Montaggio"),
                                        form.heavyItems && tr("Heavy items","Oggetti pesanti"),
                                    ]
                                        .filter(Boolean)
                                        .join(", ") || tr("None","Nessuno")
                                }
                            />
                        </div>

                        <div className="mt-8">
                            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-6 sm:p-7">
                                <h3 className="text-xl font-extrabold text-slate-950">{tr("Do you have a special moving request?","Hai una richiesta di trasloco particolare?")}</h3>
                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {([["standard",tr("No, this estimate is enough.","No, questa stima è sufficiente.")],["custom",tr("Yes, I need a custom quotation.","Sì, mi serve un preventivo personalizzato.")]] as const).map(([value, label]) => (
                                        <button key={value} type="button" onClick={() => updateForm("requestType", value)} className={`rounded-2xl border p-4 text-left font-bold transition ${form.requestType === value ? "border-blue-700 bg-white text-blue-800 shadow-sm" : "border-blue-100 bg-white/60 text-slate-700 hover:border-blue-300"}`}>{label}</button>
                                    ))}
                                </div>
                                <div className={`grid overflow-hidden transition-all duration-300 ${form.requestType === "custom" ? "mt-6 max-h-96 gap-4 opacity-100" : "max-h-0 opacity-0"}`}>
                                    <textarea value={form.customRequestDescription} onChange={(event) => updateForm("customRequestDescription", event.target.value)} rows={4} required={form.requestType === "custom"} placeholder={tr("Describe your request *","Descrivi la richiesta *")} className="resize-none rounded-2xl border border-slate-300 bg-white px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
                                    <textarea value={form.multiplePickupLocations} onChange={(event) => updateForm("multiplePickupLocations", event.target.value)} rows={2} placeholder={tr("Multiple pickup locations (optional)","Più luoghi di ritiro (facoltativo)")} className="resize-none rounded-2xl border border-slate-300 bg-white px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
                                    <textarea value={form.specialHandlingRequirements} onChange={(event) => updateForm("specialHandlingRequirements", event.target.value)} rows={2} placeholder={tr("Special handling requirements","Esigenze di movimentazione speciali")} className="resize-none rounded-2xl border border-slate-300 bg-white px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
                                    <textarea value={form.customAdditionalNotes} onChange={(event) => updateForm("customAdditionalNotes", event.target.value)} rows={2} placeholder={tr("Additional notes","Note aggiuntive")} className="resize-none rounded-2xl border border-slate-300 bg-white px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-950">
                                {tr("Request the final quotation","Richiedi il preventivo finale")}
                            </h3>

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                <input
                                    value={form.name}
                                    onChange={(event) =>
                                        updateForm("name", event.target.value)
                                    }
                                    placeholder={tr("Full name","Nome e cognome")}
                                    className="rounded-2xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                />

                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(event) =>
                                        updateForm("phone", event.target.value)
                                    }
                                    placeholder={tr("Phone number","Numero di telefono")}
                                    className="rounded-2xl border border-slate-300 px-5 py-4 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                                />

                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        updateForm("email", event.target.value)
                                    }
                                    placeholder={tr("Email address","Indirizzo email")}
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
                                    (form.requestType === "custom" && !form.customRequestDescription.trim())
                                }
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-4 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {isSubmitting
                                    ? tr("Submitting...","Invio in corso...")
                                    : tr("Submit Quote Request","Invia la richiesta di preventivo")}

                                {!isSubmitting && (
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
                        {tr("Back","Indietro")}
                    </button>

                    {step < steps.length - 1 && (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={!canContinue()}
                            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            {language === "it" ? "Continua" : "Continue"}
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
    language:Locale;
};

function AccessFields({
    title,
    floor,
    elevator,
    onFloorChange,
    onElevatorChange,
    language,
}: AccessFieldsProps) {
    const tr=(en:string,it:string)=>language==="it"?it:en;
    return (
        <div className="rounded-3xl border border-slate-200 p-6">
            <h4 className="font-extrabold text-slate-950">{title}</h4>

            <label className="mt-5 block">
                <span className="text-sm font-bold text-slate-700">{tr("Floor","Piano")}</span>

                <select
                    value={floor}
                    onChange={(event) =>
                        onFloorChange(Number(event.target.value))
                    }
                    className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                >
                    <option value={0}>{tr("Ground floor","Piano terra")}</option>
                    {[1, 2, 3, 4, 5, 6].map((value) => (
                        <option key={value} value={value}>
                            {tr("Floor","Piano")} {value}
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
                    {tr("Elevator available","Ascensore disponibile")}
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
