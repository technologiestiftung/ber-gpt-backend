import { LLMHandler } from "../types/llm-handler-types";
import { OpenAILLMHandler } from "./openai-handler";
import { AzureLLMHandler } from "./azure-llm-handler";

export type LLMType = "openai" | "azure";

export const getLlmHandler = (llmType: LLMType): LLMHandler => {
  switch (llmType) {
    case "openai":
      return new OpenAILLMHandler();
    case "azure":
      return new AzureLLMHandler();
    // Fallback to Azure LLM handler if the LLM type is not recognized
    default:
      return new AzureLLMHandler();
  }
};
