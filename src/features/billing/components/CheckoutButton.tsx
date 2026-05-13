"use client";

import { usePostHog } from "posthog-js/react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { createCheckoutSession } from "@/features/billing/actions/checkout.action";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CheckoutButtonProps {
  priceId: string;
  planName: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
}

export function CheckoutButton({ 
  priceId, 
  planName, 
  children, 
  variant = "default",
  className 
}: CheckoutButtonProps) {
  const posthog = usePostHog();
  const [isPending, startTransition] = useTransition();

  const handleCheckout = async () => {
    // 1. Track the initiation
    posthog.capture("checkout_initiated", {
      plan: planName,
      price_id: priceId,
    });

    // 2. Trigger the server action
    startTransition(async () => {
      try {
        const result = await createCheckoutSession(priceId);
        
        // The action might redirect on the server, but if it returns an error:
        if (result && "error" in result) {
          toast.error(result.error as string);
        }
      } catch (error) {
        console.error("Checkout error:", error);
        toast.error("An unexpected error occurred during checkout.");
      }
    });
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={isPending}
      variant={variant}
      className={className}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Preparing...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
