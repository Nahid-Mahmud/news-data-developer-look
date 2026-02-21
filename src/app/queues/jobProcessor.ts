import { Worker } from "bullmq";
import { sendEmail } from "../utils/sendEmail";
import { redisClient } from "../config/redis.config";

export const jobWorker = new Worker(
  "jobQueue",
  async (job) => {
    // add 30 second delay
    await new Promise((resolve) => setTimeout(resolve, 30000));

    switch (job.name) {
      case "sendEmail":
        await sendEmail(job.data);
        break;
      case "sendInvoiceEmail":
        await sendEmail(job.data);
        break;
      default:
        // Unknown job type - silently ignore or throw error
        break;
    }
  },
  {
    connection: redisClient,
  }
);

// Error handling
jobWorker.on("error", (err) => {
  // Handle worker errors - you might want to use a proper logger here
  throw new Error(`Job Worker Error: ${err.message}`);
});

jobWorker.on("failed", (job, err) => {
  // Handle failed jobs - you might want to use a proper logger here
  throw new Error(`Job ${job?.id} failed: ${err.message}`);
});
