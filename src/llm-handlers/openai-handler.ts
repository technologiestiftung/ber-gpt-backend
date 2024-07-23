import { config } from "..";
import { ChatMessage } from "../types/chat-types";
import { LLMHandler } from "../types/llm-handler-types";
import { convertWebStreamToNodeStream } from "../utils/stream-utils";

export class OpenAILLMHandler implements LLMHandler {
  async chatCompletion(
    messages: ChatMessage[]
  ): Promise<NodeJS.ReadableStream> {
    let endpoint = config.openAiEndpoint;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openAiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: messages,
          temperature: 0,
          stream: true,
        }),
      });

      if (!response.body) {
        throw new Error(`Failed to call OpenAI LLM`);
      }

      return convertWebStreamToNodeStream(response.body);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to call OpenAI LLM`);
    }
  }
}
