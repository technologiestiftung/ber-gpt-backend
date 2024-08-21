import { LLMParameters } from "../llm-handlers/constants";

export enum ModelProvider {
  OpenAI = "OpenAI",
  Azure = "Azure",
  Ollama = "Ollama",
}

export interface Model {
  identifier: string;
  baseModelName: string;
  provider: ModelProvider;
  isGdprCompliant: boolean;
  contextSize: number;
}

export interface ModelResponse {
  models: Model[];
  parameters: LLMParameters;
}
