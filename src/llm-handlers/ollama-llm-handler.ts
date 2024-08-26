import { config } from "..";
import { ChatMessage } from "../types/chat-types";
import { LLMHandler, LLMResponse } from "../types/llm-handler-types";
import { convertWebStreamToNodeStream } from "../utils/stream-utils";
import { LLM_PARAMETERS } from "./constants";
import { toCustomError } from "./llm-handler-utils";

export class OllamaLlmHandler implements LLMHandler {
  model: string;
  endpoint: string;

  constructor(model: string, endpoint: string) {
    this.model = model;
    this.endpoint = endpoint;
  }

  async chatCompletion(messages: ChatMessage[]): Promise<LLMResponse> {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "x-api-key": config.ollamaApiKey,
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          options: { temperature: LLM_PARAMETERS.temperature },
          stream: LLM_PARAMETERS.stream,
        }),
      });

      if (response.status !== 200) {
        const customError = await toCustomError(response);
        return customError;
      }

      if (!response.body) {
        throw new Error(`Empty response body from Ollama LLM`);
      }

      return {
        status: response.status,
        error: undefined,
        stream: convertWebStreamToNodeStream(response.body),
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to call Ollama LLM`);
    }
  }
}
