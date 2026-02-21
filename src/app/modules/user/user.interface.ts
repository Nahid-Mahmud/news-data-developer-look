export enum UserRole {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT",
  MODERATOR = "MODERATOR",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  authOptions: IAuthProvider[];
  isVerified?: boolean;
  isDeleted: boolean;
  role: UserRole;
  isActive: IsActive;
  phoneNumber?: string;
  discordId?: string;
  profilePicture?: string;
  uid: string;
  address?: string;
  bio: string;
  experience?: string;
  skills?: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
  };
}
