"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, Settings, ShieldAlert, Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  userRole?: string;
}

export function SidebarLinks({ userRole, onClick }: { userRole?: string; onClick?: () => void }) {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  if (userRole === "admin" || userRole === "superadmin") {
    links.push({ name: "Admin Panel", href: "/admin", icon: ShieldAlert });
  }

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
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-800 ${
              isActive 
                ? "bg-slate-100 font-semibold text-slate-900 dark:bg-slate-800 dark:text-white" 
                : "text-slate-500 dark:text-slate-400"
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

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="w-full justify-start gap-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <LogOut className="h-4 w-4" />
      Log out
    </Button>
  );
}

export function DashboardSidebar({ userRole }: SidebarProps) {
  return (
    <div className="hidden border-r bg-slate-50/40 md:block dark:bg-slate-900/40 h-full">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
            <span>SaaS Starter</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4 px-4">
          <SidebarLinks userRole={userRole} />
        </div>
        <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar({ userRole }: SidebarProps) {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden flex items-center justify-center h-10 w-10 border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetTitle className="mb-4 text-xl font-bold tracking-tight mt-6">Navigation</SheetTitle>
        <div className="flex-1 overflow-auto">
          <SidebarLinks userRole={userRole} />
        </div>
        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
          <LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}
