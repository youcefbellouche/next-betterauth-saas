"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

/**
 * ImpersonationBanner
 * 
 * This component is rendered at the top of the dashboard when a superadmin 
 * is impersonating another user. It provides clear visual feedback and 
 * an easy way to return to the admin account.
 */
export function ImpersonationBanner() {
  const router = useRouter();
  const [isStopping, setIsStopping] = useState(false);

  const handleStopImpersonation = async () => {
    setIsStopping(true);
    try {
      const { error } = await authClient.admin.stopImpersonating();
      
      if (error) {
        toast.error(error.message || "Failed to stop impersonation");
        setIsStopping(false);
        return;
      }

      toast.success("Returned to admin account");
      // Explicitly redirect to admin users page
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      console.error("Stop impersonation error:", err);
      toast.error("An unexpected error occurred");
      setIsStopping(false);
    }
  };

  return (
    <div className="sticky top-0 z-[100] w-full bg-primary px-4 py-2 text-primary-foreground shadow-lg animate-in slide-in-from-top duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldAlert className="h-4 w-4" />
          <span>You are currently impersonating this user.</span>
          <span className="hidden md:inline opacity-90"> Actions you take will be attributed to them.</span>
        </div>
        
        <Button
          onClick={handleStopImpersonation}
          disabled={isStopping}
          variant="secondary"
          size="sm"
          className="h-8 font-bold border-none"
        >
          {isStopping ? (
            <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          Stop Impersonating
        </Button>
      </div>
    </div>
  );
}
