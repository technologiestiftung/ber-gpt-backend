import { Request, Response } from "express";
import { ModelProvider, ModelResponse } from "../types/model-types";
import { LLM_PARAMETERS } from "../llm-handlers/constants";

export const getModels = (req: Request, res: Response<ModelResponse>) => {
  res.json({
    models: [
      {
        identifier: "openai-gpt-4o-mini",
        baseModelName: "gpt-4o-mini",
        provider: ModelProvider.OpenAI,
        isGdprCompliant: false,
        contextSize: 128000,
        isOpenSource: false,
        serverLocation: "USA",
      },
      {
        identifier: "azure-gpt-4o-mini",
        baseModelName: "gpt-4o-mini",
        provider: ModelProvider.Azure,
        isGdprCompliant: true,
        contextSize: 128000,
        isOpenSource: false,
        serverLocation: "Schweden",
      },
      {
        identifier: "citylab-macstudio-llama-3.1",
        baseModelName: "llama3.1",
        provider: ModelProvider.Ollama,
        isGdprCompliant: true,
        contextSize: 128000,
        isOpenSource: true,
        serverLocation: "Berlin",
      },
    ],
    parameters: LLM_PARAMETERS,
  });
};
