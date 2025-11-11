import { z } from "zod";

export const insuranceCompanySchema = z.object({
  companyName: z.string().min(1, "Company name is required").min(2, "Company name must be at least 2 characters"),
  websiteUrl: z.string().min(1, "Website URL is required").url("Please enter a valid URL"),
  supportPhone: z.string()
    .min(1, "Support phone is required")
    .regex(/^\+?[\d\s\-\(\)]{10,15}$/, "Phone must be 10-15 digits with optional country code"),
  officeAddress: z.string().min(1, "Office address is required").min(10, "Address must be at least 10 characters"),
  isActive: z.boolean().default(true),
  contactPersonName: z.string().optional(),
  contactEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  establishedYear: z.number()
    .min(1800, "Year must be after 1800")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional(),
  policyCoverageType: z.enum(["COMPREHENSIVE", "THIRD_PARTY", "PERSONAL_ACCIDENT"]).optional(),
  licenseNumber: z.string().optional(),
  description: z.string().optional(),
  logo: z.any().optional(),
  logoUrl: z.string().optional(),
});

export type InsuranceCompanyFormData = z.infer<typeof insuranceCompanySchema>;

export const validateLogoFile = (file: File) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Please select a valid image file (JPG, PNG, WEBP)');
  }
  
  if (file.size > maxSize) {
    throw new Error('Logo size must be less than 5MB');
  }
  
  return true;
};