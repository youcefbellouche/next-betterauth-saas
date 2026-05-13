"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateSecuritySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters").optional().or(z.literal("")),
});

export type UpdateSecurityInput = z.infer<typeof updateSecuritySchema>;

/**
 * Update Admin Security Settings
 * 
 * - Validates session and superadmin role.
 * - Updates display name.
 * - Changes password if provided.
 */
export async function updateAdminSecurityAction(data: UpdateSecurityInput) {
  try {
    // 1. Validate Input
    const validated = updateSecuritySchema.parse(data);

    // 2. Validate Session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const user = session.user as { role?: string; id: string };

    // 3. RBAC: Ensure is superadmin
    if (user.role !== "superadmin") {
      return { success: false, error: "Only superadmins can update these settings." };
    }

    // 4. Update Name (if changed)
    if (validated.name && validated.name !== session.user.name) {
      await auth.api.updateUser({
        headers: await headers(),
        body: {
          name: validated.name,
        },
      });
    }

    // 5. Update Password (if provided)
    if (validated.newPassword) {
      const result = await auth.api.changePassword({
        headers: await headers(),
        body: {
          currentPassword: validated.currentPassword,
          newPassword: validated.newPassword,
          revokeOtherSessions: true,
        },
      });

      if (!result) {
         // Better Auth API usually returns the updated session/user on success
         // or throws/returns error object. If result is null/undefined but didn't throw, 
         // we might need to check how it behaves.
      }
    }

    revalidatePath("/admin/settings");
    return { success: true, message: "Security settings updated successfully." };

  } catch (error: any) {
    console.error("Update security error:", error);
    
    // Handle Better Auth specific errors
    if (error.code === "INVALID_PASSWORD") {
      return { success: false, error: "The current password you provided is incorrect." };
    }

    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    return { 
      success: false, 
      error: error.message || "An unexpected error occurred while updating security settings." 
    };
  }
}

/**
 * Get Global System Preferences
 */
export async function getSystemPreferences() {
  try {
    const prefs = await prisma.systemPreference.upsert({
      where: { id: "global" },
      update: {}, // No changes if it exists
      create: {
        id: "global",
        maintenanceMode: false,
        disableRegistrations: false,
        waitlistMode: false,
      },
    });

    return prefs;
  } catch (error) {
    console.error("DEBUG: Get system preferences error:", error);
    // Return a default object instead of throwing to prevent 500s on public pages
    return {
      id: "global",
      maintenanceMode: false,
      disableRegistrations: false,
      waitlistMode: false,
    };
  }
}

/**
 * Toggle a Specific System Preference
 */
export async function toggleSystemPreference(key: string, value: boolean) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user as any).role !== "superadmin") {
      return { success: false, error: "Unauthorized" };
    }

    // Validate the key is one of our allowed boolean fields
    const allowedKeys = ["maintenanceMode", "disableRegistrations", "waitlistMode"];
    if (!allowedKeys.includes(key)) {
      return { success: false, error: "Invalid preference key." };
    }

    await prisma.systemPreference.update({
      where: { id: "global" },
      data: {
        [key]: value,
      },
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Toggle preference error:", error);
    return { success: false, error: "Failed to update preference." };
  }
}
