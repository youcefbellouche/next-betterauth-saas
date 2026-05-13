"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setupAdminAction } from "@/features/admin/actions/setup-admin.action";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export function AdminSetupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showSetupKey, setShowSetupKey] = useState(false);

  const [state, formAction, isPending] = useActionState(setupAdminAction, {
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      const timeout = setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [state.success, router]);

  return (
    <Card className="w-full max-w-md border-border shadow-2xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 shadow-lg ring-1 ring-primary/20">
          <Shield className="h-7 w-7 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Initialize Superadmin
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Create the first administrator account. This can only be done once.
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-4">
          {/* Success message */}
          {state.success && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Admin created! Redirecting to login...
            </div>
          )}

          {/* Error message */}
          {state.error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive ring-1 ring-destructive/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Jane Doe"
              required
              disabled={isPending || state.success}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@yourapp.com"
              required
              disabled={isPending || state.success}
              className="border-border bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                disabled={isPending || state.success}
                className="border-border bg-background pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="setupKey">
              Admin Setup Key
            </Label>
            <div className="relative">
              <Input
                id="setupKey"
                name="setupKey"
                type={showSetupKey ? "text" : "password"}
                placeholder="From your ADMIN_SETUP_SECRET env"
                required
                disabled={isPending || state.success}
                className="border-border bg-background pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSetupKey(!showSetupKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showSetupKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              This must match the <code className="rounded bg-muted px-1 py-0.5 font-mono">ADMIN_SETUP_SECRET</code> in your .env file.
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={isPending || state.success}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating admin...
              </>
            ) : state.success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Admin Created
              </>
            ) : (
              "Create Superadmin Account"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
