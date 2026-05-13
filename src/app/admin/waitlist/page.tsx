import { getWaitlistEntries, getWaitlistStats } from "@/features/admin/utils/waitlist";
import { format } from "date-fns";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExportWaitlistButton } from "@/features/admin/components/ExportWaitlistButton";
import { ClipboardList, Mail } from "lucide-react";

export default async function AdminWaitlistPage() {
  const entries = await getWaitlistEntries();
  const { totalCount } = await getWaitlistStats();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Waitlist Management
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            You currently have <span className="font-bold text-primary">{totalCount}</span> potential leads on your waitlist.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportWaitlistButton data={entries} />
        </div>
      </div>

      {/* Waitlist Table Card */}
      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Waitlist Entries</CardTitle>
              <CardDescription>
                A list of all users who have expressed interest in your platform.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[60%] px-6">Email Address</TableHead>
                <TableHead className="px-6 text-right">Date Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="px-6 font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {entry.email}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-right text-muted-foreground">
                      {format(new Date(entry.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-32 text-center text-muted-foreground italic">
                    No users on the waitlist yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
