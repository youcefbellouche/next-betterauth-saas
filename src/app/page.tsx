import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { FeaturesGrid } from "@/features/landing/components/FeaturesGrid";
import { PricingSection } from "@/features/landing/components/PricingSection";
import { Suspense } from "react";
import { NavbarWithSession } from "@/components/layout/NavbarWithSession";
import { Skeleton } from "@/components/ui/skeleton";

function NavbarSkeleton() {
  return (
    <div className="h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}

export default async function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Suspense fallback={<NavbarSkeleton />}>
        <NavbarWithSession />
      </Suspense>
      <main className="flex-1">
        <HeroSection />
        <FeaturesGrid />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
