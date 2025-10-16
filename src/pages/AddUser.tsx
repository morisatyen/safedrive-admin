import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AddUserForm } from "@/components/forms/AddUserForm";

const userTypeTitle: Record<string, string> = {
  police: "Police User",
  emt: "EMT User",
  fire: "Fire User",
  wrecker: "Wrecker User",
  insurance: "Insurance User",
  driver: "App User",
};

const roleMapping: Record<string, string> = {
  police: "POLICE",
  emt: "EMT",
  fire: "FIRE",
  wrecker: "WRECKER",
  insurance: "INSURANCE",
  driver: "DRIVER",
};

export default function AddUser() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const userType = userTypeTitle[type as string] || "User";
  const role = roleMapping[type as string] || "USER";

  const handleCancel = () => {
    navigate(`/users/${type}`);
  };

  const handleSuccess = () => {
    navigate(`/users/${type}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCancel}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Add New {userType}</h1>
        </div>

        <AddUserForm
          role={role}
          userType={userType}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>
    </MainLayout>
  );
}
