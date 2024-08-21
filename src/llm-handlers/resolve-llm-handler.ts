import { LLMHandler } from "../types/llm-handler-types";
import { OpenAILLMHandler } from "./openai-handler";
import { AzureLLMHandler } from "./azure-llm-handler";
import { config } from "..";
import { OllamaLlmHandler } from "./ollama-llm-handler";

export type LLMType =
  | "openai-gpt-4o-mini"
  | "azure-gpt-4o-mini"
  | "citylab-macstudio-llama-3.1";

export const resolveLlmHandler = (llmType: LLMType): LLMHandler => {
  switch (llmType) {
    case "openai-gpt-4o-mini":
      return new OpenAILLMHandler("gpt-4o-mini", config.openAiEndpoint);
    case "azure-gpt-4o-mini":
      return new AzureLLMHandler(
        "gpt-4o-mini",
        config.azureLlmEndpointGpt4oMini
      );
    case "citylab-macstudio-llama-3.1":
      return new OllamaLlmHandler("llama3", config.ollamaApiEndpoint);
    // Fallback to Azure LLM handler if the LLM type is not recognized
    default:
      return new AzureLLMHandler(
        "gpt-4o-mini",
        config.azureLlmEndpointGpt4oMini
      );
  }
};
