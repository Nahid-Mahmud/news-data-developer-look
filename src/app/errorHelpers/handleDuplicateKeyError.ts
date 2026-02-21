/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleDuplicateKeyError = (err: any): TGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  const extractedValue = matchedArray && matchedArray[1] ? matchedArray[1] : "Value";

  return {
    statusCode: 409,
    message: `${extractedValue} already exists. Please provide a unique value.`,
  };
};
