import "server-only";

import {
  FieldValue,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  type Timestamp,
} from "firebase-admin/firestore";

import type { AdminUser } from "@/lib/auth/session";
import {
  quoteWorkflowStatuses,
  type QuoteContactDeliveryStatus,
  type QuoteReadState,
  type QuoteRequestType,
  type QuoteWorkflowStatus,
} from "@/lib/quotes/types";
import { adminDb } from "./firebase-admin";

export type QuoteStatus = QuoteWorkflowStatus;

export type QuoteRecord = {
  id: string;
  reference: string;
  requestType: QuoteRequestType;
  readState: QuoteReadState;
  status: QuoteWorkflowStatus;
  name: string;
  phone: string;
  email: string;
  origin: string;
  destination: string;
  propertyType: string;
  rooms: number;
  originFloor: number;
  destinationFloor: number;
  originElevator: boolean;
  destinationElevator: boolean;
  packing: boolean;
  assembly: boolean;
  heavyItems: boolean;
  movingDate: string;
  notes: string;
  estimatedMinimum: number;
  estimatedMaximum: number;
  customRequestDescription: string;
  multiplePickupLocations: string;
  specialHandlingRequirements: string;
  customAdditionalNotes: string;
  currency: string;
  country: string;
  createdAt: string | null;
  updatedAt: string | null;
  readAt: string | null;
  contactedAt: string | null;
  quotedAt: string | null;
  completedAt: string | null;
};

export type QuoteContactRecord = {
  id: string;
  method: "email";
  type: "automatic_system_email" | "manual_admin_email";
  subject: string;
  deliveryStatus: QuoteContactDeliveryStatus;
  recipientEmail: string;
  providerMessageId: string | null;
  administratorDisplayName: string;
  createdAt: string | null;
};

type QuoteDocument = QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>;

function iso(value: unknown) {
  return value && typeof (value as Timestamp).toDate === "function"
    ? (value as Timestamp).toDate().toISOString()
    : null;
}

function normalizedStatus(value: unknown): QuoteWorkflowStatus {
  return quoteWorkflowStatuses.includes(value as QuoteWorkflowStatus) ? value as QuoteWorkflowStatus : "new";
}

function mapQuote(document: QuoteDocument): QuoteRecord {
  const data = document.data() ?? {};
  return {
    id: document.id,
    reference: data.reference ?? document.id,
    requestType: data.requestType === "custom" ? "custom" : "standard",
    readState: data.readAt ? "read" : "unread",
    status: normalizedStatus(data.status),
    name: data.name ?? "",
    phone: data.phone ?? "",
    email: data.email ?? "",
    origin: data.origin ?? "",
    destination: data.destination ?? "",
    propertyType: data.propertyType ?? "",
    rooms: data.rooms ?? 0,
    originFloor: data.originFloor ?? 0,
    destinationFloor: data.destinationFloor ?? 0,
    originElevator: Boolean(data.originElevator),
    destinationElevator: Boolean(data.destinationElevator),
    packing: Boolean(data.packing),
    assembly: Boolean(data.assembly),
    heavyItems: Boolean(data.heavyItems),
    movingDate: data.movingDate ?? "",
    notes: data.notes ?? "",
    estimatedMinimum: data.estimatedMinimum ?? 0,
    estimatedMaximum: data.estimatedMaximum ?? 0,
    customRequestDescription: data.customRequestDescription ?? "",
    multiplePickupLocations: data.multiplePickupLocations ?? "",
    specialHandlingRequirements: data.specialHandlingRequirements ?? "",
    customAdditionalNotes: data.customAdditionalNotes ?? "",
    currency: data.currency ?? "EUR",
    country: data.country ?? "IT",
    createdAt: iso(data.createdAt),
    updatedAt: iso(data.updatedAt),
    readAt: iso(data.readAt),
    contactedAt: iso(data.contactedAt),
    quotedAt: iso(data.quotedAt),
    completedAt: iso(data.completedAt),
  };
}

export async function listQuotes(limit = 100) {
  const snapshot = await adminDb.collection("quotes").orderBy("createdAt", "desc").limit(limit).get();
  return snapshot.docs.map(mapQuote);
}

export async function getQuote(id: string) {
  const document = await adminDb.collection("quotes").doc(id).get();
  return document.exists ? mapQuote(document) : null;
}

