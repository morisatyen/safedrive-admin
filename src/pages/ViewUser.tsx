import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, User, Mail, Phone, Calendar, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  user: UserData;
}

const roleDisplayMap: Record<string, string> = {
  POLICE: "Police Officer",
  EMT: "EMT Personnel",
  FIRE: "Fire Department",
  WRECKER: "Wrecker Service",
  INSURANCE: "Insurance Agent",
  DRIVER: "App User",
};

export default function ViewUser() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/web/v1/auth/users/${id}`, {
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch user');
      }
      return result;
    },
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-success text-success-foreground"
      : "bg-destructive text-destructive-foreground";
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-muted-foreground">Loading user details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !data?.user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load user details</p>
            <Button onClick={() => navigate(`/users/${type}`)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const user = data.user;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/users/${type}`)}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">User Details</h1>
          </div>
          <Button
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => navigate(`/users/${type}/${id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Edit User
          </Button>
        </div>

        <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 from-white via-accent/10 to-muted/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between pb-4">
              <span>{user.name}</span>
              <Badge className={getStatusColor(user.isActive)}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Profile Section */}
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center">
                    <span className="text-4xl font-semibold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{roleDisplayMap[user.role] || user.role}</p>
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Email Address</div>
                    <div className="text-base font-medium">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-secondary/10">
                    <Phone className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Phone Number</div>
                    <div className="text-base font-medium">{user.phone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-accent/10">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Role</div>
                    <div className="text-base font-medium">{roleDisplayMap[user.role] || user.role}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-info/10">
                    <Calendar className="h-5 w-5 text-info" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Created Date</div>
                    <div className="text-base font-medium">{format(new Date(user.createdAt), "MMM dd, yyyy")}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-warning/10">
                    <Calendar className="h-5 w-5 text-warning" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                    <div className="text-base font-medium">{format(new Date(user.updatedAt), "MMM dd, yyyy")}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">User ID</div>
                    <div className="text-base font-mono font-medium">{user.id}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => navigate(`/users/${type}`)}
                className="w-full"
              >
                Back to Users List
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
