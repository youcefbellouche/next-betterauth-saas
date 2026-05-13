"use client";

import { useState, useTransition, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Loader2, Globe } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ProfileForm } from "@/features/settings/components/ProfileForm";
import { updateUserPassword } from "@/features/user/actions/settings.action";

export default function UserSettingsPage() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Security Gate: Redirect if unauthenticated
  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push("/login");
    }
  }, [session, isSessionLoading, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsSaving(true);
    startTransition(async () => {
      const result = await updateUserPassword({
        currentPassword,
        newPassword,
      });

      if (result.success) {
        toast.success(result.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Force re-login after password change
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(result.error || "Failed to update password");
      }
      setIsSaving(false);
    });
  };

  if (isSessionLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal account settings and security preferences.
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        <Tabs defaultValue="profile" className="w-full flex flex-col">
          <TabsList className="flex h-auto w-full justify-start bg-transparent p-0 gap-8 border-b border-border rounded-none overflow-x-auto mb-6">
  <TabsTrigger 
    value="profile" 
    className="px-0 py-3 h-auto data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none transition-all font-semibold text-sm flex items-center gap-2"
  >
    <User className="h-4 w-4" />
    Profile
  </TabsTrigger>
  <TabsTrigger 
    value="security" 
    className="px-0 py-3 h-auto data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none transition-all font-semibold text-sm flex items-center gap-2"
  >
    <Lock className="h-4 w-4" />
    Security
  </TabsTrigger>
</TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6 w-full flex flex-col space-y-6 focus-visible:outline-none">
            <ProfileForm 
              initialData={{
                name: session.user.name,
                email: session.user.email,
              }} 
            />

            <Card className="w-full max-w-xl shadow-sm border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize how your dashboard looks and feels.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">Interface Theme</Label>
                    <p className="text-[12px] text-muted-foreground">Switch between light, dark, and system modes.</p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6 w-full flex flex-col focus-visible:outline-none">
            <Card className="w-full max-w-xl shadow-sm border-border">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-amber-500/10 p-2">
                    <Lock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                      Ensure your account is using a long, random password to stay secure.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <form onSubmit={handlePasswordChange}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input 
                      id="current_password" 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <Input 
                      id="new_password" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <Input 
                      id="confirm_password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border bg-muted/50 px-3 py-3 mt-3">
                  <Button type="submit" disabled={isSaving} className="ml-auto">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
