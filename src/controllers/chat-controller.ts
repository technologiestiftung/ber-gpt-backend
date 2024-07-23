import { Request, Response } from "express";
import { pipeline } from "node:stream/promises";
import { LLMType, getLlmHandler } from "../llm-handlers/choose-llm-handler";
import {
  ChatErrorResponse,
  ChatRequest,
  ChatResponse,
} from "../types/chat-types";

export const chatWithLLM = async (
  req: Request<{}, {}, ChatRequest>,
  res: Response<ChatResponse | ChatErrorResponse>
) => {
  const llm = req.headers["llm"] as LLMType;
  const { messages } = req.body;
  const llmHandler = getLlmHandler(llm);
  try {
    const llmStream = await llmHandler.chatCompletion(messages);
    await pipeline(llmStream, res);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to call LLM" });
  }
};
