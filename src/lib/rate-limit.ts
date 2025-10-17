import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialize Redis if environment variables are available
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

// Create rate limiters for different actions (only if Redis is available)
export const rateLimiters = redis
  ? {
      // General API rate limiting
      api: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "1 m"),
        analytics: true,
      }),

      // Search rate limiting
      search: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(50, "1 m"),
        analytics: true,
      }),

      // Vote rate limiting
      vote: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, "1 m"),
        analytics: true,
      }),

      // Submission rate limiting
      submit: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        analytics: true,
      }),
    }
  : null;

export async function checkRateLimit(
  identifier: string,
  type: "api" | "search" | "vote" | "submit"
) {
  // If Redis is not configured, allow all requests
  if (!redis || !rateLimiters) {
    return {
      success: true,
      limit: 1000,
      reset: Date.now() + 60000,
      remaining: 999,
    };
  }

  const { success, limit, reset, remaining } =
    await rateLimiters[type].limit(identifier);

  return {
    success,
    limit,
    reset,
    remaining,
  };
}
