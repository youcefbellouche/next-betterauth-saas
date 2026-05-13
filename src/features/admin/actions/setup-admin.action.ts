"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { hasAdminBeenCreated } from "@/features/admin/utils/admin-status";

const setupAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  setupKey: z.string().min(1, "Setup key is required"),
});

interface SetupAdminResult {
  success: boolean;
  error?: string;
}

export async function setupAdminAction(
  _prevState: SetupAdminResult,
  formData: FormData
): Promise<SetupAdminResult> {
  // Guard: prevent creating a second admin
  const adminExists = await hasAdminBeenCreated();
  if (adminExists) {
    return { success: false, error: "An admin account already exists." };
  }

  // Validate input
  const parsed = setupAdminSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    setupKey: formData.get("setupKey"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "Invalid input";
    return { success: false, error: firstError };
  }

  const { name, email, password, setupKey } = parsed.data;

  // Verify the setup key against the environment secret
  const expectedKey = process.env.ADMIN_SETUP_SECRET;
  if (!expectedKey || setupKey !== expectedKey) {
    return { success: false, error: "Invalid setup key. Check your ADMIN_SETUP_SECRET." };
  }

  try {
    // Create the user via Better Auth's admin API
    await auth.api.createUser({
      body: {
        name,
        email,
        password,
        role: "superadmin",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("[ADMIN SETUP] Failed to create admin user:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
