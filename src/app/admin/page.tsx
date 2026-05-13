import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasAdminBeenCreated } from "@/features/admin/utils/admin-status";
import { getAdminStats, getDelinquentUsers } from "@/features/admin/utils/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Users, DollarSign, AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * Currency Formatter
 */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default async function AdminRootPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Authorization Check
  if (session?.user) {
    const role = (session.user as { role?: string }).role;
    if (role === "admin" || role === "superadmin") {
      
      // Fetch Dashboard Data
      const [stats, delinquentUsers] = await Promise.all([
        getAdminStats(),
        getDelinquentUsers(),
      ]);

      return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Dashboard Overview
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Welcome back, {session.user.name}. Here's an overview of your platform's health.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                System: Operational
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="relative overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Total Users
                  </CardTitle>
                  <div className="rounded-md bg-primary/10 p-2">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight text-foreground">
                    {stats.totalUsers.toLocaleString()}
                  </div>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <span className="font-medium text-emerald-600">+12%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Monthly Revenue
                  </CardTitle>
                  <div className="rounded-md bg-emerald-500/10 p-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight text-foreground">
                    {formatCurrency(stats.mrr)}
                  </div>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <span className="font-medium text-emerald-600">+8%</span>
                    <span className="ml-1">projected growth</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Churn Risk
                  </CardTitle>
                  <div className="rounded-md bg-amber-500/10 p-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tight text-foreground">
                    {stats.delinquentCount}
                  </div>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <span className="font-medium text-amber-600">Action Required</span>
                    <span className="ml-1">overdue invoices</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Required Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="h-4 w-1 rounded-full bg-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Attention Required: Delinquent Accounts
                </h2>
              </div>
              
              <Card className="border-border shadow-sm">
                <CardContent className="p-0">
                  {delinquentUsers.length > 0 ? (
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="py-4 pl-6">User Email</TableHead>
                          <TableHead>Subscription Plan</TableHead>
                          <TableHead>Current Status</TableHead>
                          <TableHead className="pr-6 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {delinquentUsers.map((user) => (
                          <TableRow key={user.id} className="group transition-colors hover:bg-muted/50">
                            <TableCell className="py-4 pl-6 font-medium text-foreground">
                              {user.email}
                            </TableCell>
                            <TableCell className="capitalize text-muted-foreground">
                              <Badge variant="outline" className="font-medium">
                                {user.plan}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className="bg-amber-500/10 text-amber-600 ring-1 ring-inset ring-amber-600/20"
                              >
                                {user.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="pr-6 text-right">
                              <Link 
                                href={`/admin/users/${user.id}`}
                                className={cn(
                                  buttonVariants({ variant: "ghost", size: "sm" }),
                                  "opacity-0 group-hover:opacity-100 transition-opacity"
                                )}
                              >
                                View Details
                                <ExternalLink className="ml-2 h-3.5 w-3.5" />
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex h-[260px] flex-col items-center justify-center gap-3 p-8 text-center">
                      <div className="rounded-full bg-emerald-500/10 p-3">
                        <Users className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          No Delinquent Accounts
                        </p>
                        <p className="max-w-[300px] text-sm text-muted-foreground">
                          Great job! All customer accounts are currently in good standing.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }
  }

  // No session — check if onboarding is needed
  const adminExists = await hasAdminBeenCreated();

  if (!adminExists) {
    redirect("/admin/setup");
  }

  redirect("/admin/login");
}
