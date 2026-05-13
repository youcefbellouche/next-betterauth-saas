"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ExtendedUser } from "@/lib/types";

type ActionResponse<T> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string };

export interface InvoiceRecord {
  id: string;
  date: string;
  amount: number;
  status: string;
  url: string | null;
}

/**
 * Fetches the last 5 paid invoices for the currently authenticated user.
 */
export async function getUserInvoices(): Promise<ActionResponse<InvoiceRecord[]>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const customerId = (session.user as ExtendedUser).stripeCustomerId;

    if (!customerId) {
      // User hasn't made any purchases yet, so no invoices
      return { success: true, data: [] };
    }

    if (!stripe) {
      return { success: false, error: "Stripe is not configured." };
    }

    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 5,
      status: "paid",
    });

    const mappedInvoices = invoices.data.map((inv) => ({
      id: inv.id,
      date: new Date(inv.created * 1000).toISOString(),
      amount: inv.amount_paid, // Represented in cents
      status: inv.status || "unknown",
      url: inv.hosted_invoice_url || inv.invoice_pdf || null,
    }));

    return { success: true, data: mappedInvoices };
  } catch (error) {
    console.error("[GET_INVOICES_ERROR]", error);
    return { success: false, error: "An error occurred while fetching invoices." };
  }
}

/**
 * Generates a Stripe Customer Portal URL for managing subscriptions and payment methods.
 */
export async function createBillingPortalSession(): Promise<ActionResponse<{ url: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const customerId = (session.user as ExtendedUser).stripeCustomerId;

    if (!customerId) {
      return { success: false, error: "No active billing account found. Please subscribe to a plan first." };
    }

    if (!stripe) {
      return { success: false, error: "Stripe is not configured." };
    }

    // Determine the base URL dynamically or fallback to localhost
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard/billing`,
    });

    return { success: true, data: { url: portalSession.url } };
  } catch (error) {
    console.error("[BILLING_PORTAL_ERROR]", error);
    return { success: false, error: "An error occurred while generating the billing portal." };
  }
}
