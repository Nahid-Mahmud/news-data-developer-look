import z from "zod";
import { IsActive, UserRole } from "./user.interface";

export const passwordZodValidationSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, {
    message: "Password must contain at least one number",
  })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });

export const userCreateZodSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email format").min(1, "Email is required"),
  password: passwordZodValidationSchema,
  role: z.enum([UserRole.STUDENT, UserRole.INSTRUCTOR]).optional(),
});

export const updateUserZodSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.email("Invalid email format").optional(),
  role: z.enum(Object.values(UserRole)).optional(),
  profilePicture: z.string().optional(),
  deletedFiles: z.array(z.string()).optional(),
  bio: z.string().optional(),
  isActive: z.enum(IsActive).optional(),
  isDeleted: z.boolean().optional(),
  phoneNumber: z.string().optional(),
  discordId: z.string().optional(),
  address: z.string().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).optional(),
  socialLinks: z
    .object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      github: z.string().optional(),
    })
    .optional(),
});
