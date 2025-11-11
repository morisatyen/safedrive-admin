import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Building2, Globe, Phone, MapPin, User, Mail, Calendar, Shield, FileText, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface InsuranceCompanyData {
  id: string;
  companyName: string;
  websiteUrl: string;
  supportPhone: string;
  officeAddress: string;
  isActive: boolean;
  contactPersonName?: string;
  contactEmail?: string;
  establishedYear?: number;
  policyCoverageType?: string;
  licenseNumber?: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: InsuranceCompanyData;
}

const coverageDisplayMap: Record<string, string> = {
  "COMPREHENSIVE": "Comprehensive Coverage",
  "THIRD_PARTY": "Third Party Coverage",
  "PERSONAL_ACCIDENT": "Personal Accident Coverage",
};

export default function ViewInsuranceCompany() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['insurance-company', id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/web/v1/auth/insurance-companies/${id}`, {
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch insurance company');
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
            <p className="text-muted-foreground">Loading company details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !data?.data) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load company details</p>
            <Button onClick={() => navigate("/insurance-companies")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const company = data.data;

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/insurance-companies")}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Company Details</h1>
          </div>
          <Button
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => navigate(`/insurance-companies/${id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Edit Company
          </Button>
        </div>

        <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 from-white via-accent/10 to-muted/30">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>{company.companyName}</span>
              <Badge className={getStatusColor(company.isActive)}>
                {company.isActive ? "Active" : "Inactive"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Company Profile Section */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Company Logo */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={`${company.companyName} logo`}
                      className="h-32 w-32 rounded-lg border-4 border-primary/20 object-cover"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-lg bg-primary/10 border-4 border-primary/20 flex items-center justify-center">
                      <span className="text-4xl font-semibold text-primary">
                        {company.companyName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{company.companyName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {company.policyCoverageType ? coverageDisplayMap[company.policyCoverageType] || company.policyCoverageType : "Insurance Company"}
                  </p>
                </div>
              </div>

              {/* Company Details */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Website</div>
                    <a 
                      href={company.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-base font-medium text-primary hover:underline"
                    >
                      {company.websiteUrl}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-secondary/10">
                    <Phone className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Support Phone</div>
                    <div className="text-base font-medium">{company.supportPhone}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <div className="rounded-full p-2 bg-accent/10">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Office Address</div>
                    <div className="text-base font-medium">{company.officeAddress}</div>
                  </div>
                </div>

                {company.contactPersonName && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full p-2 bg-info/10">
                      <User className="h-5 w-5 text-info" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">Contact Person</div>
                      <div className="text-base font-medium">{company.contactPersonName}</div>
                    </div>
                  </div>
                )}

                {company.contactEmail && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full p-2 bg-warning/10">
                      <Mail className="h-5 w-5 text-warning" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">Contact Email</div>
                      <div className="text-base font-medium">{company.contactEmail}</div>
                    </div>
                  </div>
                )}

                {company.establishedYear && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full p-2 bg-success/10">
                      <Calendar className="h-5 w-5 text-success" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">Established Year</div>
                      <div className="text-base font-medium">{company.establishedYear}</div>
                    </div>
                  </div>
                )}

                {company.policyCoverageType && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full p-2 bg-purple-100">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">Coverage Type</div>
                      <div className="text-base font-medium">{coverageDisplayMap[company.policyCoverageType] || company.policyCoverageType}</div>
                    </div>
                  </div>
                )}

                {company.licenseNumber && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full p-2 bg-orange-100">
                      <Award className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">License Number</div>
                      <div className="text-base font-medium font-mono">{company.licenseNumber}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Created Date</div>
                    <div className="text-base font-medium">{format(new Date(company.createdAt), "MMM dd, yyyy")}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-green-100">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                    <div className="text-base font-medium">{format(new Date(company.updatedAt), "MMM dd, yyyy")}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Company ID</div>
                    <div className="text-base font-mono font-medium">{company.id}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {company.description && (
              <div className="border-t pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="rounded-full p-2 bg-slate-100">
                    <FileText className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">Description</div>
                    <div className="text-base leading-relaxed">{company.description}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => navigate("/insurance-companies")}
                className="w-full"
              >
                Back to Companies List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}