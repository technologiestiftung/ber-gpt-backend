import { LLMParameters } from "../llm-handlers/constants";
import { LLMIdentifier } from "../llm-handlers/resolve-llm-handler";

export enum ModelProvider {
  OpenAI = "OpenAI",
  Azure = "Azure",
  Ollama = "Ollama",
}

export interface ModelStatus {
  status: number;
  healthy: boolean;
  welcomeMessage: string | undefined;
  responseTimeMs: number | undefined;
}

export interface Model {
  identifier: LLMIdentifier;
  baseModelName: string;
  provider: ModelProvider;
  isGdprCompliant: boolean;
  contextSize: number;
  isOpenSource: boolean;
  serverLocation: string;
  description: string;
  status: ModelStatus;
}

export interface ModelResponse {
  models: Model[];
  parameters: LLMParameters;
}
