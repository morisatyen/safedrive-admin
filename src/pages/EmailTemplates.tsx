import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { format } from "date-fns";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}


// const fetchEmailTemplates = async (page: number, limit: number, search: string): Promise<EmailTemplateResponse> => {
//   const response = await axios.get(`${API_URL}/web/v1/auth/email-templates`, {
//     params: { page, limit, search },
//   });
//   if (!response.data.success) throw new Error(response.data.message);
//   return response.data.data as EmailTemplateResponse; // explicitly type it
// };
type SortField = "name" | "createdAt";
type SortOrder = "asc" | "desc";

export default function EmailTemplates() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchQuery, 500);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/web/v1/auth/email-templates/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete template');
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Template deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['TemplatesData'] });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete template");
      setDeleteId(null);
    },
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: [
      "TemplatesData",
      debouncedSearchTerm,
      sortField,
      sortOrder,
      currentPage,
      itemsPerPage,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: debouncedSearchTerm,
        sortBy: sortField,
        sortOrder,
        page: String(currentPage),
        limit: String(itemsPerPage),
      });

      const response = await fetch(
        `${API_URL}/web/v1/auth/email-templates?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add auth headers if needed
          },
          credentials: "include",
        }
      );

      const result = await response.json();
      console.log("Fetched Templates Data:", result);
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch Templates Data.");
      }

      return result.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity,
  });

  const totalItems = data?.pagination?.total ?? 0;
  const startItem = totalItems > 0 ? (data.pagination.page - 1) * data.pagination.limit + 1 : 0;
  const endItem = Math.min(data?.pagination.page * data?.pagination.limit, totalItems);
  const resultsText = `Showing ${startItem} to ${endItem} of ${totalItems} results`;


  // Sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };
  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "Active":
  //       return "bg-success text-success-foreground";
  //     case "Draft":
  //       return "bg-warning text-warning-foreground";
  //     default:
  //       return "bg-muted text-muted-foreground";
  //   }
  // };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <Button
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => navigate("/templates/add")}
          >
            <Plus className="h-4 w-4" />
            Add New Template
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              {/* <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">#</TableHead>
                    <TableHead className="text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Template Name
                        {sortField === "name" && (
                          sortOrder === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-left">Description</TableHead>
                    <TableHead className="text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        CreatedAt
                        {sortField === "createdAt" && (
                          sortOrder === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-left">Last Modified</TableHead>
                    {/* <TableHead className="text-left">Status</TableHead> */}
                    <TableHead className="text-left">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-red-500 py-8">
                        Failed to fetch templates
                      </TableCell>
                    </TableRow>
                  ) : data?.templates?.length > 0 ? (
                    data.templates.map((template,index) => (
                      <TableRow key={template.id} className="hover:bg-muted/50">
                        <TableCell>{startItem + index}</TableCell>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{template.subject}</TableCell>
                        <TableCell> {format(new Date(template.createdAt), "MM-dd-yyyy")}</TableCell>
                        <TableCell> {format(new Date(template.updatedAt), "MM-dd-yyyy")}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/templates/${template.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete"
                            onClick={() => setDeleteId(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No templates found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                {resultsText}
              </div>
              {data?.pagination.totalPages && data.pagination.totalPages > 1 && (
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
                        Page {currentPage} of {data.pagination.totalPages}
                      </span>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                          className={currentPage === data.pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Deactivate Confirmation Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Email Template</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this email template? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
