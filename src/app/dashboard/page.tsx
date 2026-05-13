import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutButton } from "@/features/billing/components/CheckoutButton";
import { prisma } from "@/lib/prisma";
import { CreditCard, CheckCircle2, Zap } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  // Fetch the user's active subscription natively on the server
  const subscription = await prisma.subscription.findFirst({
    where: { 
      referenceId: session.user.id,
      status: "active",
    }
  });

  const proPriceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!;
  const isFreeTier = !subscription;

  // Determine plan name from the Better Auth plugin's `plan` field
  let planName = "Hobby (Free)";
  if (subscription) {
    if (subscription.plan === "pro") {
      planName = "Pro Plan";
    } else if (subscription.plan === "enterprise") {
      planName = "Enterprise Plan";
    } else {
      planName = "Paid Subscription";
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here is an overview of your account and subscription status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Subscription Status Card */}
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Plan
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planName}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isFreeTier 
                ? "You are currently on the free tier." 
                : "Your subscription is active and in good standing."}
            </p>
            
            {!isFreeTier && (
              <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 w-fit px-2 py-1 rounded-md">
                <CheckCircle2 className="h-4 w-4" />
                Active
              </div>
            )}
          </CardContent>
          {isFreeTier && (
            <CardFooter>
              <CheckoutButton 
                priceId={proPriceId} 
                planName="Pro" 
                className="w-full flex gap-2"
              >
                <Zap className="h-4 w-4" />
                Upgrade to Pro
              </CheckoutButton>
            </CardFooter>
          )}
        </Card>

        {/* Placeholder cards for future metrics */}
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Good</div>
            <p className="text-xs text-muted-foreground mt-1">
              No recent alerts or issues.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
