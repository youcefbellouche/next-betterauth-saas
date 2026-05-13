"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function joinWaitlistAction(email: string) {
  try {
    const validated = waitlistSchema.parse({ email });
    
    await prisma.waitlist.upsert({
      where: { email: validated.email },
      update: {}, 
      create: { 
        email: validated.email 
      },
    });
    
    return { success: true, message: "You've been added to our waitlist!" };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to join waitlist. Please try again." };
  }
}
