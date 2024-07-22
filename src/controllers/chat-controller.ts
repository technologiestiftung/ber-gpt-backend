import { Request, Response } from "express";
import {
  ChatErrorResponse,
  ChatRequest,
  ChatResponse,
} from "../types/chat-types";
import { LLMHandler } from "../types/llm-handler-types";
import { OpenAILLMHandler } from "../llm-handlers/openai-handler";

const llmHandler: LLMHandler = new OpenAILLMHandler();

export const chatWithLLM = async (
  req: Request<{}, {}, ChatRequest>,
  res: Response<ChatResponse | ChatErrorResponse>
) => {
  const { messages } = req.body;
  try {
    const llmResponse = await llmHandler.chatCompletion(messages);

    const response: ChatResponse = {
      id: llmResponse.id,
      model: llmResponse.model,
      choices: llmResponse.choices,
      usage: llmResponse.usage,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to call LLM" });
  }
};
