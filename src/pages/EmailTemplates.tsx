import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Search, Plus, Edit, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

const dummyTemplates = [
  {
    id: 1,
    name: "Welcome Mail",
    description: "Sent to new users upon registration",
    status: "Active",
    createdAt: "2024-12-15",
    lastModified: "2025-01-10",
  },
  {
    id: 2,
    name: "Accident Report Acknowledgment",
    description: "Confirmation email for submitted accident reports",
    status: "Active",
    createdAt: "2024-11-20",
    lastModified: "2025-01-12",
  },
  {
    id: 3,
    name: "Reset Password",
    description: "Password reset link email",
    status: "Active",
    createdAt: "2024-10-05",
    lastModified: "2024-12-18",
  },
  {
    id: 4,
    name: "Account Activation",
    description: "Email sent when account is activated by admin",
    status: "Active",
    createdAt: "2024-09-12",
    lastModified: "2025-01-05",
  },
  {
    id: 5,
    name: "EMT Notification",
    description: "Alert sent to EMT users for new reports",
    status: "Active",
    createdAt: "2024-08-25",
    lastModified: "2024-11-30",
  },
  {
    id: 6,
    name: "Police Department Alert",
    description: "Critical accident alerts for police",
    status: "Active",
    createdAt: "2024-07-18",
    lastModified: "2024-10-22",
  },
  {
    id: 7,
    name: "Insurance Claim Started",
    description: "Notification when insurance claim is initiated",
    status: "Draft",
    createdAt: "2024-06-10",
    lastModified: "2024-12-05",
  },
  {
    id: 8,
    name: "Wrecker Dispatch",
    description: "Notification sent to wrecker services",
    status: "Active",
    createdAt: "2024-05-15",
    lastModified: "2024-09-14",
  },
];

type SortField = "name" | "createdAt";
type SortOrder = "asc" | "desc";

export default function EmailTemplates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter
  let filteredTemplates = dummyTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || template.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort
  filteredTemplates = [...filteredTemplates].sort((a, b) => {
    let aVal: string | number = a[sortField];
    let bVal: string | number = b[sortField];

    if (sortField === "createdAt") {
      aVal = new Date(a.createdAt).getTime();
      bVal = new Date(b.createdAt).getTime();
    } else {
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success text-success-foreground";
      case "Draft":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
              <Select
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
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Template Name
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-left">Description</TableHead>
                    <TableHead className="text-left">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("createdAt")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Created At
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-left">Last Modified</TableHead>
                    <TableHead className="text-left">Status</TableHead>
                    <TableHead className="text-left">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTemplates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No templates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTemplates.map((template) => (
                      <TableRow key={template.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{template.description}</TableCell>
                        <TableCell>{template.createdAt}</TableCell>
                        <TableCell>{template.lastModified}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(template.status)}>{template.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => navigate(`/templates/${template.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
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
                Total <span className="font-semibold">{filteredTemplates.length}</span> Email Templates
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
    </MainLayout>
  );
}
