/* eslint-disable no-console */
import Redis from "ioredis";
import envVariables from "./env";

export const redisClient = new Redis({
  username: envVariables.REDIS.REDIS_USERNAME,
  password: envVariables.REDIS.REDIS_PASSWORD,
  host: envVariables.REDIS.REDIS_HOST,
  port: Number(envVariables.REDIS.REDIS_PORT),
  maxRetriesPerRequest: null,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});
