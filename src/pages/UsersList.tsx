import { useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, Eye, Edit, Ban, MoreVertical } from "lucide-react";
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
  ],
  emt: [
    { id: 1, name: "Emily Davis", department: "City EMS", phone: "(555) 111-2222", email: "emily.d@ems.org", status: "Active" },
    { id: 2, name: "David Wilson", department: "County EMS", phone: "(555) 222-3333", email: "d.wilson@countyems.org", status: "Active" },
    { id: 3, name: "Lisa Anderson", department: "Metro Ambulance", phone: "(555) 333-4444", email: "lisa.a@metro.org", status: "Active" },
    { id: 4, name: "James Taylor", department: "Regional EMS", phone: "(555) 444-5555", email: "j.taylor@regional.org", status: "Inactive" },
  ],
  fire: [
    { id: 1, name: "Tom Harris", department: "Station 1", phone: "(555) 777-8888", email: "tom.h@fire.gov", status: "Active" },
    { id: 2, name: "Chris Martin", department: "Station 5", phone: "(555) 888-9999", email: "c.martin@fire.gov", status: "Active" },
    { id: 3, name: "Kevin Lee", department: "Station 3", phone: "(555) 999-0000", email: "kevin.l@fire.gov", status: "Active" },
  ],
  wrecker: [
    { id: 1, name: "Mark Thompson", department: "ABC Towing", phone: "(555) 101-2020", email: "mark@abctow.com", status: "Active" },
    { id: 2, name: "Paul Garcia", department: "Quick Tow", phone: "(555) 202-3030", email: "paul@quicktow.com", status: "Active" },
    { id: 3, name: "Steve Martinez", department: "City Wrecker", phone: "(555) 303-4040", email: "steve@citywreck.com", status: "Pending" },
  ],
  insurance: [
    { id: 1, name: "Rachel Green", department: "State Farm", phone: "(555) 404-5050", email: "rachel@statefarm.com", status: "Active" },
    { id: 2, name: "Monica Bing", department: "Geico", phone: "(555) 505-6060", email: "monica@geico.com", status: "Active" },
    { id: 3, name: "Ross Geller", department: "Progressive", phone: "(555) 606-7070", email: "ross@progressive.com", status: "Active" },
  ],
  app: [
    { id: 1, name: "Alex Johnson", department: "N/A", phone: "(555) 707-8080", email: "alex.j@email.com", status: "Active" },
    { id: 2, name: "Sam Wilson", department: "N/A", phone: "(555) 808-9090", email: "sam.w@email.com", status: "Active" },
    { id: 3, name: "Chris Evans", department: "N/A", phone: "(555) 909-1010", email: "chris.e@email.com", status: "Inactive" },
  ],
};

export default function UsersList() {
  const { type } = useParams<{ type: string }>();
  const [searchQuery, setSearchQuery] = useState("");

  const users = dummyUsers[type as keyof typeof dummyUsers] || [];
  const title = userTypeTitle[type as string] || "Users";

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4" />
            Add New User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem className="gap-2" onClick={() => toast.info("View details feature coming soon")}>
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => toast.info("Edit user feature coming soon")}>
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2" onClick={() => toast.info("Deactivate user feature coming soon")}>
                              <Ban className="h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
