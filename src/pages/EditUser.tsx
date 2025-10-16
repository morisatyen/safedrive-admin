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
import { toast } from "sonner";
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
  const roleValue = watch("role");
  const isActiveValue = watch("isActive");

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
      setValue('role', user.role as EditUserFormData['role']);
      setValue('isActive', user.isActive);
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
        role: formData.role,
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
      toast.success("User updated successfully!");
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
          <CardHeader className="text-center pb-4">
            {/* <CardTitle className="text-2xl font-bold">Edit User</CardTitle> */}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Profile Image & Name */}
                <div className="space-y-6">
                  {/* Profile Image Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Profile Image</Label>
                    <div className="flex flex-col items-center space-y-4">
                      {/* Image Preview or Placeholder */}
                      <div className="relative">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Profile preview"
                              className="h-32 w-32 rounded-full object-cover border-4 border-primary/20"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center shadow-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-32 w-32 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
                            {nameValue ? (
                              <span className="text-3xl font-semibold text-primary">
                                {nameValue.charAt(0).toUpperCase()}
                              </span>
                            ) : (
                              <User className="h-12 w-12 text-primary/50" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* File Input */}
                      <div className="w-full">
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
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {imagePreview ? "Change Image" : "Upload Image"}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          JPG, PNG, WEBP up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      {...register("name")}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                </div>

                {/* Right Column - Other Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      {...register("email")}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
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
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">
                      Role <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={roleValue}
                      onValueChange={(value) => setValue("role", value as EditUserFormData['role'])}
                    >
                      <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-sm text-destructive">{errors.role.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Status - Full Width */}
              <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
                <div>
                  <Label htmlFor="isActive" className="font-medium">
                    Active Status
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable user account
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={isActiveValue}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/users/${type}/${id}/view`)}
                  disabled={updateUserMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Save className="h-4 w-4 mr-2" />
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
