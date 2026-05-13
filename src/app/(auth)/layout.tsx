import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-white dark:from-blue-900/20 dark:via-slate-950 dark:to-slate-950 -z-10" />
      <div className="w-full max-w-md">
        <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
