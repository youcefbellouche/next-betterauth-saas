"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

type ActionResponse<T> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string };

export async function updateProfileAction(
  payload: UpdateProfileInput
): Promise<ActionResponse<{ message: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedFields = updateProfileSchema.safeParse(payload);

    if (!validatedFields.success) {
      return { 
        success: false, 
        error: validatedFields.error.issues[0].message 
      };
    }

    const { name, email } = validatedFields.data;

    // Optional: check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      if (existingUser) {
        return { success: false, error: "Email is already in use by another account." };
      }
    }

    // Update via Prisma
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
      }
    });

    return { success: true, data: { message: "Profile updated successfully." } };
  } catch (error) {
    console.error("[UPDATE_PROFILE_ERROR]", error);
    return { success: false, error: "An unexpected error occurred while updating the profile." };
  }
}
