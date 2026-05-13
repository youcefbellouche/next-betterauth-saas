import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  priceId: string;
  isPopular?: boolean;
}

interface PricingProps {
  currentPlanId?: string;
  showCurrentPlanBadge?: boolean;
}

export function Pricing({ currentPlanId = "free", showCurrentPlanBadge = false }: PricingProps) {
  const plans: Plan[] = [
    {
      id: "free",
      name: "Hobby",
      price: "$0",
      description: "Perfect for side projects.",
      features: ["Up to 1,000 users", "Community support", "Basic analytics"],
      priceId: "",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      description: "For growing businesses.",
      features: ["Unlimited users", "Priority email support", "Advanced analytics", "Custom domain"],
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
      isPopular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      description: "For large scale operations.",
      features: ["Everything in Pro", "24/7 phone support", "Dedicated success manager", "SLA guarantees"],
      priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID!,
    },
  ];

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={`relative flex flex-col overflow-visible ${
            plan.id === currentPlanId 
              ? "border-primary shadow-md" 
              : "border-border"
          }`}
        >
          {plan.isPopular && (
            <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm">
              Most Popular
            </div>
          )}
          {showCurrentPlanBadge && plan.id === currentPlanId && (
            <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground border border-border">
              Current Plan
            </div>
          )}
          
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="text-3xl font-bold mt-4">
              {plan.price}<span className="text-lg text-muted-foreground font-medium">/mo</span>
            </div>
          </CardHeader>

          <CardContent className="flex-1">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            {plan.id === currentPlanId ? (
              <button disabled className="w-full rounded-md border border-border bg-muted/50 py-2 text-sm font-medium text-muted-foreground">
                Current Plan
              </button>
            ) : plan.priceId ? (
              <CheckoutButton 
                priceId={plan.priceId} 
                planName={plan.id}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Upgrade to {plan.name}
              </CheckoutButton>
            ) : (
              <button className="w-full rounded-md border border-border py-2 text-sm font-medium hover:bg-accent transition-colors">
                Get Started
              </button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
