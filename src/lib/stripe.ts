import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia", // Use the latest API version or your preferred one
  appInfo: {
    name: "SaaS Starter Kit",
    version: "0.1.0",
  },
});
