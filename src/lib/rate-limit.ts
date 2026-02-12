/**
 * Simple in-memory rate limiting
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  identifier?: string; // Custom identifier (defaults to IP)
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, identifier } = options;

  return async (req: Request): Promise<{ success: boolean; remaining: number; resetTime: number }> => {
    // Get identifier (IP address or custom)
    const id = identifier || req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 'unknown';

    const now = Date.now();
    const key = `${id}:${Math.floor(now / windowMs)}`;

    if (!store[key]) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    store[key].count += 1;

    if (store[key].count > maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetTime: store[key].resetTime,
      };
    }

    return {
      success: true,
      remaining: maxRequests - store[key].count,
      resetTime: store[key].resetTime,
    };
  };
}

// Pre-configured rate limiters
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
});

export const verificationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 verifications per hour
});

export const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 20, // 20 AI requests per hour
});
