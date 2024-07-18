import axios, { AxiosResponse } from "axios";
import { LLMHandler } from "../types/llm-handler-types";
import { ChatMessage, ChatResponse } from "../types/chat-types";
import { OpenAIEmbeddingResponse } from "../types/document-types";

export class OpenAILLMHandler implements LLMHandler {
  async embed(text: string): Promise<number[]> {
    try {
      const response: AxiosResponse<OpenAIEmbeddingResponse> = await axios.post(
        "https://api.openai.com/v1/embeddings",
        {
          input: text,
          model: "text-embedding-ada-002",
          encoding_format: "float",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
      return response.data.data[0].embedding;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to embedd via LLM`);
    }
  }

  async chatCompletion(
    messages: ChatMessage[],
    responseFormat?: string
  ): Promise<ChatResponse> {
    try {
      const response: AxiosResponse<ChatResponse> = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
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
