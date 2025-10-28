import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Upload, Trash2, Save, Building2 } from "lucide-react";
import { toast } from "sonner";
import { insuranceCompanySchema, type InsuranceCompanyFormData, validateLogoFile } from "@/schemas/insuranceCompanySchema";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';



const coverageOptions = [
  { value: "COMPREHENSIVE", label: "Comprehensive" },
  { value: "THIRD_PARTY", label: "Third Party" },
  { value: "PERSONAL_ACCIDENT", label: "Personal Accident" },
];

export default function AddInsuranceCompany() {
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InsuranceCompanyFormData>({
    resolver: zodResolver(insuranceCompanySchema),
    defaultValues: {
      isActive: true,
    },
  });

  const companyNameValue = watch("companyName") || "";
  const isActiveValue = watch("isActive");
  const coverageValue = watch("policyCoverageType");

  const createCompanyMutation = useMutation({
    mutationFn: async (formData: InsuranceCompanyFormData) => {
      const payload = {
        companyName: formData.companyName,
        websiteUrl: formData.websiteUrl,
        supportPhone: formData.supportPhone,
        officeAddress: formData.officeAddress,
        isActive: formData.isActive,
        contactPersonName: formData.contactPersonName || null,
        contactEmail: formData.contactEmail || null,
        establishedYear: formData.establishedYear || null,
        policyCoverageType: formData.policyCoverageType || null,
        licenseNumber: formData.licenseNumber || null,
        description: formData.description || null,
      };

      const response = await fetch(`${API_URL}/web/v1/auth/insurance-companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await response.json();      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to create insurance company');
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Insurance company created successfully!");
      navigate("/insurance-companies");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create insurance company");
    },
  });

  const handleLogoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateLogoFile(file);
      setSelectedLogo(file);
      setValue("logo", file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid logo file");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = () => {
    setSelectedLogo(null);
    setLogoPreview(null);
    setValue("logo", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        return `${match[1]}${match[1] && match[2] ? '-' : ''}${match[2]}${match[2] && match[3] ? '-' : ''}${match[3]}`;
      }
    }
    return value;
  };

  const onSubmit = (formData: InsuranceCompanyFormData) => {
    createCompanyMutation.mutate(formData);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/insurance-companies")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Add Insurance Company</h1>
        </div>

        <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 from-white via-accent/10 to-muted/30">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
              {/* <Building2 className="h-6 w-6" />
              New Insurance Company */}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Logo & Basic Info */}
                <div className="space-y-6">
                  {/* Logo Section */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Company Logo</Label>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        {logoPreview ? (
                          <div className="relative">
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="h-32 w-32 rounded-lg object-cover border-4 border-primary/20"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center shadow-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-32 w-32 rounded-lg bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
                            {companyNameValue ? (
                              <span className="text-2xl font-semibold text-primary">
                                {companyNameValue.charAt(0).toUpperCase()}
                              </span>
                            ) : (
                              <Building2 className="h-12 w-12 text-primary/50" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="w-full">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoSelect}
                          className="hidden"
                          id="company-logo"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {logoPreview ? "Change Logo" : "Upload Logo"}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          JPG, PNG, WEBP up to 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      Company Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Enter company name"
                      {...register("companyName")}
                      className={errors.companyName ? "border-destructive" : ""}
                    />
                    {errors.companyName && (
                      <p className="text-sm text-destructive">{errors.companyName.message}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
                    <div>
                      <Label htmlFor="isActive" className="font-medium">
                        Active Status
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable or disable company
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={isActiveValue}
                      onCheckedChange={(checked) => setValue("isActive", checked)}
                    />
                  </div>
                </div>

                {/* Right Column - Contact Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">
                      Website URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="websiteUrl"
                      placeholder="https://company.com"
                      {...register("websiteUrl")}
                      className={errors.websiteUrl ? "border-destructive" : ""}
                    />
                    {errors.websiteUrl && (
                      <p className="text-sm text-destructive">{errors.websiteUrl.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportPhone">
                      Support Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="supportPhone"
                      placeholder="+1-555-123-4567"
                      {...register("supportPhone")}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        setValue("supportPhone", formatted);
                      }}
                      className={errors.supportPhone ? "border-destructive" : ""}
                    />
                    {errors.supportPhone && (
                      <p className="text-sm text-destructive">{errors.supportPhone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="officeAddress">
                      Office Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="officeAddress"
                      placeholder="Enter complete office address"
                      rows={3}
                      {...register("officeAddress")}
                      className={errors.officeAddress ? "border-destructive" : ""}
                    />
                    {errors.officeAddress && (
                      <p className="text-sm text-destructive">{errors.officeAddress.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information - Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="additional-info">
                  <AccordionTrigger className="text-base font-semibold">
                    Additional Information (Optional)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactPersonName">Contact Person Name</Label>
                        <Input
                          id="contactPersonName"
                          placeholder="Enter contact person name"
                          {...register("contactPersonName")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="contact@company.com"
                          {...register("contactEmail")}
                          className={errors.contactEmail ? "border-destructive" : ""}
                        />
                        {errors.contactEmail && (
                          <p className="text-sm text-destructive">{errors.contactEmail.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="establishedYear">Established Year</Label>
                        <Input
                          id="establishedYear"
                          type="number"
                          placeholder="2020"
                          {...register("establishedYear", { valueAsNumber: true })}
                          className={errors.establishedYear ? "border-destructive" : ""}
                        />
                        {errors.establishedYear && (
                          <p className="text-sm text-destructive">{errors.establishedYear.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="policyCoverageType">Policy Coverage Type</Label>
                        <Select
                          value={coverageValue}
                          onValueChange={(value) => setValue("policyCoverageType", value as InsuranceCompanyFormData['policyCoverageType'])}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select coverage type" />
                          </SelectTrigger>
                          <SelectContent>
                            {coverageOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="licenseNumber">License / Registration Number</Label>
                        <Input
                          id="licenseNumber"
                          placeholder="Enter license or registration number"
                          {...register("licenseNumber")}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter company description"
                          rows={3}
                          {...register("description")}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/insurance-companies")}
                  disabled={createCompanyMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createCompanyMutation.isPending}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createCompanyMutation.isPending ? "Creating..." : "Create Company"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}