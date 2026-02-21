import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { hashPassword } from "./../../utils/hashPassword";
import { IAuthProvider, IUser, UserRole } from "./user.interface";
import User from "./user.model";
import generateUid from "../../utils/generateUid";
import { jobQueue } from "../../config/jobQueue";
import envVariables from "../../config/env";
import { deleteFileFormCloudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/queryBuilder";

// create user
const createUser = async (payload: Partial<IUser>) => {
  const { password, email, firstName, lastName } = payload;

  if (!password) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password is required");
  }

  if (!email) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email is required");
  }

  if (!firstName) {
    throw new AppError(StatusCodes.BAD_REQUEST, "First name is required");
  }

  if (!lastName) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Last name is required");
  }

  const session = await User.startSession();

  try {
    await session.startTransaction();

    const hashedPassword = await hashPassword(password);
    const getUid = generateUid();

    const authOptions: IAuthProvider = {
      provider: "credentials",
      providerId: email as string,
    };

    const user = await User.create(
      [
        {
          ...payload,
          authOptions: authOptions,
          uid: getUid,
          password: hashedPassword,
        },
      ],
      {
        session,
      }
    );

    // create a jwt token

    const token = jwt.sign({ email: user[0].email, role: user[0].role }, envVariables.VERIFY_ACCOUNT_SECRET, {
      // expiresIn: "1d",
    });

    if (user) {
      await jobQueue.add("sendEmail", {
        to: email,
        subject: "Verify your email",
        templateName: "verifyAccount.ejs",
        templateData: {
          verificationUrl: `${envVariables.BACKEND_URL}/api/v1/auth/verify-account?token=${token}`,
          userName: `${user[0].firstName} ${user[0].lastName}`,
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...rest } = user[0].toObject();

    await session.commitTransaction();
    return rest;
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error instanceof Error ? error.message : String(error));
  } finally {
    await session.endSession();
  }
};

// update user

const updateUser = async (
  userId: string,
  payload: Partial<IUser> & { deletedFiles?: string[] },
  decodedToken: JwtPayload
) => {
  if (
    decodedToken.role === UserRole.INSTRUCTOR ||
    decodedToken.role === UserRole.STUDENT ||
    decodedToken.role === UserRole.MODERATOR
  ) {
    if (userId !== decodedToken.userId) {
      throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission to update this user");
    }
  }

  // check if user exists

  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // role update validation

  if (decodedToken.role === UserRole.ADMIN && user.role === UserRole.SUPER_ADMIN) {
    throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission to update this user");
  }

  if (payload.role) {
    if (
      decodedToken.role === UserRole.INSTRUCTOR ||
      decodedToken.role === UserRole.STUDENT ||
      decodedToken.role === UserRole.MODERATOR
    ) {
      throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission to change user role");
    }
  }

  // isActive, isDeleted, isVerified update validation
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (
      decodedToken.role === UserRole.INSTRUCTOR ||
      decodedToken.role === UserRole.STUDENT ||
      decodedToken.role === UserRole.MODERATOR
    ) {
      throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission to change user status");
    }
  }

  // Only instructors can add experience, skills, and socialLinks
  if (payload.experience || payload.skills || payload.socialLinks) {
    if (decodedToken.role !== UserRole.INSTRUCTOR) {
      throw new AppError(StatusCodes.FORBIDDEN, "Only instructors can add experience, skills, and social links");
    }
  }

  const deleteFilePromises: Promise<void>[] = [];

  if (payload.deletedFiles && Array.isArray(payload.deletedFiles) && payload.deletedFiles.length > 0) {
    // delete files from cloudinary
    for (const fileUrl of payload.deletedFiles) {
      deleteFilePromises.push(deleteFileFormCloudinary(fileUrl));
    }
  }

  await Promise.all(deleteFilePromises);

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password");
  return updatedUser;
};

// get all users
const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find({}), query)
    .filter()
    .search(["name", "email"])
    .sort()
    .fields()
    .paginate();

  const users = await queryBuilder.modelQuery;
  const totalUsers = await queryBuilder.getMeta();
  return { data: users, meta: totalUsers };
};

// get logged-in user
const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password -isActive -isVerified");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  return user;
};

// get user by userID
const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  return user;
};

// get public instructor profile
const getPublicInstructorProfile = async (uid: string) => {
  const user = await User.findOne({ uid }).select(
    "firstName lastName profilePicture bio experience skills socialLinks role uid email"
  );
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "Instructor not found");
  }
  if (user.role !== UserRole.INSTRUCTOR) {
    throw new AppError(StatusCodes.FORBIDDEN, "User is not an instructor");
  }
  return user;
};

export const userServices = {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  getMe,
  getPublicInstructorProfile,
};
