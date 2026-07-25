"use client";

import Link from "next/link";
import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";

export default function ContactForm({
  heading,
  supportingText,
  locale,
}: {
  heading: string;
  supportingText: string;
  locale: Locale;
}) {
  const tr = (english: string, italian: string) => locale === "it" ? italian : english;
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json","x-movento-locale":locale },
        body: JSON.stringify({...data,language:locale}),
      });
      const result = (await response.json()) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? tr("Your message could not be sent.", "Non è stato possibile inviare il messaggio."));
      }

      setStatus("success");
      setMessage(result.message ?? tr("Your message has been sent.", "Il tuo messaggio è stato inviato."));
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : tr("Your message could not be sent.", "Non è stato possibile inviare il messaggio."),
      );
    }
  }

  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:rounded-3xl sm:p-8 lg:p-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600 sm:text-sm sm:tracking-[0.25em]">
        {tr("Send a message", "Invia un messaggio")}
      </p>
      <h2 className="mt-2 text-base font-bold leading-5 tracking-tight sm:mt-4 sm:text-3xl sm:leading-tight">
        {heading}
      </h2>
      <p className="mt-2 text-xs leading-5 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
        {supportingText}
      </p>

      <form onSubmit={submit} className="mt-4 space-y-3 sm:mt-8 sm:space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-5">
          <Field
            id="name"
            label={tr("Full name", "Nome e cognome")}
            required
            autoComplete="name"
          />
          <Field
            id="phone"
            label={tr("Telephone", "Telefono")}
            type="tel"
            autoComplete="tel"
          />
        </div>

        <Field
          id="email"
          label={tr("Email address", "Indirizzo email")}
          type="email"
          required
          autoComplete="email"
        />

        <label className="block">
          <span className="mb-1 block text-[10px] font-semibold leading-4 text-slate-800 sm:mb-2 sm:text-sm">
            {tr("What do you need help with?", "Di cosa hai bisogno?")}
          </span>
          <select
            id="subject"
            name="subject"
            required
            defaultValue=""
            className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs outline-none focus:border-blue-600 sm:rounded-xl sm:px-4 sm:py-3 sm:text-base"
          >
            <option value="" disabled>
              {tr("Select a subject", "Seleziona un argomento")}
            </option>
            {[
              ["Home move", tr("Home move", "Trasloco casa")],
              ["Office move", tr("Office move", "Trasloco ufficio")],
              ["Furniture transport", tr("Furniture transport", "Trasporto mobili")],
              ["Packing services", tr("Packing services", "Servizi di imballaggio")],
              ["Storage enquiry", tr("Storage enquiry", "Richiesta deposito")],
              ["Existing quote", tr("Existing quote", "Preventivo esistente")],
              ["General enquiry", tr("General enquiry", "Richiesta generale")],
            ].map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-[10px] font-semibold leading-4 text-slate-800 sm:mb-2 sm:text-sm">
            {tr("Message", "Messaggio")}
          </span>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            rows={5}
            className="w-full min-w-0 resize-none rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs outline-none focus:border-blue-600 sm:rounded-xl sm:px-4 sm:py-3 sm:text-base"
          />
        </label>

        <button
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60 sm:gap-2 sm:rounded-xl sm:px-6 sm:py-4 sm:text-base"
        >
          {status === "loading" ? tr("Sending…", "Invio…") : tr("Send Message", "Invia messaggio")}
          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        {message && (
          <p
            role="status"
            className={`text-center text-[10px] font-semibold sm:text-sm ${
              status === "success" ? "text-emerald-700" : "text-red-700"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-center text-[10px] leading-4 text-slate-500 sm:text-sm">
          {tr("For a complete moving price, use the", "Per un prezzo completo del trasloco, usa il")}{" "}
          <Link
            href={localePath(locale, "/quote")}
            className="font-semibold text-blue-600 hover:underline"
          >
            {tr("estimate form", "modulo preventivo")}
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  ...props
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-[10px] font-semibold leading-4 text-slate-800 sm:mb-2 sm:text-sm">
        {label}
      </span>
      <input
        id={id}
        name={id}
        className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs outline-none focus:border-blue-600 sm:rounded-xl sm:px-4 sm:py-3 sm:text-base"
        {...props}
      />
    </label>
  );
}
