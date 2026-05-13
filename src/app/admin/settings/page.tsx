"use client";

import * as React from "react";
import { useState, useEffect, useTransition } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Shield, Settings, User, Lock, Terminal, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { 
  updateAdminSecurityAction, 
  getSystemPreferences, 
  toggleSystemPreference 
} from "@/features/admin/actions/settings.action";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AdminSettingsPage() {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
 
  // Security Gate: Redirect if unauthenticated
  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.push("/admin/login");
    }
  }, [session, isSessionLoading, router]);

  // System Preferences State
  const [preferences, setPreferences] = useState<{
    maintenanceMode: boolean;
    disableRegistrations: boolean;
    waitlistMode: boolean;
  } | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sync name and load preferences when session loads
  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
    
    async function loadPrefs() {
      try {
        const prefs = await getSystemPreferences();
        setPreferences({
          maintenanceMode: prefs.maintenanceMode,
          disableRegistrations: prefs.disableRegistrations,
          waitlistMode: (prefs as any).waitlistMode,
        });
      } catch (err) {
        toast.error("Failed to load system preferences.");
      }
    }
    loadPrefs();
  }, [session?.user?.name]);

  const handleSaveSecurity = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (!currentPassword) {
      toast.error("Current password is required to save changes");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateAdminSecurityAction({
        name: name || session?.user?.name || "",
        currentPassword,
        newPassword,
      });

      if (result.success) {
        toast.success(result.message);
        
        // If password was changed, Better Auth plugin usually revokes the current session
        // Force a re-login to ensure the user is using their new credentials.
        if (newPassword) {
          toast.info("Password updated. Please log in again with your new credentials.");
          router.push("/admin/login");
          return;
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update security settings");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePreference = (key: string, value: boolean) => {
    // Optimistic Update
    const previousPrefs = preferences;
    setPreferences(prev => prev ? { ...prev, [key]: value } : null);

    startTransition(async () => {
      const result = await toggleSystemPreference(key, value);
      if (!result.success) {
        toast.error(result.error || "Failed to update preference.");
        // Rollback on failure
        setPreferences(previousPrefs);
      } else {
        toast.success(`Platform ${key} updated.`);
      }
    });
  };

  const handleSavePreferences = () => {
    toast.success("Preferences are now saved instantly on toggle!");
  };

  if (isSessionLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Configure your administrative profile and manage platform-wide preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full flex flex-col">
          <TabsList className="flex h-auto w-full justify-start bg-transparent p-0 border-b border-border rounded-none mb-6 overflow-x-auto">
            <TabsTrigger 
              value="profile" 
              className="px-0 py-3 h-auto data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none transition-all font-semibold text-sm"
            >
              <Shield className="mr-2 h-4 w-4" />
              Profile Security
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="px-0 py-3 h-auto data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none transition-all font-semibold text-sm"
            >
              <Settings className="mr-2 h-4 w-4" />
              System Preferences
            </TabsTrigger>
          </TabsList>


          {/* Profile Security Tab */}
          <TabsContent value="profile" className="w-full flex flex-col gap-6 focus-visible:outline-none">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your name and account display settings.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Super Admin" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={session?.user?.email || "admin@example.com"} disabled className="bg-muted" />
                  <p className="text-[12px] text-muted-foreground">Contact support to change your primary email.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input 
                    id="current" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Required to authorize changes"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input 
                      id="new" 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <Input 
                      id="confirm" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border bg-muted/50 px-6 py-4">
                <Button onClick={handleSaveSecurity} disabled={isSaving} className="ml-auto bg-primary hover:bg-primary/90">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Update Credentials"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* System Preferences Tab */}
          <TabsContent value="system" className="w-full flex flex-col gap-6 focus-visible:outline-none">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-emerald-500/10 p-2">
                    <Terminal className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle>Platform Control</CardTitle>
                    <CardDescription>
                      Global settings that affect all users and platform behavior.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="maintenance" className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Redirect all non-admin traffic to a maintenance page.
                    </p>
                  </div>
                  <Switch 
                    id="maintenance" 
                    checked={preferences?.maintenanceMode || false}
                    onCheckedChange={(checked) => handleTogglePreference("maintenanceMode", checked)}
                    disabled={!preferences || isPending}
                  />
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="registrations" className="text-base">Disable New Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Prevent new users from creating accounts on the platform.
                    </p>
                  </div>
                  <Switch 
                    id="registrations" 
                    checked={preferences?.disableRegistrations || false}
                    onCheckedChange={(checked) => handleTogglePreference("disableRegistrations", checked)}
                    disabled={!preferences || isPending}
                  />
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="waitlist" className="text-base">Waitlist Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Replace the registration form with a waitlist capture form to build hype before launch.
                    </p>
                  </div>
                  <Switch 
                    id="waitlist" 
                    checked={preferences?.waitlistMode || false}
                    onCheckedChange={(checked) => handleTogglePreference("waitlistMode", checked)}
                    disabled={!preferences || isPending}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Appearance & Localization</CardTitle>
                    <CardDescription>
                      Customize how the platform looks and feels for your users.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="dark-mode" className="text-base">Force Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Override user preferences and force the dark theme globally.
                    </p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                <div className="flex items-center justify-between space-x-4 rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex flex-col space-y-1">
                    <Label className="text-base font-semibold">Interface Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light, dark, and system modes.
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
              <CardFooter className="border-t border-border bg-muted/50 px-6 py-4">
                <Button onClick={handleSavePreferences} disabled={isSaving} className="ml-auto bg-primary hover:bg-primary/90">
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
