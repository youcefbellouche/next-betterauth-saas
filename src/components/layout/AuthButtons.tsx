"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";

interface AuthButtonsProps {
  session: any;
}

export function AuthButtons({ session }: AuthButtonsProps) {
  if (session?.user) {
    return <UserMenu />;
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/login"
        className={buttonVariants({
          variant: "ghost",
          className: "hidden md:inline-flex",
        })}
      >
        Sign In
      </Link>
      <Link href="/register" className={buttonVariants()}>
        Get Started
      </Link>
    </div>
  );
}
