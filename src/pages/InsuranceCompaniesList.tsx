import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Eye, Edit, Building2, Globe, Phone, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface InsuranceCompany {
  id: string;
  companyName: string;
  websiteUrl: string;
  supportPhone: string;
  isActive: boolean;
  contactPersonName?: string;
  contactEmail?: string;
  establishedYear?: number;
  policyCoverageType?: string;
  licenseNumber?: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  data: InsuranceCompany[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type SortField = "companyName" | "websiteUrl" | "isActive" | "createdAt";
type SortOrder = "asc" | "desc";

export default function InsuranceCompaniesList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchQuery, 500);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteCompanyId, setDeleteCompanyId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['insurance-companies', debouncedSearchTerm, sortField, sortOrder, currentPage, itemsPerPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(itemsPerPage),
        search: debouncedSearchTerm,
        sortBy: sortField,
        sortOrder,
      });

      const response = await fetch(`${API_URL}/web/v1/auth/insurance-companies?${params.toString()}`, {
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error('Failed to fetch insurance companies');
      }
      return result.data;
    },
    refetchOnWindowFocus: false,
    retry: 1,
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

  const deleteCompanyMutation = useMutation({
    mutationFn: async (companyId: string) => {
      const response = await fetch(`${API_URL}/web/v1/auth/insurance-companies/${companyId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete insurance company');
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Insurance company deleted successfully!",{description: "The company has been removed from the list."});
      queryClient.invalidateQueries({ queryKey: ['insurance-companies'] });
      setDeleteCompanyId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete insurance company");
      setDeleteCompanyId(null);
    },
  });

  const handleDelete = () => {
    if (deleteCompanyId) {
      deleteCompanyMutation.mutate(deleteCompanyId);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-success text-success-foreground"
      : "bg-destructive text-destructive-foreground";
  };

  const totalItems = data?.meta?.total ?? 0;
  const companies = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const resultsText = `Showing ${startItem} to ${endItem} of ${totalItems} companies`;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-muted-foreground">Loading insurance companies...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load insurance companies</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Insurance Companies</h1>
              {/* <p className="text-muted-foreground">
                Manage insurance company partners and their details
              </p> */}
            </div>
          </div>
          <Button
            onClick={() => navigate("/insurance-companies/add")}
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Plus className="h-4 w-4" />
            Add Company
          </Button>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold">
                Companies List ({totalItems})
              </CardTitle>
              <div className="relative flex-1 w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by company name or website..."
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
            {companies.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No companies found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "No companies match your search criteria." : "Get started by adding your first insurance company."}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => navigate("/insurance-companies/add")}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Company
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div
                          onClick={() => handleSort("companyName")}
                          className="flex items-center gap-1 font-semibold"
                        >
                          Company
                          {sortField === "companyName" && (
                            sortOrder === "asc" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div
                          onClick={() => handleSort("isActive")}
                          className="flex items-center gap-1 font-semibold"
                        >
                          Status
                          {sortField === "isActive" && (
                            sortOrder === "asc" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Established</TableHead>
                      <TableHead className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div
                          onClick={() => handleSort("createdAt")}
                          className="flex items-center gap-1 font-semibold"
                        >
                          Created
                          {sortField === "createdAt" && (
                            sortOrder === "asc" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Actions</TableHead>
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
                          Failed to fetch companies
                        </TableCell>
                      </TableRow>
                    ) : (
                      companies.map((company) => (
                        <TableRow key={company.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary">
                                  {company.companyName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{company.companyName}</div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Globe className="h-3 w-3" />
                                  <a 
                                    href={company.websiteUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-primary hover:underline"
                                  >
                                    {company.websiteUrl.replace(/^https?:\/\//, '')}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                {company.supportPhone}
                              </div>
                              {company.contactPersonName && (
                                <div className="text-sm text-muted-foreground">
                                  {company.contactPersonName}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(company.isActive)}>
                              {company.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {company.establishedYear || "N/A"}
                          </TableCell>
                          <TableCell>
                            {format(new Date(company.createdAt), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/insurance-companies/${company.id}/view`)}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/insurance-companies/${company.id}/edit`)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteCompanyId(company.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Footer with Pagination */}
            {totalPages > 0 && (
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteCompanyId !== null} onOpenChange={() => setDeleteCompanyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Insurance Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this insurance company? This action cannot be undone and will permanently remove all company data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCompanyMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCompanyMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}