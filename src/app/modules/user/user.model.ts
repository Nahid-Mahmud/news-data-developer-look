import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, UserRole } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.STUDENT },
    isActive: { type: String, enum: Object.values(IsActive), default: IsActive.ACTIVE },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: String },
    phoneNumber: { type: String },
    discordId: { type: String },
    address: { type: String },
    authOptions: [authProviderSchema],
    uid: { type: String, required: true, unique: true, index: true },
    bio: { type: String },
    experience: { type: String },
    skills: [{ type: String }],
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
      github: { type: String },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = model<IUser>("User", userSchema);
export default User;
