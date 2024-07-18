import { ChatMessage, ChatResponse } from "./chat-types";

export interface LLMHandler {
  callLLM(
    model: string,
    messages: ChatMessage[],
    max_tokens?: number,
    temperature?: number,
    top_p?: number
  ): Promise<ChatResponse>;
}
