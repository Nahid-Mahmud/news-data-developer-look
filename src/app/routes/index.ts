import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";

import { otpRoutes } from "../modules/otp/otp.routes";
import { userRoutes } from "../modules/user/user.route";
import { newsDataRoutes } from "../modules/newsData/newsData.route";

export const router = Router();

interface IModuleRoute {
  path: string;
  route: Router;
}

const moduleRoutes: IModuleRoute[] = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/otp",
    route: otpRoutes,
  },
  {
    path: "/news-data",
    route: newsDataRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
