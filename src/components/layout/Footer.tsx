import Link from "next/link";
import { CurrentYear } from "./CurrentYear";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 py-12 dark:bg-slate-950">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © <CurrentYear /> SaaS Starter. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
