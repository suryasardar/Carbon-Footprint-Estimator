import crypto from "crypto";
import Redis from "ioredis";
import { env } from "../utils/env";

// Connect to your Redis server.
// Use environment variables for production.
const redis = new Redis({
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT) || 6379,
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

/**
 * Sets a value in the Redis cache.
 * @param key The cache key.
 * @param value The value to cache.
 * @param ttlSeconds The time-to-live in seconds (default: 1 hour).
 */
export async function setCache(key: string, value: any, ttlSeconds = 3600) {
  // JSON.stringify is necessary to store non-string values.
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

/**
 * Gets a value from the Redis cache.
 * @param key The cache key.
 * @returns The cached value or null if not found or expired.
 */
export async function getCache<T = any>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  if (!data) {
    return null;
  }
  // JSON.parse is necessary to restore the original data type.
  return JSON.parse(data) as T;
}

/**
 * Generates a consistent cache key for an image buffer.
 * @param buf The image buffer.
 * @returns A unique cache key string.
 */
export function imgCacheKey(buf: Buffer) {
  return "img:" + crypto.createHash("sha256").update(buf).digest("hex");
}