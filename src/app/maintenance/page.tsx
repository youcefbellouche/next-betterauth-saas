import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Hammer } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Hammer className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold">Under Maintenance</CardTitle>
          <CardDescription className="text-lg">
            We are currently upgrading our servers to provide a better experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground text-sm">
            Our team is working hard to bring the system back online as soon as possible. 
            Check back in a few minutes.
          </p>
          <div className="pt-4">
            <Link 
              href="/" 
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Back to Landing Page
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-xs text-muted-foreground uppercase tracking-widest font-semibold">
        Platform Security & Integrity
      </p>
    </div>
  );
}
