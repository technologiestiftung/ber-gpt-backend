import { Request, Response } from "express";
import { pipeline } from "node:stream/promises";
import { globalLlmHandler } from "..";
import {
  ChatErrorResponse,
  ChatRequest,
  ChatResponse,
} from "../types/chat-types";

export const chatWithLLM = async (
  req: Request<{}, {}, ChatRequest>,
  res: Response<ChatResponse | ChatErrorResponse>
) => {
  const { messages } = req.body;
  try {
    const llmStream = await globalLlmHandler.chatCompletion(messages);
    await pipeline(llmStream, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to call LLM" });
  }
};
