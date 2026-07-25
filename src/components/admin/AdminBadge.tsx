import type { ReactNode } from "react";

import {
  quoteReadStateLabels,
  quoteRequestTypeLabels,
  quoteWorkflowStatusLabels,
  type QuoteReadState,
  type QuoteRequestType,
  type QuoteWorkflowStatus,
} from "@/lib/quotes/types";

export type AdminBadgeTone = "orange" | "amber" | "green" | "blue" | "purple" | "gray" | "emerald" | "slate";

const tones: Record<AdminBadgeTone, string> = {
  orange: "bg-orange-50 text-orange-800",
  amber: "bg-amber-100 text-amber-900",
  green: "bg-green-50 text-green-800",
  blue: "bg-blue-50 text-blue-800",
  purple: "bg-purple-50 text-purple-800",
  gray: "bg-slate-800 text-white",
  emerald: "bg-emerald-50 text-emerald-800",
  slate: "bg-slate-100 text-slate-700",
};

export function AdminBadge({ children, tone = "slate" }: { children: ReactNode; tone?: AdminBadgeTone }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold leading-5 ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function RequestTypeBadge({ type }: { type: QuoteRequestType }) {
  return <AdminBadge tone={type === "custom" ? "amber" : "slate"}>{quoteRequestTypeLabels[type]}</AdminBadge>;
}

export function ReadStateBadge({ state }: { state: QuoteReadState }) {
  return <AdminBadge tone={state === "unread" ? "green" : "blue"}>{quoteReadStateLabels[state]}</AdminBadge>;
}

export function WorkflowStatusBadge({ status }: { status: QuoteWorkflowStatus }) {
  const tone: AdminBadgeTone = status === "new" ? "green" : status === "contacted" ? "blue" : status === "quoted" ? "purple" : "gray";
  return <AdminBadge tone={tone}>{quoteWorkflowStatusLabels[status]}</AdminBadge>;
}

export function PublicationBadge({ published, draftLabel = "Unpublished" }: { published: boolean; draftLabel?: "Draft" | "Unpublished" }) {
  return <AdminBadge tone={published ? "emerald" : "slate"}>{published ? "Published" : draftLabel}</AdminBadge>;
}

export function FeaturedBadge() {
  return <AdminBadge tone="amber">Featured</AdminBadge>;
}
