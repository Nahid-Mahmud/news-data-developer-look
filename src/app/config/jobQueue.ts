import { Queue } from "bullmq";
import { redisClient } from "./redis.config";

export const jobQueue = new Queue("jobQueue", {
  connection: redisClient,
  defaultJobOptions: {
    removeOnComplete: true,
    attempts: 3,
    removeOnFail: true,
  },
});
