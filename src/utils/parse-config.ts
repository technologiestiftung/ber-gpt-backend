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
  if (!process.env.X_API_KEY) {
    throw new Error("X_API_KEY must be defined");
  }
  if (!process.env.AZURE_LLM_API_KEY) {
    throw new Error("AZURE_LLM_API_KEY must be defined");
  }
  if (!process.env.AZURE_LLM_ENDPOINT_GPT_35_TURBO) {
    throw new Error("AZURE_LLM_ENDPOINT_GPT_35_TURBO must be defined");
  }
  if (!process.env.AZURE_LLM_ENDPOINT_GPT_4O_MINI) {
    throw new Error("AZURE_LLM_ENDPOINT_GPT_4O_MINI must be defined");
  }
  if (!process.env.OPENAI_ENDPOINT) {
    throw new Error("OPENAI_ENDPOINT must be defined");
  }
  if (!process.env.OLLAMA_API_ENDPOINT) {
    throw new Error("OLLAMA_API_ENDPOINT must be defined");
  }
  if (!process.env.OLLAMA_API_KEY) {
    throw new Error("OLLAMA_API_KEY must be defined");
  }
  return {
    azureLlmApiKey: process.env.AZURE_LLM_API_KEY,
    azureLlmEndpointGpt35Turbo: process.env.AZURE_LLM_ENDPOINT_GPT_35_TURBO,
    azureLlmEndpointGpt4oMini: process.env.AZURE_LLM_ENDPOINT_GPT_4O_MINI,
    openAiEndpoint: process.env.OPENAI_ENDPOINT,
    openAiApiKey: process.env.OPENAI_API_KEY,
    ollamaApiEndpoint: process.env.OLLAMA_API_ENDPOINT,
    ollamaApiKey: process.env.OLLAMA_API_KEY,
    rateLimitRequestsPerMinute: parseInt(
      process.env.RATE_LIMIT_REQUESTS_PER_MINUTE!
    ),
    corsAllowedOrigin: process.env.CORS_ALLOWED_ORIGIN,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    xApiKey: process.env.X_API_KEY,
  } as Config;
}
