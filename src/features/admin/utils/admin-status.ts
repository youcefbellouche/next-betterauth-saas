import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Checks whether at least one admin or superadmin user exists in the database.
 * Cached per request via React `cache()` to avoid redundant DB hits
 * when called multiple times in the same render pass (e.g. layout + page).
 */
export const hasAdminBeenCreated = cache(async (): Promise<boolean> => {
  const admin = await prisma.user.findFirst({
    where: {
      role: { in: ["admin", "superadmin"] },
    },
    select: { id: true },
  });

  return admin !== null;
});
