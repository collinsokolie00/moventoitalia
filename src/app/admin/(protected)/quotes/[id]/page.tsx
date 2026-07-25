import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";

import { AdminBadge, ReadStateBadge, RequestTypeBadge, WorkflowStatusBadge } from "@/components/admin/AdminBadge";
import QuoteCustomerEmailForm from "@/components/admin/QuoteCustomerEmailForm";
import QuoteStatusForm from "@/components/admin/QuoteStatusForm";
import { requireAdmin } from "@/lib/auth/session";
import { listQuoteContacts, markQuoteRead } from "@/lib/database/quotes";
import { formatCurrency, getSiteSettings } from "@/lib/database/settings";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><dt className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-2 break-words font-semibold text-slate-900">{value || "—"}</dd></div>;
}

function safeTelephone(value: string) {
  return value.replace(/[^+\d*#]/g, "");
}

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const administrator = await requireAdmin();
  const quote = await markQuoteRead(id, administrator);
  if (!quote) notFound();

  const [settings, contacts] = await Promise.all([getSiteSettings(), listQuoteContacts(quote.id)]);
  const displaySettings = { siteLocale: settings?.siteLocale ?? "en-IT", defaultCurrency: quote.currency || (settings?.defaultCurrency ?? "EUR") };
  const dateFormatter = new Intl.DateTimeFormat(displaySettings.siteLocale, { dateStyle: "long", timeStyle: "short", timeZone: settings?.defaultTimeZone ?? "Europe/Rome" });
  const services = [quote.packing && "Packing", quote.assembly && "Assembly", quote.heavyItems && "Heavy items"].filter(Boolean).join(", ") || "None";
  const telephone = safeTelephone(quote.phone);
  const timeline = [
    ["Submitted", quote.createdAt],
    ["Read", quote.readAt],
    ["Contacted", quote.contactedAt],
    ["Quoted", quote.quotedAt],
    ["Completed", quote.completedAt],
    ["Last updated", quote.updatedAt],
  ] as const;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <Link href="/admin/quotes" className="text-sm font-bold text-blue-700">← Quote Requests</Link>
      <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="break-words text-3xl font-extrabold text-slate-950">{quote.name || "Customer request"}</h1>
          <p className="mt-2 font-bold text-slate-400">{quote.reference}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <RequestTypeBadge type={quote.requestType} />
            <ReadStateBadge state={quote.readState} />
            <WorkflowStatusBadge status={quote.status} />
          </div>
        </div>
        <QuoteStatusForm quoteId={quote.id} status={quote.status} />
      </div>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-extrabold">Customer & move</h2>
        <dl className="mt-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Name" value={quote.name} />
          <Field label="Phone" value={telephone ? <a href={`tel:${telephone}`} className="text-blue-700 underline-offset-4 hover:underline focus:outline-none focus:ring-4 focus:ring-blue-100">{quote.phone}</a> : "—"} />
          <Field label="Email" value={quote.email ? <a href={`mailto:${quote.email}`} className="text-blue-700 underline-offset-4 hover:underline focus:outline-none focus:ring-4 focus:ring-blue-100">{quote.email}</a> : "—"} />
          <Field label="Moving route" value={`${quote.origin || "—"} → ${quote.destination || "—"}`} />
          <Field label="Property" value={`${quote.propertyType || "—"}, ${quote.rooms} room${quote.rooms === 1 ? "" : "s"}`} />
          <Field label="Moving date" value={quote.movingDate} />
          <Field label="Origin access" value={`Floor ${quote.originFloor} · ${quote.originElevator ? "Elevator" : "No elevator"}`} />
          <Field label="Destination access" value={`Floor ${quote.destinationFloor} · ${quote.destinationElevator ? "Elevator" : "No elevator"}`} />
          <Field label="Services" value={services} />
          <Field label="Estimated price" value={`${formatCurrency(quote.estimatedMinimum, displaySettings)}–${formatCurrency(quote.estimatedMaximum, displaySettings)}`} />
          <Field label="Submitted date" value={quote.createdAt ? dateFormatter.format(new Date(quote.createdAt)) : "Pending"} />
          <Field label="Notes" value={quote.notes} />
        </dl>
      </section>

      {quote.requestType === "custom" && (
        <section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-amber-950">Custom request details</h2>
          <dl className="mt-7 grid gap-7 sm:grid-cols-2">
            <Field label="Custom request description" value={quote.customRequestDescription} />
            <Field label="Multiple pickup locations" value={quote.multiplePickupLocations} />
            <Field label="Special handling requirements" value={quote.specialHandlingRequirements} />
            <Field label="Additional notes" value={quote.customAdditionalNotes} />
          </dl>
        </section>
      )}

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-extrabold text-slate-950">Contact customer</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">A successful admin email is recorded and moves only a New request to Contacted. Calls require a manual workflow update.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {telephone && <a href={`tel:${telephone}`} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-bold text-blue-800 outline-none hover:bg-blue-100 focus:ring-4 focus:ring-blue-100"><Phone className="h-4 w-4" />Call customer</a>}
          {quote.email && <a href={`mailto:${quote.email}`} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 outline-none hover:border-blue-300 hover:text-blue-800 focus:ring-4 focus:ring-blue-100"><Mail className="h-4 w-4" />Open email app</a>}
        </div>
        {quote.email ? <QuoteCustomerEmailForm quoteId={quote.id} recipient={quote.email} reference={quote.reference} /> : <p className="mt-6 rounded-xl bg-amber-50 p-4 font-semibold text-amber-950">This request has no customer email address.</p>}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-950">Request timeline</h2>
          <dl className="mt-6 space-y-4">{timeline.map(([label, value]) => <div key={label} className="flex items-start justify-between gap-5 border-b border-slate-100 pb-4"><dt className="font-bold text-slate-600">{label}</dt><dd className="text-right text-sm text-slate-500">{value ? dateFormatter.format(new Date(value)) : "Not yet"}</dd></div>)}</dl>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-950">Contact history</h2>
          <div className="mt-5 space-y-4">
            {contacts.map((contact) => <div key={contact.id} className="rounded-2xl border border-slate-100 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-extrabold text-slate-900">{contact.type === "automatic_system_email" ? "Automatic system email" : "Email"}</p><AdminBadge tone={contact.deliveryStatus === "sent" ? "emerald" : "slate"}>{contact.deliveryStatus === "sent" ? "Sent" : "Failed"}</AdminBadge></div><p className="mt-2 break-words text-sm text-slate-700">{contact.subject}</p>{contact.recipientEmail && <p className="mt-2 break-words text-xs text-slate-500">Recipient: {contact.recipientEmail}</p>}{contact.providerMessageId && <p className="mt-1 break-all text-xs text-slate-400">Provider ID: {contact.providerMessageId}</p>}<p className="mt-2 text-xs text-slate-400">{contact.administratorDisplayName} · {contact.createdAt ? dateFormatter.format(new Date(contact.createdAt)) : "Timestamp pending"}</p></div>)}
            {contacts.length === 0 && <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No customer contact attempts have been recorded.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
