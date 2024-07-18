import { ChatMessage, ChatResponse } from "./chat-types";

export interface LLMHandler {
  callLLM(messages: ChatMessage[]): Promise<ChatResponse>;
}
