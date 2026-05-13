import { Session, User } from "better-auth";

/**
 * Extended User type with Stripe and Role fields.
 */
export interface ExtendedUser extends User {
  role?: "user" | "admin" | "superadmin";
  stripeCustomerId?: string;
  banned?: boolean;
  banReason?: string | null;
}

/**
 * Extended Session type that includes our custom User properties.
 */
export interface ExtendedSession extends Session {
  user: ExtendedUser;
}

/**
 * Standardized Action Response for consistency across the app.
 */
export type ActionResponse<T = unknown> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string; details?: Record<string, string[] | undefined> };
