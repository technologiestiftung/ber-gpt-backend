import { LLMHandler } from "../types/llm-handler-types";
import { OpenAILLMHandler } from "./openai-handler";
import { AzureLLMHandler } from "./azure-llm-handler";
import { config } from "..";

export type LLMType =
  | "openai-gpt-3.5-turbo"
  | "openai-gpt-4o-mini"
  | "openai-gpt-4o"
  | "azure-gpt-3.5-turbo"
  | "azure-gpt-4o-mini";

export const getLlmHandler = (llmType: LLMType): LLMHandler => {
  switch (llmType) {
    case "openai-gpt-3.5-turbo":
      return new OpenAILLMHandler("gpt-3.5-turbo", config.openAiEndpoint);
    case "openai-gpt-4o-mini":
      return new OpenAILLMHandler("gpt-4o-mini", config.openAiEndpoint);
    case "openai-gpt-4o":
      return new OpenAILLMHandler("gpt-4o", config.openAiEndpoint);
    case "azure-gpt-3.5-turbo":
      return new AzureLLMHandler(
        "gpt-3.5-turbo",
        config.azureLlmEndpointGpt35Turbo
      );
    case "azure-gpt-4o-mini":
      return new AzureLLMHandler(
        "gpt-4o-mini",
        config.azureLlmEndpointGpt4oMini
      );
    // Fallback to Azure LLM handler if the LLM type is not recognized
    default:
      return new AzureLLMHandler(
        "gpt-4o-mini",
        config.azureLlmEndpointGpt4oMini
      );
  }
};
