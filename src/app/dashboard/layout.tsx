import { Suspense } from "react";
import { DashboardSidebar, MobileSidebar } from "@/features/dashboard/components/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ExtendedUser } from "@/lib/types";
import { ImpersonationBanner } from "@/features/admin/components/ImpersonationBanner";
import { getSystemPreferences } from "@/features/admin/actions/settings.action";

async function DashboardShell({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Proxy handles the primary redirect, but we can still handle it here if needed
  if (!session || !session.user) return null;

  const isImpersonating = !!session.session.impersonatedBy;
  const role = (session.user as ExtendedUser).role || "user";
  const prefs = await getSystemPreferences();

  return (
    <>
      {isImpersonating && <ImpersonationBanner />}
      
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <DashboardSidebar userRole={role} />
        
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-slate-50/40 px-4 md:hidden lg:h-[60px] lg:px-6 dark:bg-slate-900/40">
             <MobileSidebar userRole={role} />
             <span className="font-semibold tracking-tight">Dashboard</span>
          </header>

          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-slate-50 dark:bg-slate-950">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><Skeleton className="h-12 w-12 rounded-full" /></div>}>
      <DashboardShell>
        {children}
      </DashboardShell>
    </Suspense>
  );
}
