import { ChatMessage } from "../types/chat-types";
import { LLMHandler } from "../types/llm-handler-types";
import { convertWebStreamToNodeStream } from "../utils/stream-utils";

export class OpenAILLMHandler implements LLMHandler {
  async chatCompletion(
    messages: ChatMessage[]
  ): Promise<NodeJS.ReadableStream> {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0,
            stream: true,
          }),
        }
      );

      if (!response.body) {
        throw new Error(`Failed to call LLM`);
      }

      const stream = convertWebStreamToNodeStream(response.body);
      return stream;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to call LLM`);
    }
  }
}
