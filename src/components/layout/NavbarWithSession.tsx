import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";

export async function NavbarWithSession() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return <Navbar session={session} />;
}
