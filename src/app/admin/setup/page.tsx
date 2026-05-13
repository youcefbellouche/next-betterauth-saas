import { redirect } from "next/navigation";
import { hasAdminBeenCreated } from "@/features/admin/utils/admin-status";
import { AdminSetupForm } from "@/features/admin/components/AdminSetupForm";

/**
 * /admin/setup — First-time admin onboarding.
 *
 * Guard: If an admin already exists, redirect to /admin/login
 * so nobody can register a second admin.
 */
export default async function AdminSetupPage() {
  const adminExists = await hasAdminBeenCreated();

  if (adminExists) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <AdminSetupForm />
    </div>
  );
}
