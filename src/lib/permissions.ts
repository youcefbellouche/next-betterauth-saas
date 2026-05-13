import { createAccessControl } from "better-auth/plugins/access";

/**
 * Access Control Statement
 * Defines the resources and actions available in the application.
 */
const statement = {
  user: ["create", "update", "delete", "ban", "list", "impersonate"],
  session: ["list", "revoke", "delete"],
  admin: [], 
} as const;

export const ac = createAccessControl(statement);

/**
 * Role Definitions
 */

// Regular user: can't do much in the admin panel
export const user = ac.newRole({
  user: [],
});

// Standard admin: can manage users but maybe not other admins
export const admin = ac.newRole({
  user: ["create", "list", "ban", "impersonate"],
  session: ["list", "revoke"],
});

// Superadmin: full control
export const superadmin = ac.newRole({
  user: ["create", "list", "ban", "delete", "impersonate"],
  session: ["list", "revoke"],
  admin: [],
});
