"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  Users, 
  Settings, 
  LayoutDashboard, 
  ChevronLeft,
  Menu,
  ClipboardList
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  userName?: string;
}

export function AdminSidebarLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/admin", icon: ShieldCheck },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Waitlist", href: "/admin/waitlist", icon: ClipboardList },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <nav className="space-y-2">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
              isActive 
                ? "bg-primary text-primary-foreground font-bold shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <Icon className="h-4 w-4" />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar({ userName }: AdminSidebarProps) {
  return (
    <div className="hidden border-r border-border bg-background text-foreground md:block h-full">
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Logo Section */}
        <div className="flex h-14 items-center border-b border-border px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-bold tracking-tight">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <ShieldCheck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg">Admin Mode</span>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-auto py-6 px-4">
          <div className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Administration
          </div>
          <AdminSidebarLinks />
        </div>

        {/* Footer Section */}
        <div className="mt-auto p-4 border-t border-border">
          <div className="mb-4 px-3 py-2 rounded-lg bg-accent/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Authenticated as</p>
            <p className="text-sm font-medium truncate">{userName || "Admin User"}</p>
          </div>
          <Link 
            href="/dashboard" 
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start gap-2"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Return to App
          </Link>
        </div>
      </div>
    </div>
  );
}

export function MobileAdminSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden flex items-center justify-center h-10 w-10 border border-border rounded-md bg-background text-foreground hover:bg-accent">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col bg-background text-foreground border-border p-0">
        <div className="flex h-14 items-center border-b border-border px-6">
          <SheetTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Admin Mode
          </SheetTitle>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <AdminSidebarLinks />
        </div>
        <div className="p-6 border-t border-border">
          <Link 
            href="/dashboard" 
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start gap-2"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Return to App
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
