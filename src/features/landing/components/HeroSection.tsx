import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 pt-24 pb-20 text-center md:pt-32 lg:pt-40">
      <div className="mx-auto max-w-[800px] space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
          Launch your SaaS in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Minutes</span>
        </h1>
        <p className="mx-auto max-w-[600px] text-lg text-muted-foreground md:text-xl">
          The ultimate Next.js starter kit with Better Auth, Stripe Subscriptions, and a Superadmin Dashboard pre-configured.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            href="/register" 
            className={buttonVariants({ size: "lg", className: "w-full sm:w-auto h-12 px-8 text-base shadow-lg transition-transform hover:scale-105" })}
          >
            Start for free
          </Link>
          <Link 
            href="#features" 
            className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto h-12 px-8 text-base bg-white dark:bg-transparent transition-transform hover:scale-105" })}
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
