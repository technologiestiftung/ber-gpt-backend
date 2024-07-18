import { Config } from "../types/config-types";

export function parseConfig(): Config {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY must be defined");
  }
  if (!process.env.RATE_LIMIT_REQUESTS_PER_MINUTE) {
    throw new Error("RATE_LIMIT_REQUESTS_PER_MINUTE must be defined");
  }
  if (!process.env.CORS_ALLOWED_ORIGIN) {
    throw new Error("CORS_ALLOWED_ORIGIN must be defined");
  }

  return {
    openAiApiKey: process.env.OPENAI_API_KEY,
    rateLimitRequestsPerMinute: parseInt(
      process.env.RATE_LIMIT_REQUESTS_PER_MINUTE!
    ),
    corsAllowedOrigin: process.env.CORS_ALLOWED_ORIGIN,
  } as Config;
}
