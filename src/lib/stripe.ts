import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

if (!key) {
  console.warn("[STRIPE] STRIPE_SECRET_KEY is missing. Stripe features will be disabled.");
}

export const stripe = key 
  ? new Stripe(key, {
      apiVersion: "2026-04-22.dahlia",
      appInfo: {
        name: "SaaS Starter Kit",
        version: "0.1.0",
      },
    })
  : null;
