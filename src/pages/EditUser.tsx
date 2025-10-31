import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Upload, Trash2, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { editUserSchema, type EditUserFormData, validateImageFile } from "@/schemas/editUserSchema";

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

const roleOptions = [
  { value: "DRIVER", label: "App User" },
  { value: "POLICE", label: "Police Officer" },
  { value: "EMT", label: "EMT Personnel" },
  { value: "FIRE", label: "Fire Department" },
  { value: "INSURANCE", label: "Insurance Agent" },
  { value: "WRECKER", label: "Wrecker Service" },
];

export default function EditUser() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  const nameValue = watch("name") || "";
  const isActiveValue = watch("isActive");

  // Store original role from API
  const [originalRole, setOriginalRole] = useState<string>("");

  // Fetch user data
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

  // Set form values when data is loaded
  useEffect(() => {
    if (data?.user) {
      const user = data.user;
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone);
      setValue('isActive', user.isActive);
      setOriginalRole(user.role); // Store original role
    }
  }, [data, setValue]);

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (formData: EditUserFormData) => {
      const payload = {
        userId: id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: originalRole, // Use original role from API
        isActive: formData.isActive,
      };

      const response = await fetch(`${API_URL}/web/v1/auth/users`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update user');
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("User updated successfully!", { description:  `${nameValue} has been updated.` });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      navigate(`/users/${type}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setSelectedImage(file);
      setValue("profile_image", file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid image file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setValue("profile_image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        const formatted = `+1 ${match[1] ? `(${match[1]}` : ''}${match[1] && match[1].length === 3 ? ') ' : ''}${match[2]}${match[2] && match[3] ? '-' : ''}${match[3]}`;
        return formatted.replace(/\+1 $/, '+1 ');
      }
    }
    return value;
  };

  const onSubmit = (formData: EditUserFormData) => {
    updateUserMutation.mutate(formData);
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
          <h1 className="text-2xl font-bold">Edit User</h1>
        </div>

        <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 from-white via-accent/10 to-muted/30">
          {/* <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-accent/5 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Edit User Profile
            </CardTitle>
          </CardHeader> */}
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Profile Section */}
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-28 w-28 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-dashed border-primary/30 flex items-center justify-center shadow-inner">
                      {nameValue ? (
                        <span className="text-2xl font-bold text-primary">
                          {nameValue.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <User className="h-10 w-10 text-primary/50" />
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="profile-image"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2 hover:bg-primary/5"
                  >
                    <Upload className="h-4 w-4" />
                    {imagePreview ? "Change Photo" : "Upload Photo"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WEBP • Max 5MB
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    {...register("name")}
                    className={`h-11 transition-all ${errors.name ? "border-destructive focus:border-destructive" : "focus:border-primary"}`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    {...register("email")}
                    className={`h-11 transition-all ${errors.email ? "border-destructive focus:border-destructive" : "focus:border-primary"}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    {...register("phone")}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      setValue("phone", formatted);
                    }}
                    className={`h-11 transition-all ${errors.phone ? "border-destructive focus:border-destructive" : "focus:border-primary"}`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <X className="h-3 w-3" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Active Status */}
              <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl p-6 border border-muted">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="isActive" className="text-base font-semibold flex items-center gap-2">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Account Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {isActiveValue ? "Account is currently active" : "Account is currently inactive"}
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={isActiveValue}
                    onCheckedChange={(checked) => setValue("isActive", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/users/${type}/${id}/view`)}
                  disabled={updateUserMutation.isPending}
                  className="gap-2 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                >
                  <Save className="h-4 w-4" />
                  {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
