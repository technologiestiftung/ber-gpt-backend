import { config } from "..";
import { SYSTEM_PROMPT } from "../fixtures/system-prompt";
import { ChatMessage } from "../types/chat-types";
import { LLMHandler, LLMResponse } from "../types/llm-handler-types";
import { convertWebStreamToNodeStream } from "../utils/stream-utils";
import { LLM_PARAMETERS } from "./constants";
import { toCustomError } from "./llm-handler-utils";

export class AzureLLMHandler implements LLMHandler {
  model: string;
  endpoint: string;

  constructor(model: string, endpoint: string) {
    this.model = model;
    this.endpoint = endpoint;
  }

  async chatCompletion(messages: ChatMessage[]): Promise<LLMResponse> {
    let endpoint = `${this.endpoint}&api-key=${config.azureLlmApiKey}`;

    const messagesWithSystemPromps = [
      { role: "system", content: SYSTEM_PROMPT },
    ].concat(messages);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesWithSystemPromps,
          temperature: LLM_PARAMETERS.temperature,
          stream: LLM_PARAMETERS.stream,
        }),
      });

      if (response.status !== 200) {
        const customError = await toCustomError(response);
        return customError;
      }

      if (!response.body) {
        throw new Error(`Empty response body from Azure LLM`);
      }

      return {
        status: response.status,
        error: undefined,
        stream: convertWebStreamToNodeStream(response.body),
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to call Azure LLM`);
    }
  }
}
