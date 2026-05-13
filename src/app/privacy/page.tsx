import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
          </header>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Welcome to SaaSStarter. We value your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website 
              and use our services. By using our platform, you agree to the collection and use of information in 
              accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We collect several different types of information for various purposes to provide and improve our service to you. 
              This may include personal data such as your email address, name, and usage data collected automatically 
              when you interact with our platform.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              When you subscribe to a plan, we also collect billing information through our payment processor, Stripe. 
              We do not store your credit card details on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              SaaSStarter uses the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The security of your data is important to us, but remember that no method of transmission over the Internet, 
              or method of electronic storage is 100% secure. While we strive to use commercially acceptable means 
              to protect your personal data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Email: support@saasstarter.example.com
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
