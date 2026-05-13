"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Standardized response type for admin actions.
 */
export type AdminActionResponse<T = unknown> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

/**
 * Authorization Guard: Verifies the current session belongs to a 'superadmin'.
 * Throws an error if not authorized.
 */
async function ensureSuperadmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "superadmin") {
    throw new Error("Unauthorized: Superadmin access required.");
  }

  return session;
}

// ─── Admin Create User ───────────────────────────────────────────────

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin", "superadmin"]).default("user"),
});

export async function adminCreateUserAction(
  data: z.infer<typeof createUserSchema>
): Promise<AdminActionResponse> {
  try {
    await ensureSuperadmin();

    const validated = createUserSchema.parse(data);

    await auth.api.createUser({
      body: {
        ...validated,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, message: "User created successfully." };
  } catch (error) {
    console.error("[ADMIN_CREATE_USER]", error);
    const message = error instanceof Error ? error.message : "Failed to create user.";
    return { success: false, error: message };
  }
}

// ─── Admin Ban User ──────────────────────────────────────────────────

const banUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  banReason: z.string().optional(),
  banExpiresIn: z.number().optional(), // In seconds
});

export async function adminBanUserAction(
  data: z.infer<typeof banUserSchema>
): Promise<AdminActionResponse> {
  try {
    await ensureSuperadmin();

    const { userId, banReason, banExpiresIn } = banUserSchema.parse(data);

    await auth.api.banUser({
      body: {
        userId,
        banReason,
        banExpiresIn,
      },
      headers: await headers(),
    });

    revalidatePath("/admin/users");
    return { success: true, message: "User has been banned." };
  } catch (error) {
    console.error("[ADMIN_BAN_USER]", error);
    const message = error instanceof Error ? error.message : "Failed to ban user.";
    return { success: false, error: message };
  }
}

// ─── Admin Send Password Reset ──────────────────────────────────────

const passwordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/**
 * Triggers a password reset email for a user.
 */
export async function adminSendPasswordResetAction(
  data: z.infer<typeof passwordResetSchema>
): Promise<AdminActionResponse> {
  try {
    await ensureSuperadmin();

    const { email } = passwordResetSchema.parse(data);

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${process.env.BETTER_AUTH_URL}/reset-password`,
      },
    });

    return { success: true, message: "Password reset email sent." };
  } catch (error) {
    console.error("[ADMIN_PASSWORD_RESET]", error);
    const message = error instanceof Error ? error.message : "Failed to send reset email.";
    return { success: false, error: message };
  }
}
// ─── Admin Delete User ───────────────────────────────────────────────

const deleteUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export async function adminDeleteUserAction(
  data: z.infer<typeof deleteUserSchema>
): Promise<AdminActionResponse> {
  try {
    await ensureSuperadmin();

    const { userId } = deleteUserSchema.parse(data);

    await auth.api.removeUser({
      body: {
        userId,
      },
      headers: await headers(),
    });

    revalidatePath("/admin/users");
    return { success: true, message: "User has been deleted." };
  } catch (error) {
    console.error("[ADMIN_DELETE_USER]", error);
    const message = error instanceof Error ? error.message : "Failed to delete user.";
    return { success: false, error: message };
  }
}
