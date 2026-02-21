import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { newsDataService } from "./newsData.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getNewsData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;
  const result = await newsDataService.getNewsData(query as Record<string, string>);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "News data retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchNews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const response = await newsDataService.fetchNews();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "News data fetched and stored successfully",
    data: response,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUniqueCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await newsDataService.getUniqueCategories();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Unique categories retrieved successfully",
    data: categories,
  });
});

export const newsDataController = {
  getNewsData,
  fetchNews,
  getUniqueCategories,
};
