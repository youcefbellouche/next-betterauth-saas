import { Pricing } from "@/features/billing/components/Pricing";

export function PricingSection() {
  return (
    <section id="pricing" className="bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground">Choose the perfect plan for your business needs.</p>
        </div>

        <Pricing />
      </div>
    </section>
  );
}
