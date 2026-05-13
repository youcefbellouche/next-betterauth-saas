"use client";

import { useState, useTransition } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { joinWaitlistAction } from "../actions/waitlist.action";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    startTransition(async () => {
      const result = await joinWaitlistAction(email);
      
      if (result.success) {
        toast.success(result.message);
        setEmail("");
        
        // Use router for a smoother transition
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        toast.error(result.error || "Failed to join waitlist");
      }
    });
  };

  return (
    <Card className="border-border shadow-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">We're currently at capacity</CardTitle>
        <CardDescription>
          Join the waitlist to get early access and be the first to know when we open new spots.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : "Join Waitlist"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
