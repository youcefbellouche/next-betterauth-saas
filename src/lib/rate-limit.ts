import { redis } from "./redis";

/**
 * A generic token-bucket rate limiter using Redis Lua scripting for atomicity.
 * 
 * @param key - The unique identifier for the limit (e.g. IP address, User ID)
 * @param maxTokens - The maximum capacity of the bucket (burst limit)
 * @param refillRate - How many tokens are added to the bucket per second
 * @param cost - How many tokens this specific operation costs (default: 1)
 * @returns Object indicating whether the request is allowed and remaining tokens
 */
export async function rateLimit(
  key: string,
  maxTokens: number,
  refillRate: number,
  cost: number = 1
): Promise<{ success: boolean; remaining: number }> {
  // Lua script to perform token bucket algorithm atomically.
  // We store two keys: the number of tokens, and the last time they were updated.
  const script = `
    local tokens_key = KEYS[1]
    local timestamp_key = KEYS[2]

    local max_tokens = tonumber(ARGV[1])
    local refill_rate = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])
    local cost = tonumber(ARGV[4])

    local tokens = tonumber(redis.call("GET", tokens_key))
    local last_refilled = tonumber(redis.call("GET", timestamp_key))

    -- Initialize if they don't exist
    if not tokens then
      tokens = max_tokens
    end
    if not last_refilled then
      last_refilled = now
    end

    -- Calculate how many tokens to add based on elapsed time
    local elapsed = math.max(0, now - last_refilled)
    local refilled_tokens = elapsed * refill_rate
    
    tokens = math.min(max_tokens, tokens + refilled_tokens)

    if tokens >= cost then
      -- Allow the request
      tokens = tokens - cost
      redis.call("SET", tokens_key, tokens)
      redis.call("SET", timestamp_key, now)
      return { 1, tokens }
    else
      -- Deny the request
      redis.call("SET", tokens_key, tokens)
      redis.call("SET", timestamp_key, now)
      return { 0, tokens }
    end
  `;

  const tokensKey = `ratelimit:${key}:tokens`;
  const timestampKey = `ratelimit:${key}:ts`;
  const now = Date.now() / 1000;

  try {
    // ioredis doesn't have a typed eval by default for our return structure,
    // so we cast it. The lua script returns an array of [1|0, remaining_tokens].
    const result = await redis.eval(
      script,
      2, // Number of KEYS
      tokensKey,
      timestampKey,
      maxTokens.toString(),
      refillRate.toString(),
      now.toString(),
      cost.toString()
    ) as [number, number];

    const success = result[0] === 1;
    const remaining = result[1];

    return { success, remaining };
  } catch (error) {
    console.error("Rate Limiter Error:", error);
    // Fail open in case Redis is down, or fail closed? Usually fail open is better for UX,
    // but fail closed is better for security. Given it's auth/billing, failing closed might be safer,
    // but returning true prevents blocking users if the cache server has a momentary blip.
    // Defaulting to true for now, but you can adjust based on strictness.
    return { success: true, remaining: 1 };
  }
}
