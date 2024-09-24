import { Request, Response } from "express";
import { ModelProvider, ModelResponse } from "../types/model-types";
import { LLM_PARAMETERS } from "../llm-handlers/constants";
import { getLlmStatus } from "./status-controller";

export const getModels = async (req: Request, res: Response<ModelResponse>) => {
  const modelStatus = await getLlmStatus();

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
        description: "Aktuelles Modell von OpenAI, gehostet von OpenAI.",
        status: modelStatus["openai-gpt-4o-mini"],
      },
      {
        identifier: "azure-gpt-4o-mini",
        baseModelName: "gpt-4o-mini",
        provider: ModelProvider.Azure,
        isGdprCompliant: true,
        contextSize: 128000,
        isOpenSource: false,
        serverLocation: "Schweden",
        description:
          "Aktuelles Modell von OpenAI, datenschutzkonform gehostet von Microsoft Azure.",
        status: modelStatus["azure-gpt-4o-mini"],
      },
      {
        identifier: "citylab-macstudio-llama-3.1",
        baseModelName: "llama3.1",
        provider: ModelProvider.Ollama,
        isGdprCompliant: true,
        contextSize: 128000,
        isOpenSource: true,
        serverLocation: "Berlin",
        description:
          "Open Source - Modell von Meta, datenschutzkonform gehostet im CityLAB Berlin.",
        status: modelStatus["citylab-macstudio-llama-3.1"],
      },
    ],
    parameters: LLM_PARAMETERS,
  });
};
