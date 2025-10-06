import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";

// Dummy user data for display
const dummyUserData = {
  id: 1,
  name: "John Doe",
  department: "Metro PD",
  role: "Senior Officer",
  phone: "(555) 123-4567",
  email: "john.doe@metro.gov",
  status: "Active",
  joinDate: "2023-03-15",
  lastLogin: "2025-01-15 10:30 AM",
};

export default function ViewUser() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

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
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/users/${type}`)}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">User Details</h1>
          </div>
          <Button
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => navigate(`/users/${type}/${id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Edit User
          </Button>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{dummyUserData.name}</span>
              <Badge className={getStatusColor(dummyUserData.status)}>
                {dummyUserData.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Name</div>
                <div className="text-base">{dummyUserData.name}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Department</div>
                <div className="text-base">{dummyUserData.department}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Role</div>
                <div className="text-base">{dummyUserData.role}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Email</div>
                <div className="text-base">{dummyUserData.email}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Phone</div>
                <div className="text-base">{dummyUserData.phone}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Join Date</div>
                <div className="text-base">{dummyUserData.joinDate}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Last Login</div>
                <div className="text-base">{dummyUserData.lastLogin}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">User ID</div>
                <div className="text-base font-mono">#{dummyUserData.id}</div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => navigate(`/users/${type}`)}
                className="w-full"
              >
                Back to Users List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
