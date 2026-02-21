/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { IUser } from "./user.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { userServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";
import { handleSingleFileUpload } from "../../utils/handleFileUploads";

// create user

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body as Partial<IUser>;
  const result = await userServices.createUser(payload);

  sendResponse(res, {
    success: true,
    message: "User created successfully.",
    data: result,
    statusCode: StatusCodes.CREATED,
  });
});

// update user

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const decodedToken = req.user;

  try {
    let profilePictureUrl = "";

    // Handle profile picture upload if provided
    if (req.file) {
      profilePictureUrl = await handleSingleFileUpload(req.file, "users/profiles");
    }

    // Prepare payload with uploaded profile picture URL
    const payload = {
      ...req.body,
      ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
    };

    const user = await userServices.updateUser(userId, payload, decodedToken as JwtPayload);

    sendResponse(res, {
      success: true,
      message: "User updated successfully",
      data: user,
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
});

// get all users
const getAllUsers = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const result = await userServices.getAllUsers(req.query as Record<string, string>);
  sendResponse(res, {
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    statusCode: StatusCodes.OK,
    meta: result.meta,
  });
});

const getMe = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;
  const user = await userServices.getMe(decodedToken.userId);
  sendResponse(res, {
    success: true,
    message: "User retrieved successfully",
    data: user,
    statusCode: StatusCodes.OK,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const userId = req.params.userId;
  const user = await userServices.getUserById(userId);
  sendResponse(res, {
    success: true,
    message: "User retrieved successfully",
    data: user,
    statusCode: StatusCodes.OK,
  });
});

const getPublicInstructorProfile = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const uid = req.params.uid;
  const user = await userServices.getPublicInstructorProfile(uid);
  sendResponse(res, {
    success: true,
    message: "Instructor profile retrieved successfully",
    data: user,
    statusCode: StatusCodes.OK,
  });
});

export const userControllers = {
  createUser,
  updateUser,
  getAllUsers,
  getMe,
  getUserById,
  getPublicInstructorProfile,
};
