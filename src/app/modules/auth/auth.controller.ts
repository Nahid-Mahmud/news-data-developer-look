/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { generateAuthTokens } from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import envVariables from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = (await authService.credentialLogin(req, res, next)) as Partial<IUser>;

  const authTokens = generateAuthTokens(result as Partial<IUser>);

  setAuthCookie(res, {
    accessToken: authTokens.accessToken,
    refreshToken: authTokens.refreshToken,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      ...result,
      accessToken: authTokens.accessToken,
      refreshToken: authTokens.refreshToken,
    },
  });
});

const generateAccessTokenFromRefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  const response = await authService.generateAccessTokenFromRefreshToken(refreshToken);

  setAuthCookie(res, {
    accessToken: response,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Access token generated successfully",
    data: {
      accessToken: response,
    },
  });
});

const logout = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    success: true,
    message: "User logged out successfully",
    statusCode: 200,
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const token = req.query.token as string;
  const id = req.query.id as string;

  if (!id) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User ID is required");
  }

  if (!token) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Reset token is required");
  }

  const { newPassword } = req.body;

  await authService.resetPassword(token, id, newPassword);

  sendResponse(res, {
    success: true,
    message: "Password reset successfully",
    statusCode: StatusCodes.OK,
    data: null,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const decodedToken = req.user;

  const { oldPassword, newPassword } = req.body;

  await authService.changePassword(oldPassword, newPassword, decodedToken as JwtPayload);

  sendResponse(res, {
    success: true,
    message: "Password reset successfully",
    statusCode: StatusCodes.OK,
    data: null,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email is required");
  }

  // Call the service to handle forgot password logic
  await authService.forgotPassword(email);

  sendResponse(res, {
    success: true,
    message: "Password reset email sent successfully",
    statusCode: StatusCodes.OK,
    data: null,
  });
});

const verifyAccount = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const token = req.query.token as string;

  if (!token) {
    return res.redirect(envVariables.FRONTEND_URL + `/verify-account?status=missing_token`);
  }

  const response: {
    success: boolean;
    message: string;
  } = await authService.verifyAccount(token);

  if (!response.success) {
    if (response.message === "User already verified") {
      return res.redirect(envVariables.FRONTEND_URL + `/verify-account?status=duplicate_request`);
    }

    if (response.message === "Invalid or expired token") {
      return res.redirect(envVariables.FRONTEND_URL + `/verify-account?status=invalid_token`);
    }

    if (response.message === "User not found") {
      return res.redirect(envVariables.FRONTEND_URL + `/verify-account?status=user_not_found`);
    }

    return res.redirect(envVariables.FRONTEND_URL + `/verify-account?status=false`);
  }

  return res.redirect(envVariables.FRONTEND_URL + `/verify-account?status=success`);
});

export const authController = {
  credentialLogin,
  generateAccessTokenFromRefreshToken,
  logout,
  resetPassword,
  changePassword,
  forgotPassword,
  verifyAccount,
};
