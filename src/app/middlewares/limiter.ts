import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import sendResponse from "../utils/sendResponse";

const createRateLimiter = ({ windowMs, max, message }: { windowMs?: number; max?: number; message?: string }) => {
  return rateLimit({
    windowMs: windowMs || 15 * 60 * 1000, // 15 minutes
    max: max || 1000,
    message: message || "Too many requests from this IP, please try again later.",
    handler: (req: Request, res: Response) => {
      sendResponse(res, {
        statusCode: 429,
        message: message || "Too many requests from this IP, please try again later.",
        success: false,
        data: null,
      });
    },
  });
};

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: `Too many requests. Please wait until ${new Date(Date.now() + 15 * 60 * 1000).toISOString()}`,
});

export default createRateLimiter;
