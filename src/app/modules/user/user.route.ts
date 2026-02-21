import { Router } from "express";
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserZodSchema, userCreateZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "./user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router();

// create user
router.post("/register", validateRequest(userCreateZodSchema), userControllers.createUser);

// get public instructor profile - must be before /:userId route
// Uses uid parameter instead of MongoDB _id
router.get("/public-profile/:uid", userControllers.getPublicInstructorProfile);

// update user
router.patch(
  "/:userId",
  checkAuth(...Object.values(UserRole)),
  multerUpload.single("file"),
  validateRequest(updateUserZodSchema),
  userControllers.updateUser
);

// get All Users
router.get("/get-all", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), userControllers.getAllUsers);

// get me route
router.get("/me", checkAuth(...Object.values(UserRole)), userControllers.getMe);

// get user by userID

router.get("/:userId", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), userControllers.getUserById);

export const userRoutes = router;
