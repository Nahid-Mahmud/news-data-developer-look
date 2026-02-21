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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUniqueAuthors = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const authors = await newsDataService.getUniqueAuthors();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Unique authors retrieved successfully",
    data: authors,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUniqueLanguages = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const languages = await newsDataService.getUniqueLanguages();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Unique languages retrieved successfully",
    data: languages,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUniqueCountries = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const countries = await newsDataService.getUniqueCountries();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Unique countries retrieved successfully",
    data: countries,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUniqueDatatypes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const datatypes = await newsDataService.getUniqueDatatypes();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Unique datatypes retrieved successfully",
    data: datatypes,
  });
});

export const newsDataController = {
  getNewsData,
  fetchNews,
  getUniqueCategories,
  getUniqueAuthors,
  getUniqueLanguages,
  getUniqueCountries,
  getUniqueDatatypes,
};
