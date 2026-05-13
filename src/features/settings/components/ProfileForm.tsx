"use client";

import { useTransition } from "react";
import { updateProfileAction } from "@/features/settings/actions/update-profile.action";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  initialData: {
    name: string;
    email: string;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    startTransition(async () => {
      const res = await updateProfileAction({ name, email });
      if (res.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <Card className="w-full max-w-xl shadow-sm border-slate-200 dark:border-slate-800">
      <form onSubmit={handleSubmit} key={initialData.email}>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account details. Note: Changing your email may require re-verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={initialData.name ?? ""} 
              placeholder="e.g. Jane Doe"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              defaultValue={initialData.email ?? ""} 
              placeholder="jane@example.com"
              required 
            />
          </div>
        </CardContent>
        <CardFooter className="border-t border-slate-200 dark:border-slate-800 p-4 mt-4">
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto ml-auto bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
