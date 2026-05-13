"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
// Make sure you have exported your better-auth instance from here
import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";

// 1. Zod schema for input validation
const banUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  banned: z.boolean(),
  banReason: z.string().optional(),
});

export type BanUserInput = z.infer<typeof banUserSchema>;

// Define standard response types
export type ActionResponse<T = undefined> = 
  | { success: true; data?: T; message?: string }
  | { success: false; error: string; details?: Record<string, string[] | undefined> };

/**
 * Server Action to ban or unban a user.
 * Protected by Better Auth superadmin check.
 */
export async function banUserAction(
  input: BanUserInput
): Promise<ActionResponse> {
  try {
    // 1. Validate the input payload
    const validatedData = banUserSchema.safeParse(input);
    if (!validatedData.success) {
      return { 
        success: false, 
        error: "Invalid input", 
        details: validatedData.error.flatten().fieldErrors 
      };
    }

    const { userId, banned, banReason } = validatedData.data;

    // 2. Verify session and Superadmin role
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Checking if the user has the 'admin' or 'superadmin' role
    // The exact role string depends on your superadmin plugin configuration.
    if (session.user.role !== "admin" && session.user.role !== "superadmin") {
      return { success: false, error: "Forbidden: Superadmin access required" };
    }

    // 3. Update the user's ban status in Prisma
    await prisma.user.update({
      where: { id: userId },
      data: {
        banned,
        banReason: banned ? banReason || "No reason provided" : null,
      },
    });

    // 4. Return success
    return {
      success: true,
      message: `User successfully ${banned ? "banned" : "unbanned"}.`,
    };

  } catch (error) {
    console.error("[BAN_USER_ACTION] Error:", error);
    const message = error instanceof Error ? error.message : "An internal server error occurred while updating the user.";
    return { 
      success: false, 
      error: message
    };
  }
}
