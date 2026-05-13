"use client";

import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Ban, 
  UserCheck, 
  Loader2, 
  Mail, 
  Copy,
  Trash2
} from "lucide-react";
import { 
  adminBanUserAction, 
  adminDeleteUserAction,
  adminSendPasswordResetAction 
} from "@/features/admin/actions/user-management.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Ghost } from "lucide-react";

interface UserActionsProps {
  userId: string;
  userEmail: string;
  isBanned: boolean;
}

export function UserActions({ userId, userEmail, isBanned }: UserActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleImpersonate = () => {
    startTransition(async () => {
      try {
        const { error } = await authClient.admin.impersonateUser({
          userId,
        });

        if (error) {
          toast.error(error.message || "Failed to impersonate user");
          return;
        }

        toast.success(`Now impersonating ${userEmail}`);
        // The plugin usually handles the cookie swap, but we redirect to be sure
        router.push("/dashboard");
        router.refresh();
      } catch (err) {
        console.error("Impersonation error:", err);
        toast.error("An unexpected error occurred during impersonation");
      }
    });
  };

  const handleBanToggle = () => {
    startTransition(async () => {
      const result = await adminBanUserAction({
        userId,
        banReason: isBanned ? undefined : "Violated terms of service",
      });

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      startTransition(async () => {
        const result = await adminDeleteUserAction({ userId });
        if (result.success) {
          toast.success(result.message);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      });
    }
  };

  const handleSendReset = () => {
    startTransition(async () => {
      const result = await adminSendPasswordResetAction({ email: userEmail });
      if (result.success) {
        toast.success(result.message || "Password reset email sent.");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={handleImpersonate}
            className="cursor-pointer font-medium text-emerald-600 dark:text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400"
          >
            <Ghost className="mr-2 h-4 w-4" />
            <span>Impersonate User</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(userId);
              toast.success("User ID copied to clipboard");
            }}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Copy User ID</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSendReset}
            className="cursor-pointer"
          >
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Send Reset Email</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Account Status</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={handleBanToggle}
            className={`cursor-pointer font-medium ${isBanned ? "text-emerald-600 dark:text-emerald-400 focus:text-emerald-600" : "text-amber-600 focus:text-amber-600"}`}
          >
            {isBanned ? (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                <span>Lift Ban</span>
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" />
                <span>Ban User</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete User</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
