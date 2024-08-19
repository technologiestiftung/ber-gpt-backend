import { Request, Response } from "express";
import { ModelProvider, ModelResponse } from "../types/model-types";
import { LLM_PARAMETERS } from "../llm-handlers/constants";

export const getModels = (req: Request, res: Response<ModelResponse>) => {
  res.json({
    models: [
      {
        identifier: "azure",
        name: "gpt-35-turbo-16k",
        provider: ModelProvider.Azure,
        isGdprCompliant: true,
      },
      {
        identifier: "openai",
        name: "gpt-4o-mini",
        provider: ModelProvider.OpenAI,
        isGdprCompliant: false,
      },
    ],
    parameters: LLM_PARAMETERS,
  });
};
