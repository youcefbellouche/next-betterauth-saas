import { redirect } from "next/navigation";
import { hasAdminBeenCreated } from "@/features/admin/utils/admin-status";
import { AdminLoginForm } from "@/features/admin/components/AdminLoginForm";

/**
 * /admin/login — Admin sign-in page.
 *
 * Guard: If no admin exists yet, redirect to /admin/setup
 * so the first admin can be created through onboarding.
 */
export default async function AdminLoginPage() {
  const adminExists = await hasAdminBeenCreated();

  if (!adminExists) {
    redirect("/admin/setup");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <AdminLoginForm />
    </div>
  );
}
