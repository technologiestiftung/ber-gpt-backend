import { ChatMessage } from "./chat-types";

export interface LLMHandler {
  chatCompletion(messages: ChatMessage[]): Promise<NodeJS.ReadableStream>;
}
