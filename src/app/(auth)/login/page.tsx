import { LoginForm } from "@/features/auth/components/LoginForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  // Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      <LoginForm />
    </div>
  );
}
