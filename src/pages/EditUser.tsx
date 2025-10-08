import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Pre-populated dummy data
const dummyUserData = {
  name: "John Doe",
  department: "Metro PD",
  role: "Senior Officer",
  email: "john.doe@metro.gov",
  phone: "(555) 123-4567",
  status: true,
};

export default function EditUser() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(dummyUserData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("User details saved successfully");
    navigate(`/users/${type}/${id}/view`);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(`/users/${type}/${id}/view`)}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Edit User</h1>
        </div>

        <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 from-white via-accent/10 to-muted/30">
          <CardHeader className="pb-0">
           
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="focus:ring-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="font-semibold">Department *</Label>
                  <Input
                    id="department"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    className="focus:ring-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="font-semibold">Role *</Label>
                  <Input
                    id="role"
                    placeholder="Enter role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    className="focus:ring-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="focus:ring-accent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-semibold">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="focus:ring-accent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/40">
                <div>
                  <Label htmlFor="status" className="font-semibold">Active Status</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable or disable user account
                  </div>
                </div>
                <Switch
                  id="status"
                  checked={formData.status}
                  onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                  className="data-[state=checked]:bg-accent"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/users/${type}/${id}/view`)}
                  className="border-accent text-accent hover:bg-accent/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
