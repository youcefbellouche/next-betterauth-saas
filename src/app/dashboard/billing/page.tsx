import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserInvoices, createBillingPortalSession } from "@/features/billing/actions/billing.action";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pricing } from "@/features/billing/components/Pricing";

export default async function BillingPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch active subscription natively
  const subscription = await prisma.subscription.findFirst({
    where: { 
      referenceId: session.user.id,
      status: "active",
    }
  });

  // Fetch invoices using our server action
  const invoicesRes = await getUserInvoices();
  const invoices = invoicesRes.success ? invoicesRes.data : [];
  
  const currentPlanId = subscription?.plan || "free";

  // Helper form action to handle the billing portal redirect natively
  async function handlePortalRedirect() {
    "use server";
    const res = await createBillingPortalSession();
    if (res.success && res.data.url) {
      redirect(res.data.url);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Subscriptions</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription plan, payment methods, and billing history.
          </p>
        </div>
        <form action={handlePortalRedirect}>
          <Button type="submit" variant="outline" className="w-full md:w-auto gap-2">
            <ExternalLink className="h-4 w-4" />
            Manage Payment Methods
          </Button>
        </form>
      </div>

      <div className="pt-4">
        <Pricing currentPlanId={currentPlanId} showCurrentPlanBadge />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Payment History</h2>
        <Card className="shadow-sm border-border overflow-hidden">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-card">
              <CreditCard className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No payment history found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-1">
                You haven't made any payments yet. Once you subscribe to a paid plan, your invoices will securely appear here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-foreground">
                      {new Date(invoice.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      ${(invoice.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0">
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.url ? (
                        <a 
                          href={invoice.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View Invoice
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unavailable</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
