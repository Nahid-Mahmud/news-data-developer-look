import { uploadFileToCloudinary } from "../config/cloudinary.config";

type UploadResult = Record<string, string>;

export const handleMultipleFieldFileUploads = async (
  files: Record<string, Express.Multer.File[]> | undefined,
  rootpath: string
): Promise<UploadResult> => {
  const result: UploadResult = {};

  const configs = files
    ? (Object.values(files).flat() as Express.Multer.File[]).map((file: Express.Multer.File) => ({
        fieldName: file.fieldname,
        folder: `${rootpath}/${file.fieldname}`,
        required: true,
      }))
    : [];

  if (!files || typeof files !== "object" || Array.isArray(files)) {
    // Check for required files
    const missingRequired = configs.filter((config) => config.required);
    if (missingRequired.length > 0) {
      throw new Error(`Required files missing: ${missingRequired.map((c) => c.fieldName).join(", ")}`);
    }
    return result;
  }

  // Process each file configuration
  const uploadPromises = configs.map(async (config) => {
    const { fieldName, folder, required } = config;

    if (files[fieldName] && files[fieldName][0]) {
      try {
        const uploadResult = await uploadFileToCloudinary(files[fieldName][0], folder);
        result[fieldName] = uploadResult.secure_url;
      } catch (error) {
        throw new Error(`Failed to upload ${fieldName}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    } else if (required) {
      throw new Error(`Required file '${fieldName}' is missing`);
    }
  });

  await Promise.all(uploadPromises);

  return result;
};

export const handleSingleFileUpload = async (
  file: Express.Multer.File | undefined,
  folder: string
): Promise<string> => {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const uploadResult = await uploadFileToCloudinary(file, folder);
    return uploadResult.secure_url;
  } catch (error) {
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

export const handleMultipleFileUpload = async (
  files: Express.Multer.File[] | undefined,
  folder: string
): Promise<string[]> => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return [];
  }

  try {
    // Upload all files in parallel
    const uploadPromises = files.map((file) => uploadFileToCloudinary(file, folder));
    const uploadResults = await Promise.all(uploadPromises);

    // Return array of secure URLs
    return uploadResults.map((result) => result.secure_url);
  } catch (error) {
    throw new Error(`Failed to upload files: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
