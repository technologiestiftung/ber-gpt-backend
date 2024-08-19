import { LLMParameters } from "../llm-handlers/constants";

export enum ModelProvider {
  OpenAI = "OpenAI",
  Azure = "Azure",
}

export interface Model {
  identifier: string;
  name: string;
  provider: ModelProvider;
  isGdprCompliant: boolean;
  contextSize: number;
}

export interface ModelResponse {
  models: Model[];
  parameters: LLMParameters;
}
