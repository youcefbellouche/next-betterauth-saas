import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CreditCard, LayoutDashboard } from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      title: "Authentication",
      description: "Secure login, registration, and session management via Better Auth.",
      icon: Shield,
    },
    {
      title: "Stripe Billing",
      description: "Pre-built webhooks, checkout sessions, and customer portals.",
      icon: CreditCard,
    },
    {
      title: "Superadmin Panel",
      description: "Manage users, subscriptions, and site settings natively.",
      icon: LayoutDashboard,
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Everything you need</h2>
        <p className="mt-4 text-lg text-muted-foreground">We've handled the boilerplate so you can focus on your product.</p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="border-border bg-card/50 backdrop-blur-sm transition-all hover:shadow-md">
            <CardHeader>
              <feature.icon className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
