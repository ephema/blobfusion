import { Request } from "express";
import { rateLimit } from "express-rate-limit";

import { logger } from "@/common/logger";
import { env } from "@/common/utils/envConfig";

const rateLimiter = rateLimit({
  legacyHeaders: true,
  limit: env.COMMON_RATE_LIMIT_MAX_REQUESTS ?? 100,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  windowMs: 5 * 60 * (env.COMMON_RATE_LIMIT_WINDOW_MS ?? 1000),
  keyGenerator,
});

function keyGenerator(request: Request): string {
  if (!request.ip) {
    logger.warn("Warning: request.ip is missing!");
    return request.socket.remoteAddress as string;
  }

  return request.ip.replace(/:\d+[^:]*$/, "");
}

export default rateLimiter;