export async function markQuoteRead(id: string, administrator: Pick<AdminUser, "uid">) {
  const reference = adminDb.collection("quotes").doc(id);
  const exists = await adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) return false;
    if (!snapshot.data()?.readAt) {
      transaction.update(reference, {
        readAt: FieldValue.serverTimestamp(),
        readByUid: administrator.uid,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    return true;
  });
  return exists ? getQuote(id) : null;
}

export async function updateQuoteWorkflowStatus(options: {
  quoteId: string;
  status: QuoteWorkflowStatus;
  confirmCompletedRegression: boolean;
}) {
  const reference = adminDb.collection("quotes").doc(options.quoteId);
  return adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists) return { ok: false as const, reason: "not-found" as const };

    const data = snapshot.data() ?? {};
    const currentStatus = normalizedStatus(data.status);
    if (currentStatus === "completed" && options.status !== "completed" && !options.confirmCompletedRegression) {
      return { ok: false as const, reason: "confirm-completed-regression" as const };
    }

    const update: Record<string, unknown> = {
      status: options.status,
      statusUpdatedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    const timestampField = `${options.status}At`;
    if (!data[timestampField]) update[timestampField] = FieldValue.serverTimestamp();
    transaction.update(reference, update);
    return { ok: true as const };
  });
}

export async function recordQuoteEmailContact(options: {
  quoteId: string;
  subject: string;
  deliveryStatus: QuoteContactDeliveryStatus;
  providerMessageId?: string;
  administrator: AdminUser;
}) {
  const quoteReference = adminDb.collection("quotes").doc(options.quoteId);
  const contactReference = quoteReference.collection("contactHistory").doc();

  return adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(quoteReference);
    if (!snapshot.exists) return false;

    transaction.set(contactReference, {
      method: "email",
      type: "manual_admin_email",
      subject: options.subject,
      deliveryStatus: options.deliveryStatus,
      providerMessageId: options.providerMessageId ?? null,
      administratorUid: options.administrator.uid,
      administratorEmail: options.administrator.email,
      administratorDisplayName: options.administrator.displayName,
      createdAt: FieldValue.serverTimestamp(),
    });

    const data = snapshot.data() ?? {};
    const update: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
    if (options.deliveryStatus === "sent") {
      if (!data.contactedAt) update.contactedAt = FieldValue.serverTimestamp();
      if (normalizedStatus(data.status) === "new") {
        update.status = "contacted";
        update.statusUpdatedAt = FieldValue.serverTimestamp();
      }
    }
    transaction.update(quoteReference, update);
    return true;
  });
}

export async function recordAutomaticQuoteEmailContact(options: {
  quoteId: string;
  recipientEmail: string;
  providerMessageId?: string;
}) {
  const quoteReference = adminDb.collection("quotes").doc(options.quoteId);
  const contactReference = quoteReference.collection("contactHistory").doc();

  return adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(quoteReference);
    if (!snapshot.exists) return false;

    transaction.set(contactReference, {
      method: "email",
      type: "automatic_system_email",
      subject: "Automatic confirmation email sent",
      deliveryStatus: "sent",
      recipientEmail: options.recipientEmail,
      providerMessageId: options.providerMessageId ?? null,
      administratorUid: null,
      administratorEmail: null,
      administratorDisplayName: "Movento system",
      createdAt: FieldValue.serverTimestamp(),
    });
    transaction.update(quoteReference, {
      updatedAt: FieldValue.serverTimestamp(),
    });

    return true;
  });
}

export async function listQuoteContacts(quoteId: string, limit = 20): Promise<QuoteContactRecord[]> {
  const snapshot = await adminDb.collection("quotes").doc(quoteId).collection("contactHistory").orderBy("createdAt", "desc").limit(limit).get();
  return snapshot.docs.map((document) => {
    const data = document.data();
    return {
      id: document.id,
      method: "email",
      type: data.type === "automatic_system_email" ? "automatic_system_email" : "manual_admin_email",
      subject: data.subject ?? "Customer email",
      deliveryStatus: data.deliveryStatus === "sent" ? "sent" : "failed",
      recipientEmail: data.recipientEmail ?? "",
      providerMessageId: data.providerMessageId ?? null,
      administratorDisplayName: data.administratorDisplayName ?? "Administrator",
      createdAt: iso(data.createdAt),
    };
  });
}
