import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Search, Eye, Edit, Ban, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const userTypeTitle: Record<string, string> = {
  police: "Police Users",
  emt: "EMT Users",
  fire: "Fire Users",
  wrecker: "Wrecker Users",
  insurance: "Insurance Users",
  driver: "App Users",
};

const roleMapping: Record<string, string> = {
  police: "POLICE",
  emt: "EMT",
  fire: "FIRE",
  wrecker: "WRECKER",
  insurance: "INSURANCE",
  driver: "DRIVER",
};
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  isActive: boolean;
}
interface UsersResponse {
  success: boolean;
  total: number;
  users: User[];
}
type SortField = "name" | "email" | "createdAt" | "status";
type SortOrder = "asc" | "desc";

export default function UsersList() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchQuery, 500);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [deactivateUserId, setDeactivateUserId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const role = roleMapping[type as string] || "APP";
  const title = userTypeTitle[type as string] || "Users";

  const { data, isLoading, isError } = useQuery<UsersResponse>({
    queryKey: ["users", role, debouncedSearchTerm, sortField, sortOrder, currentPage, itemsPerPage],
    queryFn: async (): Promise<UsersResponse> => {
      const params = new URLSearchParams({
        role,
        page: String(currentPage),
        limit: String(itemsPerPage),
        search: debouncedSearchTerm,
        sortBy: sortField,
        sortOrder,
      });

      const response = await fetch(`${API_URL}/web/v1/auth/users?${params.toString()}`, {
        credentials: 'include',
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch users');
      }

      return result;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const deactivateMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`${API_URL}/web/v1/auth/update-status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isActive: false,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to deactivate user');
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("User deactivated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeactivateUserId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to deactivate user");
      setDeactivateUserId(null);
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleDeactivate = () => {
    if (deactivateUserId) {
      deactivateMutation.mutate(deactivateUserId);
    }
  };

  const totalItems = data?.total ?? 0;
  const users = data?.users ?? [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const resultsText = `Showing ${startItem} to ${endItem} of ${totalItems} ${type} users`;

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-success text-success-foreground"
      : "bg-destructive text-destructive-foreground";
  };
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{title}</h1>
          <Button
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => navigate(`/users/${type}/add`)}
          >
            <Plus className="h-4 w-4" />
            Add New User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Name
                        {sortField === "name" && (
                          sortOrder === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-left">Phone</TableHead>
                    <TableHead className="text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div
                        onClick={() => handleSort("email")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Email
                        {sortField === "email" && (
                          sortOrder === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Created At
                        {sortField === "createdAt" && (
                          sortOrder === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Status
                        {sortField === "status" && (
                          sortOrder === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-left">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-red-500 py-8">
                        Failed to fetch users
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user: User) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{format(new Date(user.createdAt), "MM-dd-yyyy")}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.isActive)}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="View"
                              onClick={() => navigate(`/users/${type}/${user.id}/view`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Edit"
                              onClick={() => navigate(`/users/${type}/${user.id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Deactivate"
                              onClick={() => setDeactivateUserId(user.id)}
                              className="group hover:bg-destructive transition-colors"
                            >
                              <Ban className="h-4 w-4 text-destructive transition-colors group-hover:text-white" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {resultsText}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Pagination>
                    <PaginationContent className="flex items-center justify-center gap-2 w-full">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      <span className="text-sm text-muted-foreground mx-2">
                        Page {currentPage} of {totalPages}
                      </span>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={deactivateUserId !== null} onOpenChange={() => setDeactivateUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate this user? This action can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              disabled={deactivateMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deactivateMutation.isPending ? "Deactivating..." : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}