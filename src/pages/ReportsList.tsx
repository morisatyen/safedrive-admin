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
import { Search, Eye, ArrowUpDown } from "lucide-react";

const dummyReports = [
  {
    id: "SD-9876",
    date: "2025-01-15 14:30",
    location: "I-95 Exit 42, Northbound",
    severity: "Critical",
    status: "In Progress",
    submittedBy: "App User",
  },
  {
    id: "SD-9875",
    date: "2025-01-15 12:15",
    location: "Main St & 5th Ave",
    severity: "High",
    status: "Pending EMT",
    submittedBy: "Police Officer",
  },
  {
    id: "SD-9874",
    date: "2025-01-15 09:45",
    location: "Highway 101, Mile Marker 23",
    severity: "Medium",
    status: "Resolved",
    submittedBy: "App User",
  },
  {
    id: "SD-9873",
    date: "2025-01-14 18:20",
    location: "Oak Street Parking Lot",
    severity: "Low",
    status: "Resolved",
    submittedBy: "Fire Department",
  },
  {
    id: "SD-9872",
    date: "2025-01-14 16:00",
    location: "Route 50 & Commerce Blvd",
    severity: "High",
    status: "In Progress",
    submittedBy: "App User",
  },
  {
    id: "SD-9871",
    date: "2025-01-14 11:30",
    location: "Downtown Bridge",
    severity: "Critical",
    status: "Pending Wrecker",
    submittedBy: "Police Officer",
  },
  {
    id: "SD-9870",
    date: "2025-01-13 20:45",
    location: "Industrial Park Entrance",
    severity: "Medium",
    status: "Resolved",
    submittedBy: "EMT",
  },
  {
    id: "SD-9869",
    date: "2025-01-13 15:30",
    location: "Airport Highway",
    severity: "High",
    status: "In Progress",
    submittedBy: "App User",
  },
  {
    id: "SD-9868",
    date: "2025-01-13 10:15",
    location: "Cedar Avenue",
    severity: "Low",
    status: "Resolved",
    submittedBy: "Police Officer",
  },
  {
    id: "SD-9867",
    date: "2025-01-12 22:45",
    location: "River Road Bridge",
    severity: "Critical",
    status: "Pending EMT",
    submittedBy: "App User",
  },
];

type SortField = "date" | "severity" | "status";
type SortOrder = "asc" | "desc";

export default function ReportsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter
  let filteredReports = dummyReports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.severity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort
  filteredReports = [...filteredReports].sort((a, b) => {
    let aVal: string | number = a[sortField];
    let bVal: string | number = b[sortField];

    if (sortField === "date") {
      aVal = new Date(a.date).getTime();
      bVal = new Date(b.date).getTime();
    } else {
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-destructive text-destructive-foreground";
      case "High":
        return "bg-warning text-warning-foreground";
      case "Medium":
        return "bg-info text-info-foreground";
      case "Low":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes("Resolved")) return "bg-success text-success-foreground";
    if (status.includes("Pending")) return "bg-warning text-warning-foreground";
    return "bg-info text-info-foreground";
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Accident Reports</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
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
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Pending EMT">Pending EMT</SelectItem>
                  <SelectItem value="Pending Wrecker">Pending Wrecker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left"># ID</TableHead>
                    <TableHead className="text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div                        
                        onClick={() => handleSort("date")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Date/Time
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-left">Location</TableHead>
                    <TableHead className="text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div                        
                        onClick={() => handleSort("severity")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Severity
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-left cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Status
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-left">Submitted By</TableHead>
                    <TableHead className="text-left">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No reports found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium font-mono">{report.id}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>{report.location}</TableCell>
                        <TableCell>
                          <Badge className={`${getSeverityColor(report.severity)} font-semibold`}>
                            {report.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{report.submittedBy}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => navigate(`/reports/${report.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
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
                Total <span className="font-semibold">{filteredReports.length}</span> Accident Reports
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
