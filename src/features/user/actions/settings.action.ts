"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Server Action to update a normal user's password.
 * Strictly validates the session and uses Better Auth to perform the secure change.
 */
export async function updateUserPassword(data: ChangePasswordInput) {
  try {
    const validated = changePasswordSchema.parse(data);
    
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Perform the password change via Better Auth API
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword: validated.currentPassword,
        newPassword: validated.newPassword,
        revokeOtherSessions: true,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Password updated successfully. Please log in again." };
  } catch (error: any) {
    console.error("[UPDATE_USER_PASSWORD_ERROR]", error);
    
    if (error.code === "INVALID_PASSWORD") {
      return { success: false, error: "The current password you provided is incorrect." };
    }
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    
    return { 
      success: false, 
      error: error.message || "An unexpected error occurred while updating your password." 
    };
  }
}
