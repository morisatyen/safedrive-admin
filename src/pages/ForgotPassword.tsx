import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
interface ApiError {
  message: string;
  status?: number;
}
// 🔧 API call function
async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/web/v1/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Something went wrong");
  return data;
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@ranucle.com");



  const mutation = useMutation<void, ApiError, { email: string }>({
  mutationFn: async ({ email }) => {
    const res = await fetch(`${API_URL}/web/v1/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw { message: errorData.message || "Request failed", status: res.status };
    }
  },

  onSuccess: () => {
    toast.success("Verification email sent successfully",{description: "Please check your email for the password reset link."});
    navigate("/reset-link-sent");
  },

  onError: (error) => {
    toast.error(error.message || "Something went wrong");
  },
});
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    mutation.mutate({email});
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-fit">
            <img
              src="/Logo.png"
              alt="SafeDrive Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 xl:h-32 xl:w-32 object-contain"
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Forgot Password</CardTitle>
            <CardDescription className="text-base mt-2">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@safedrive.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {mutation.isPending ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/login")}
                className="text-sm"
              >
                Back to Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
