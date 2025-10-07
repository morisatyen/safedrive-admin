import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Search, Eye, Edit, Ban, MoreVertical, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

const userTypeTitle: Record<string, string> = {
  police: "Police Users",
  emt: "EMT Users",
  fire: "Fire Users",
  wrecker: "Wrecker Users",
  insurance: "Insurance Users",
  app: "App Users",
};

const dummyUsers = {
  police: [
    { id: 1, name: "John Doe", department: "Metro PD", phone: "(555) 123-4567", email: "john.doe@metro.gov", status: "Active" },
    { id: 2, name: "Jane Smith", department: "Highway Patrol", phone: "(555) 234-5678", email: "jane.smith@hp.gov", status: "Active" },
    { id: 3, name: "Mike Johnson", department: "County Sheriff", phone: "(555) 345-6789", email: "mike.j@county.gov", status: "Inactive" },
    { id: 4, name: "Sarah Williams", department: "Metro PD", phone: "(555) 456-7890", email: "s.williams@metro.gov", status: "Active" },
    { id: 5, name: "Robert Brown", department: "City Police", phone: "(555) 567-8901", email: "r.brown@city.gov", status: "Pending" },
    { id: 6, name: "Emily Davis", department: "Metro PD", phone: "(555) 678-9012", email: "e.davis@metro.gov", status: "Active" },
    { id: 7, name: "Michael Wilson", department: "Highway Patrol", phone: "(555) 789-0123", email: "m.wilson@hp.gov", status: "Inactive" },
  ],
  emt: [
    { id: 1, name: "Emily Davis", department: "City EMS", phone: "(555) 111-2222", email: "emily.d@ems.org", status: "Active" },
    { id: 2, name: "David Wilson", department: "County EMS", phone: "(555) 222-3333", email: "d.wilson@countyems.org", status: "Active" },
    { id: 3, name: "Lisa Anderson", department: "Metro Ambulance", phone: "(555) 333-4444", email: "lisa.a@metro.org", status: "Active" },
    { id: 4, name: "James Taylor", department: "Regional EMS", phone: "(555) 444-5555", email: "j.taylor@regional.org", status: "Inactive" },
    { id: 5, name: "Rachel Green", department: "City EMS", phone: "(555) 555-6666", email: "r.green@ems.org", status: "Active" },
    { id: 6, name: "Monica Geller", department: "County EMS", phone: "(555) 666-7777", email: "m.geller@countyems.org", status: "Pending" },
  ],
  fire: [
    { id: 1, name: "Tom Harris", department: "Station 1", phone: "(555) 777-8888", email: "tom.h@fire.gov", status: "Active" },
    { id: 2, name: "Chris Martin", department: "Station 5", phone: "(555) 888-9999", email: "c.martin@fire.gov", status: "Active" },
    { id: 3, name: "Kevin Lee", department: "Station 3", phone: "(555) 999-0000", email: "kevin.l@fire.gov", status: "Active" },
    { id: 4, name: "Daniel Park", department: "Station 2", phone: "(555) 000-1111", email: "d.park@fire.gov", status: "Inactive" },
    { id: 5, name: "Ryan Kim", department: "Station 4", phone: "(555) 111-2222", email: "r.kim@fire.gov", status: "Active" },
  ],
  wrecker: [
    { id: 1, name: "Mark Thompson", department: "ABC Towing", phone: "(555) 101-2020", email: "mark@abctow.com", status: "Active" },
    { id: 2, name: "Paul Garcia", department: "Quick Tow", phone: "(555) 202-3030", email: "paul@quicktow.com", status: "Active" },
    { id: 3, name: "Steve Martinez", department: "City Wrecker", phone: "(555) 303-4040", email: "steve@citywreck.com", status: "Pending" },
    { id: 4, name: "Tony Rodriguez", department: "ABC Towing", phone: "(555) 404-5050", email: "tony@abctow.com", status: "Active" },
    { id: 5, name: "Carlos Hernandez", department: "Quick Tow", phone: "(555) 505-6060", email: "carlos@quicktow.com", status: "Inactive" },
  ],
  insurance: [
    { id: 1, name: "Rachel Green", department: "State Farm", phone: "(555) 404-5050", email: "rachel@statefarm.com", status: "Active" },
    { id: 2, name: "Monica Bing", department: "Geico", phone: "(555) 505-6060", email: "monica@geico.com", status: "Active" },
    { id: 3, name: "Ross Geller", department: "Progressive", phone: "(555) 606-7070", email: "ross@progressive.com", status: "Active" },
    { id: 4, name: "Chandler Bing", department: "Allstate", phone: "(555) 707-8080", email: "chandler@allstate.com", status: "Inactive" },
    { id: 5, name: "Joey Tribbiani", department: "State Farm", phone: "(555) 808-9090", email: "joey@statefarm.com", status: "Active" },
  ],
  app: [
    { id: 1, name: "Alex Johnson", department: "N/A", phone: "(555) 707-8080", email: "alex.j@email.com", status: "Active" },
    { id: 2, name: "Sam Wilson", department: "N/A", phone: "(555) 808-9090", email: "sam.w@email.com", status: "Active" },
    { id: 3, name: "Chris Evans", department: "N/A", phone: "(555) 909-1010", email: "chris.e@email.com", status: "Inactive" },
    { id: 4, name: "Taylor Swift", department: "N/A", phone: "(555) 010-1111", email: "taylor.s@email.com", status: "Active" },
    { id: 5, name: "Jordan Lee", department: "N/A", phone: "(555) 111-1212", email: "jordan.l@email.com", status: "Pending" },
    { id: 6, name: "Morgan Davis", department: "N/A", phone: "(555) 212-1313", email: "morgan.d@email.com", status: "Active" },
  ],
};

type SortField = "name" | "email" | "status";
type SortOrder = "asc" | "desc";

export default function UsersList() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [deactivateUserId, setDeactivateUserId] = useState<number | null>(null);
  const itemsPerPage = 5;

  const users = dummyUsers[type as keyof typeof dummyUsers] || [];
  const title = userTypeTitle[type as string] || "Users";

  // Filter
  let filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort
  filteredUsers = [...filteredUsers].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (sortField === "name" || sortField === "email") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

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
      case "Inactive":
        return "bg-destructive text-destructive-foreground";
      case "Pending":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
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
              <div className="relative flex-1 max-w-sm">
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
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Name
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("email")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Email
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("status")}
                        className="flex items-center gap-1 font-semibold"
                      >
                        Status
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => navigate(`/users/${type}/${user.id}/view`)}
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2"
                                onClick={() => navigate(`/users/${type}/${user.id}/edit`)}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-destructive"
                                onClick={() => setDeactivateUserId(user.id)}
                              >
                                <Ban className="h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                Total Users: <span className="font-semibold">{filteredUsers.length}</span>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
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
              onClick={() => {
                toast.success("User has been deactivated successfully");
                setDeactivateUserId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
