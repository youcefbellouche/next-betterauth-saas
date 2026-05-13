import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { WaitlistForm } from "@/features/auth/components/WaitlistForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSystemPreferences } from "@/features/admin/actions/settings-action";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default async function RegisterPage() {
  // Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  const prefs = await getSystemPreferences();

  // 1. Check for Waitlist Mode first (build hype)
  if (prefs.waitlistMode) {
    return <WaitlistForm />;
  }

  // 2. Check for disabled registrations (hard gate)
  if (prefs.disableRegistrations) {
    return (
      <Card className="border-border shadow-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
            <AlertCircle className="h-6 w-6 text-amber-600" />
          </div>
          <CardTitle>Registrations Disabled</CardTitle>
          <CardDescription>
            New user registrations are currently disabled by the administrator. 
            Please contact support if you believe this is an error.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // 3. Normal registration flow
  return (
    <div className="flex flex-col gap-6">
      <RegisterForm />
    </div>
  );
}
