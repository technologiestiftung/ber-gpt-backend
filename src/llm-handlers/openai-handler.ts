import { config } from "..";
import { SYSTEM_PROMPT } from "../fixtures/system-prompt";
import { ChatMessage } from "../types/chat-types";
import { LLMHandler, LLMResponse } from "../types/llm-handler-types";
import { convertWebStreamToNodeStream } from "../utils/stream-utils";
import { toCustomError } from "./llm-handler-utils";

export class OpenAILLMHandler implements LLMHandler {
  async chatCompletion(messages: ChatMessage[]): Promise<LLMResponse> {
    let endpoint = config.openAiEndpoint;
    const messagesWithSystemPromps = [
      { role: "system", content: SYSTEM_PROMPT },
    ].concat(messages);
    try {
      // Check if the message contains inappropriate content by using the /moderations endpoint
      const moderationsResponse = await fetch(`${endpoint}/moderations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openAiApiKey}`,
        },
        body: JSON.stringify({
          input: messages.map((message) => message.content).join(" "),
        }),
      });
      if (moderationsResponse.status !== 200) {
      }
      const res = await moderationsResponse.json();
      const flagged = await res.results[0].flagged;
      if (flagged) {
        return {
          status: moderationsResponse.status,
          error: {
            message: "Message contains inappropriate content",
            code: "inappropriate_content",
            status: 400,
          },
          stream: undefined,
        };
      }

      // If message is clean, use the chat/completions endpoint to get a response
      const response = await fetch(`${endpoint}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openAiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: messagesWithSystemPromps,
          temperature: 0,
          stream: true,
        }),
      });

      if (response.status !== 200) {
        const customError = await toCustomError(response);
        return customError;
      }

      if (!response.body) {
        throw new Error(`Failed to call OpenAI LLM`);
      }

      return {
        status: response.status,
        error: undefined,
        stream: convertWebStreamToNodeStream(response.body),
      };
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to call OpenAI LLM`);
    }
  }
}
