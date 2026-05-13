import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateUserDialog } from "@/features/admin/components/CreateUserDialog";
import { UserActions } from "@/features/admin/components/UserActions";
import { 
  UserSearchBar, 
  UserStatusFilter, 
  UserPagination 
} from "@/features/admin/components/UserTableControls";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = typeof params.query === "string" ? params.query : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const page = Number(params.page) || 1;
  const ITEMS_PER_PAGE = 10;

  // Build the where clause for Prisma
  const where: any = {};
  
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ];
  }

  if (status && status !== "all") {
    if (status === "none") {
      where.subscriptions = {
        none: {},
      };
    } else {
      where.subscriptions = {
        some: {
          status: status,
        },
      };
    }
  }

  // Fetch users and total count in parallel
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        subscriptions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Get the most recent one
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header Area */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              User Management
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Manage accounts, adjust permissions, and monitor user activity across the platform.
            </p>
          </div>
          <CreateUserDialog />
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <UserSearchBar />
            <UserStatusFilter />
          </div>
          <UserPagination currentPage={page} totalPages={totalPages} />
        </div>

        {/* Users Table Container */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-3 pl-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User Details</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">System Role</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subscription</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined Date</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account Status</TableHead>
                <TableHead className="pr-6 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <p className="text-sm font-semibold text-foreground">No users found</p>
                      <p className="text-xs">
                        {query || (status && status !== "all") 
                          ? "Try adjusting your filters or search terms." 
                          : "Start by creating your first user or wait for signups."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const sub = user.subscriptions[0];
                  const isBanned = user.banned === true;

                  return (
                    <TableRow key={user.id} className={cn(
                      "group text-sm transition-colors hover:bg-muted/50",
                      isBanned && "bg-destructive/10"
                    )}>
                      <TableCell className="py-4 pl-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground leading-tight">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "superadmin"
                              ? "default"
                              : user.role === "admin"
                              ? "secondary"
                              : "outline"
                          }
                          className={cn(
                            "px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-tight",
                            user.role === "superadmin"
                              ? "bg-primary hover:bg-primary/90 text-primary-foreground border-none shadow-sm"
                              : user.role === "admin"
                              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-none"
                              : "text-muted-foreground border-border"
                          )}
                        >
                          {user.role || "user"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {sub ? (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[13px] font-bold capitalize text-foreground">
                              {sub.plan} Plan
                            </span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "w-fit text-[10px] px-2 py-0 uppercase tracking-widest font-extrabold shadow-xs",
                                sub.status === "active" 
                                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                  : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              )}
                            >
                              {sub.status}
                            </Badge>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-[9px] px-2 py-0 uppercase tracking-widest text-muted-foreground border-border font-bold">
                            No Plan
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {isBanned ? (
                          <Badge variant="destructive" className="border-none px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-tight shadow-sm">
                            Banned
                          </Badge>
                        ) : (
                          <Badge 
                            variant="outline" 
                            className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-tight"
                          >
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <UserActions 
                          userId={user.id} 
                          userEmail={user.email} 
                          isBanned={isBanned} 
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Bottom Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">
            Showing <span className="text-foreground">{users.length}</span> of <span className="text-foreground">{totalCount}</span> users
          </p>
          <UserPagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
