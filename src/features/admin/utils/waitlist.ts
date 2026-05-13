import { prisma } from "@/lib/prisma";

/**
 * Fetch all waitlist entries
 * Ordered by most recent first
 */
export async function getWaitlistEntries() {
  try {
    const entries = await prisma.waitlist.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return entries;
  } catch (error) {
    console.error("Failed to fetch waitlist entries:", error);
    return [];
  }
}

/**
 * Get total number of waitlist entries
 */
export async function getWaitlistStats() {
  try {
    const totalCount = await prisma.waitlist.count();
    return {
      totalCount,
    };
  } catch (error) {
    console.error("Failed to fetch waitlist stats:", error);
    return {
      totalCount: 0,
    };
  }
}
