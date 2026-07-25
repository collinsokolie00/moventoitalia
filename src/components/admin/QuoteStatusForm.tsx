"use client";

import { useActionState, useState } from "react";

import { updateQuoteStatus } from "@/app/admin/(protected)/actions";
import { quoteWorkflowStatusLabels, quoteWorkflowStatuses, type QuoteWorkflowStatus } from "@/lib/quotes/types";

export default function QuoteStatusForm({ quoteId, status }: { quoteId: string; status: QuoteWorkflowStatus }) {
  const [state, action, pending] = useActionState(updateQuoteStatus, undefined);
  const [selected, setSelected] = useState<QuoteWorkflowStatus>(status);
  const isRegression = status === "completed" && selected !== "completed";

  return (
    <form action={action} className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:w-auto">
      <input type="hidden" name="quoteId" value={quoteId} />
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-40 flex-1">
          <span className="block text-xs font-black uppercase tracking-wider text-slate-500">Workflow status</span>
          <select
            name="status"
            value={selected}
            onChange={(event) => setSelected(event.target.value as QuoteWorkflowStatus)}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-800 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          >
            {quoteWorkflowStatuses.map((value) => <option key={value} value={value}>{quoteWorkflowStatusLabels[value]}</option>)}
          </select>
        </label>
        <button disabled={pending} className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white outline-none hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 disabled:opacity-60">
          {pending ? "Saving…" : "Save status"}
        </button>
      </div>
      {isRegression && (
        <label className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-950">
          <input type="checkbox" name="confirmCompletedRegression" value="yes" className="mt-0.5 h-4 w-4" />
          Confirm reopening this completed request.
        </label>
      )}
      {state && <p aria-live="polite" className={`mt-3 text-sm font-bold ${state.status === "success" ? "text-emerald-700" : "text-red-700"}`}>{state.message}</p>}
    </form>
  );
}
