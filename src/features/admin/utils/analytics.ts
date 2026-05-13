import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Plan-to-price mapping (monthly USD).
 * Used to calculate MRR since the Subscription table stores plan names, not amounts.
 */
const PLAN_PRICES: Record<string, number> = {
  pro: 29,
  enterprise: 99,
};

// ─── Types ───────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  mrr: number;
  delinquentCount: number;
}

export interface DelinquentUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
}

// ─── Data Fetchers ───────────────────────────────────────────────────

/**
 * Calculates high-level admin dashboard stats:
 * - Total registered users
 * - MRR from all active subscriptions
 * - Count of delinquent accounts (past_due or unpaid)
 *
 * Cached per-request via React `cache()` to deduplicate across layout + page.
 */
export const getAdminStats = cache(async (): Promise<AdminStats> => {
  const [totalUsers, activeSubscriptions, delinquentCount] = await Promise.all([
    // Total user count
    prisma.user.count(),

    // All active subscriptions for MRR calculation
    prisma.subscription.findMany({
      where: { status: "active" },
      select: { plan: true },
    }),

    // Delinquent account count
    prisma.subscription.count({
      where: {
        status: { in: ["past_due", "unpaid"] },
      },
    }),
  ]);

  // Sum up MRR from plan prices
  const mrr = activeSubscriptions.reduce((sum, sub) => {
    return sum + (PLAN_PRICES[sub.plan] ?? 0);
  }, 0);

  return { totalUsers, mrr, delinquentCount };
});

/**
 * Fetches users with past_due subscriptions, including their name,
 * email, and the plan they failed to pay for.
 *
 * Cached per-request via React `cache()`.
 */
export const getDelinquentUsers = cache(
  async (): Promise<DelinquentUser[]> => {
    const delinquentSubs = await prisma.subscription.findMany({
      where: {
        status: "past_due",
      },
      select: {
        plan: true,
        status: true,
        referenceId: true,
      },
    });

    if (delinquentSubs.length === 0) return [];

    // Batch-fetch all referenced users in a single query
    const userIds = delinquentSubs.map((sub) => sub.referenceId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    return delinquentSubs.map((sub) => {
      const user = userMap.get(sub.referenceId);
      return {
        id: sub.referenceId,
        name: user?.name ?? "Unknown",
        email: user?.email ?? "—",
        plan: sub.plan,
        status: sub.status,
      };
    });
  }
);
