import rateLimit from "express-rate-limit";
import { Config } from "../types/config-types";

const limiter = (config: Config) =>
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: config.rateLimitRequestsPerMinute,
    message: "Too many requests from this IP, please try again later.",
  });

export default limiter;
