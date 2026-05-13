"use server";

import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ExtendedUser } from "@/lib/types";

const checkoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
});

/**
 * Server Action to create a Stripe Checkout session.
 * Designed to be called directly from a form action.
 * 
 * @param priceId The Stripe Price ID bound from the form
 */
export async function createCheckoutSession(priceId: string) {
  try {
    // 1. Validate the incoming Price ID
    const validated = checkoutSchema.safeParse({ priceId });
    if (!validated.success) {
      throw new Error("Invalid Price ID provided.");
    }

    // 2. Verify the user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      // Redirect to register if not authenticated, passing the desired plan
      redirect(`/register?plan=${priceId}`);
    }

    // 3. Prepare customer parameter (use stripeCustomerId if available)
    if (!stripe) {
      return { error: "Payments are currently disabled in this environment." };
    }

    const stripeCustomerId = (session.user as ExtendedUser).stripeCustomerId;
    const customerParams = stripeCustomerId 
      ? { customer: stripeCustomerId }
      : { customer_email: session.user.email };

    const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 4. Generate Stripe Checkout Session URL
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      client_reference_id: session.user.id, // CRITICAL: Allows Better Auth webhook to link the user
      metadata: {
        userId: session.user.id, // Fallback identifier mapping
      },
      ...customerParams,
      line_items: [
        {
          price: validated.data.priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
    });

    if (!checkoutSession.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    // 5. Redirect the client to the Stripe URL
    redirect(checkoutSession.url);
  } catch (error: any) {
    // If it's a redirect error, rethrow it so Next.js handles it properly
    if (error.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    
    console.error("[CHECKOUT_ACTION_ERROR]", error);
    return { 
      error: error instanceof Error ? error.message : "An error occurred while creating the checkout session." 
    };
  }
}
