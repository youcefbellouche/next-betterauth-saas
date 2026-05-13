import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";
import { ac, admin, user, superadmin } from "./permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        user,
        superadmin,
      },
      impersonation: {
        enabled: true,
      },
    }),
    stripeClient(),
  ],
});

export const { 
  signIn, 
  signUp, 
  useSession, 
  signOut,
  getSession
} = authClient;
