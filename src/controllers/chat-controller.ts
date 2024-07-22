import { Request, Response } from "express";
import {
  ChatErrorResponse,
  ChatRequest,
  ChatResponse,
} from "../types/chat-types";
import { LLMHandler } from "../types/llm-handler-types";
import { OpenAILLMHandler } from "../llm-handlers/openai-handler";
import { pipeline } from "node:stream/promises";

const llmHandler: LLMHandler = new OpenAILLMHandler();

export const chatWithLLM = async (
  req: Request<{}, {}, ChatRequest>,
  res: Response<ChatResponse | ChatErrorResponse>
) => {
  const { messages } = req.body;
  try {
    const llmStream = await llmHandler.chatCompletion(messages);
    await pipeline(llmStream, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to call LLM" });
  }
};
