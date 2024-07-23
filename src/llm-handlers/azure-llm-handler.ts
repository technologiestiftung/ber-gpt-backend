import { config } from "..";
import { SYSTEM_PROMPT } from "../fixtures/system-prompt";
import { ChatMessage } from "../types/chat-types";
import { LLMHandler } from "../types/llm-handler-types";
import { convertWebStreamToNodeStream } from "../utils/stream-utils";

export class AzureLLMHandler implements LLMHandler {
  async chatCompletion(
    messages: ChatMessage[]
  ): Promise<NodeJS.ReadableStream> {
    let endpoint = `${config.azureLlmEndpoint}&api-key=${config.azureLlmApiKey}`;
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
          temperature: 0,
          stream: true,
        }),
      });

      if (!response.body) {
        throw new Error(`Failed to call Azure LLM`);
      }

      return convertWebStreamToNodeStream(response.body);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to call Azure LLM`);
    }
  }
}
