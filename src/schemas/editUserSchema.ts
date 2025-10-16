import { z } from "zod";

export const editUserSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+1 \(\d{3}\) \d{3}-\d{4}$/, "Phone must be in format: +1 (XXX) XXX-XXXX"),
  role: z.enum(["DRIVER", "POLICE", "EMT", "FIRE", "INSURANCE", "WRECKER"], {
    required_error: "Role is required",
  }),
  profile_image: z.any().optional(),
  isActive: z.boolean().default(true),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

export const validateImageFile = (file: File) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Please select a valid image file (JPG, PNG, WEBP)');
  }
  
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB');
  }
  
  return true;
};