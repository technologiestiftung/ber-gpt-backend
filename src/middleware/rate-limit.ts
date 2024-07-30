import rateLimit from "express-rate-limit";
import { Config } from "../types/config-types";

const limiter = (config: Config) =>
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: config.rateLimitRequestsPerMinute,
    message: "API rate limit exceeded, please try again after one minute.",
    handler: function (req, res) {
      res.status(429).json({
        message: "API rate limit exceeded, please try again after one minute.",
        code: "api_rate_limit_exceeded",
        status: 429,
      });
    },
  });

export default limiter;
