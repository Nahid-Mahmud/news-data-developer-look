import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { resetPasswordZodSchema, userLoginJodValidation } from "./auth.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import createRateLimiter from "../../middlewares/limiter";

const router = Router();

router.post("/login", validateRequest(userLoginJodValidation), authController.credentialLogin);
router.post("/refresh-token", authController.generateAccessTokenFromRefreshToken);
router.post("/logout", authController.logout);

router.patch("/reset-password", validateRequest(resetPasswordZodSchema), authController.resetPassword);

router.patch("/change-password", checkAuth(...Object.values(UserRole)), authController.changePassword);

router.post(
  "/forgot-password",
  createRateLimiter({
    windowMs: 1000 * 60 * 3, // 3 minutes
    max: 3,
    message: "Too many requests, please wait 3 minutes and try again.",
  }),
  authController.forgotPassword
);

router.get("/verify-account", authController.verifyAccount);

export const authRoutes = router;
