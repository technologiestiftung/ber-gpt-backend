export interface ChatResponse {
  llmResponse: string;
}

export interface ChatRequest {
  systemPrompt: string;
  chatHistory: string[];
  userPrompt: string;
}
