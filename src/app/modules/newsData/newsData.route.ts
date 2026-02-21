import { Router } from "express";
import { newsDataController } from "./newsData.controller";

const router = Router();

router.get("/", newsDataController.getNewsData);
router.get("/fetch", newsDataController.fetchNews);
router.get("/categories", newsDataController.getUniqueCategories);
router.get("/authors", newsDataController.getUniqueAuthors);
router.get("/languages", newsDataController.getUniqueLanguages);
router.get("/countries", newsDataController.getUniqueCountries);
router.get("/datatypes", newsDataController.getUniqueDatatypes);

export const newsDataRoutes = router;
