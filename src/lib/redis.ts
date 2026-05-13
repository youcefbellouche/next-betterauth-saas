import Redis from "ioredis";

// We use REDIS_URL because ioredis requires a raw TCP connection, 
// unlike @upstash/redis which uses the REST API.
const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  return "redis://localhost:6379";
};

// Global instance to prevent multiple connections in dev
const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(getRedisUrl(), {
    maxRetriesPerRequest: null,
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

/**
 * Basic Rate Limiter using Redis
 * @param key unique identifier (e.g., IP address or User ID)
 * @param limit maximum number of requests
 * @param windowInSeconds time window in seconds
 * @returns boolean indicating if the request is allowed
 */
export async function rateLimit(key: string, limit: number, windowInSeconds: number) {
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, windowInSeconds);
  }
  return current <= limit;
}

/**
 * Helper to cache data
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlInSeconds: number = 3600
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }
  const data = await fetcher();
  await redis.set(key, JSON.stringify(data), "EX", ttlInSeconds);
  return data;
}
