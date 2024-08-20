import { Request, Response } from "express";
import { ModelProvider, ModelResponse } from "../types/model-types";
import { LLM_PARAMETERS } from "../llm-handlers/constants";

export const getModels = (req: Request, res: Response<ModelResponse>) => {
  res.json({
    models: [
      {
        identifier: "openai-gpt-3.5-turbo",
        baseModelName: "gpt-35-turbo-16k",
        provider: ModelProvider.OpenAI,
        isGdprCompliant: false,
        contextSize: 16000,
      },
      {
        identifier: "openai-gpt-4o-mini",
        baseModelName: "gpt-4o-mini",
        provider: ModelProvider.OpenAI,
        isGdprCompliant: false,
        contextSize: 128000,
      },
      {
        identifier: "openai-gpt-4o",
        baseModelName: "gpt-4o",
        provider: ModelProvider.OpenAI,
        isGdprCompliant: false,
        contextSize: 128000,
      },
      {
        identifier: "azure-gpt-3.5-turbo",
        baseModelName: "gpt-35-turbo-16k",
        provider: ModelProvider.Azure,
        isGdprCompliant: true,
        contextSize: 16000,
      },
      {
        identifier: "azure-gpt-4o-mini",
        baseModelName: "gpt-4o-mini",
        provider: ModelProvider.Azure,
        isGdprCompliant: true,
        contextSize: 128000,
      },
    ],
    parameters: LLM_PARAMETERS,
  });
};
