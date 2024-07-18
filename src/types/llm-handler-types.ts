import { ChatMessage, ChatResponse } from "./chat-types";

export interface LLMHandler {
  chatCompletion(
    messages: ChatMessage[],
    response_format?: string
  ): Promise<ChatResponse>;
  embed(text: string): Promise<Array<number>>;
}
