import { LLMParameters } from "../llm-handlers/constants";
import { LLMIdentifier } from "../llm-handlers/resolve-llm-handler";

export enum ModelProvider {
  OpenAI = "OpenAI",
  Azure = "Azure",
  Ollama = "Ollama",
}

export interface Model {
  identifier: LLMIdentifier;
  baseModelName: string;
  provider: ModelProvider;
  isGdprCompliant: boolean;
  contextSize: number;
}

export interface ModelResponse {
  models: Model[];
  parameters: LLMParameters;
}
