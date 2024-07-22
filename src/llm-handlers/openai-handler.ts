import axios, { AxiosResponse } from "axios";
import { LLMHandler } from "../types/llm-handler-types";
import { ChatMessage, ChatResponse } from "../types/chat-types";

export class OpenAILLMHandler implements LLMHandler {
  async chatCompletion(
    messages: ChatMessage[],
    responseFormat?: string
  ): Promise<ChatResponse> {
    try {
      const response: AxiosResponse<ChatResponse> = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages,
          response_format: responseFormat ? { type: responseFormat } : null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to call LLM`);
    }
  }
}
