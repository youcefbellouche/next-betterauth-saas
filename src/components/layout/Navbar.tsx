import Link from "next/link";
import { Zap } from "lucide-react";
import { AuthButtons } from "@/components/layout/AuthButtons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface NavbarProps {
  session: any;
}

export function Navbar({ session }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Zap className="h-6 w-6 text-primary" />
          <span>SaaS<span className="text-primary">Starter</span></span>
        </div>
        <nav className="hidden gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-2">
          <AuthButtons session={session} />
          <div className="hidden border-l border-border pl-2 md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
