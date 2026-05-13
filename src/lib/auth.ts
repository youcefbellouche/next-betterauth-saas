import { betterAuth, type User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins";
import { ac, admin as adminRole, user as userRole, superadmin } from "./permissions";
import { stripe } from "@better-auth/stripe";
import { stripe as stripeClient } from "./stripe";
import { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail } from "./mail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendVerificationEmail: async ({ user, url }: { user: User, url: string }) => {
      await sendVerificationEmail({
        to: user.email,
        url,
        user: { name: user.name },
      });
    },
    sendResetPassword: async ({ user, url }: { user: User, url: string }) => {
      await sendPasswordResetEmail({
        to: user.email,
        url,
        user: { name: user.name },
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Fire-and-forget: send welcome email on signup
          sendWelcomeEmail({
            to: user.email,
            name: user.name,
          }).catch((err) =>
            console.error("[AUTH] Failed to send welcome email:", err)
          );
        },
      },
    },
  },
  plugins: [
    admin({
      ac,
      roles: {
        user: userRole,
        admin: adminRole,
        superadmin: superadmin,
      },
      impersonation: {
        enabled: true,
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "pro",
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID as string,
          },
          {
            name: "enterprise",
            priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID as string,
          }
        ]
      }
    })
  ]
});
