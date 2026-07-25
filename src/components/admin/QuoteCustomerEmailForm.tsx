"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";

import { sendQuoteCustomerEmail } from "@/app/admin/(protected)/actions";

const inputClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

export default function QuoteCustomerEmailForm({ quoteId, recipient, reference }: { quoteId: string; recipient: string; reference: string }) {
  const [state, action, pending] = useActionState(sendQuoteCustomerEmail, undefined);
  return (
    <form action={action} className="mt-6 space-y-5">
      <input type="hidden" name="quoteId" value={quoteId} />
      <label className="block">
        <span className="text-sm font-bold text-slate-700">Recipient</span>
        <input name="recipient" type="email" value={recipient} readOnly className={`${inputClass} bg-slate-50 text-slate-600`} />
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-700">Subject</span>
        <input name="subject" required maxLength={200} defaultValue={`Your Movento moving request — ${reference}`} className={inputClass} />
      </label>
      <label className="block">
        <span className="text-sm font-bold text-slate-700">Message</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={8} defaultValue={`Hello,\n\nThank you for contacting Movento about your move. We are reviewing request ${reference} and would like to discuss the details with you.\n\nKind regards,\nMovento`} className={`${inputClass} resize-y`} />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className={`text-sm font-bold ${state?.status === "success" ? "text-emerald-700" : "text-red-700"}`}>{state?.message}</p>
        <button disabled={pending} className="ml-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white outline-none hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 disabled:opacity-60">
          <Send className="h-4 w-4" />{pending ? "Sending…" : "Send email"}
        </button>
      </div>
    </form>
  );
}
