import { Router } from "express";
import { newsDataController } from "./newsData.controller";

const router = Router();

router.get("/", newsDataController.getNewsData);
router.get("/fetch", newsDataController.fetchNews);
router.get("/categories", newsDataController.getUniqueCategories);

export const newsDataRoutes = router;
