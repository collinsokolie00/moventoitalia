export const quoteRequestTypes = ["standard", "custom"] as const;
export const quoteWorkflowStatuses = ["new", "contacted", "quoted", "completed"] as const;

export type QuoteRequestType = (typeof quoteRequestTypes)[number];
export type QuoteReadState = "unread" | "read";
export type QuoteWorkflowStatus = (typeof quoteWorkflowStatuses)[number];
export type QuoteContactMethod = "email";
export type QuoteContactDeliveryStatus = "sent" | "failed";

export const quoteRequestTypeLabels: Record<QuoteRequestType, string> = {
  standard: "Standard Quote",
  custom: "Custom Request",
};

export const quoteReadStateLabels: Record<QuoteReadState, string> = {
  unread: "Unread",
  read: "Read",
};

export const quoteWorkflowStatusLabels: Record<QuoteWorkflowStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  completed: "Completed",
};
