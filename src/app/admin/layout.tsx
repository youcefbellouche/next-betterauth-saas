import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ExtendedUser } from "@/lib/types";
import { AdminSidebar, MobileAdminSidebar } from "@/features/admin/components/AdminSidebar";
import { Skeleton } from "@/components/ui/skeleton";

async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user as ExtendedUser | undefined;

  // Proxy handles the bounce if a 'user' tries to access /admin.
  // Here we just handle the layout logic.
  if (user && user.role !== "user") {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background text-foreground">
        <AdminSidebar userName={user.name} />
        <div className="flex flex-col h-screen">
          <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-4 md:hidden lg:h-[60px] lg:px-6 shrink-0">
             <MobileAdminSidebar />
             <span className="font-bold tracking-tight">Admin Mode</span>
          </header>
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Skeleton className="h-12 w-12 rounded-full" /></div>}>
      <AdminShell>
        {children}
      </AdminShell>
    </Suspense>
  );
}
