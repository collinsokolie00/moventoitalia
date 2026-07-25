"use client";

import { useActionState } from "react";

import {
  deleteReview,
  saveReview,
} from "@/app/admin/(protected)/reviews/actions";
import type { Review } from "@/lib/database/reviews";

const input =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

export default function ReviewForm({ review }: { review?: Review }) {
  const [state, action, pending] = useActionState(saveReview, undefined);
  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="id" value={review?.id ?? ""} />
      <Field name="customerName" label="Customer name" value={review?.customerName} />
      <Field name="city" label="City" value={review?.city} />
      <label>
        <span className="text-sm font-bold">Star rating</span>
        <select className={input} name="starRating" defaultValue={review?.starRating ?? 5}>
          {[5, 4, 3, 2, 1].map((number) => (
            <option key={number} value={number}>
              {number} stars
            </option>
          ))}
        </select>
      </label>
      <Field
        name="serviceType"
        label="Service type (optional)"
        value={review?.serviceType}
        required={false}
      />
      <Field name="serviceTypeIt" label="Tipo di servizio — Italiano" value={review?.serviceTypeIt} required={false}/>
      <label className="sm:col-span-2">
        <span className="text-sm font-bold">Review</span>
        <textarea
          className={`${input} resize-y`}
          rows={5}
          name="review"
          defaultValue={review?.review}
          required
        />
      </label>
      <label className="sm:col-span-2"><span className="text-sm font-bold">Recensione — Italiano</span><textarea className={`${input} resize-y`} rows={5} name="reviewIt" defaultValue={review?.reviewIt}/></label>
      <Field
        name="customerPhoto"
        label="Customer photo URL (optional)"
        value={review?.customerPhoto}
        required={false}
        type="url"
      />
      <Field
        name="displayOrder"
        label="Display order"
        value={String(review?.displayOrder ?? 0)}
        type="number"
      />
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" name="featured" defaultChecked={review?.featured} />
          Featured
        </label>
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" name="published" defaultChecked={review?.published} />
          Published
        </label>
      </div>
      <div className="flex gap-3 sm:col-span-2">
        <button
          disabled={pending}
          className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800 disabled:opacity-60"
        >
          {pending ? "Saving…" : review ? "Save changes" : "Create review"}
        </button>
        {review && (
          <button
            formAction={deleteReview}
            formNoValidate
            onClick={(event) => {
              if (!window.confirm("Delete this review permanently?")) {
                event.preventDefault();
              }
            }}
            className="rounded-xl border border-red-200 px-5 py-3 font-bold text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>
      {state && (
        <p
          aria-live="polite"
          className={`sm:col-span-2 text-sm font-bold ${
            state.status === "success" ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

function Field({
  name,
  label,
  value,
  required = true,
  type,
}: {
  name: string;
  label: string;
  value?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label>
      <span className="text-sm font-bold">{label}</span>
      <input
        className={input}
        name={name}
        defaultValue={value ?? ""}
        required={required}
        type={type}
        min={type === "number" ? 0 : undefined}
      />
    </label>
  );
}
