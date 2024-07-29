import { ChatErrorResponse, ChatMessage } from "./chat-types";

export interface LLMResponse {
  status: number;
  error: ChatErrorResponse | undefined;
  stream: NodeJS.ReadableStream | undefined;
}

export interface LLMHandler {
  chatCompletion(messages: ChatMessage[]): Promise<LLMResponse>;
}
