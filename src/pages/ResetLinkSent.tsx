import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function ResetLinkSent() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md animate-fade-in text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-success" />
          </div>
          <CardTitle className="text-2xl font-bold">Password Reset Link Sent</CardTitle>
          <CardDescription>
            Password reset link sent successfully. Please check your email for further instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
