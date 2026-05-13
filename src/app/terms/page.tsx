import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TermsPage() {
  const lastUpdated = "May 13, 2026";

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-12 md:py-24">
        <Link 
          href="/" 
          className={cn(buttonVariants({ variant: "ghost" }), "mb-8 -ml-4 flex items-center gap-2")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
          </header>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              By accessing or using SaaSStarter, you agree to be bound by these Terms of Service. 
              If you disagree with any part of the terms, then you may not access the service. 
              These terms apply to all visitors, users, and others who access or use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
              Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your 
              account on our service.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              You are responsible for safeguarding the password that you use to access the service and for any 
              activities or actions under your password.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Subscription & Payments</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Some parts of the service are billed on a subscription basis. You will be billed in advance on a 
              recurring and periodic basis. Billing cycles are set on a monthly or annual basis, depending on 
              the type of subscription plan you select when purchasing a subscription.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              All payments are processed securely through Stripe. By subscribing, you authorize us to charge 
              the applicable fees to your provided payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Termination</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We may terminate or suspend access to our service immediately, without prior notice or liability, 
              for any reason whatsoever, including without limitation if you breach the Terms. 
              Upon termination, your right to use the service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              In no event shall SaaSStarter, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential or punitive damages, including 
              without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting 
              from your access to or use of or inability to access or use the service.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
