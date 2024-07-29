import { Request, Response } from "express";
import { pipeline } from "node:stream/promises";
import { LLMType, getLlmHandler } from "../llm-handlers/choose-llm-handler";
import {
  ChatErrorResponse,
  ChatRequest,
  ChatResponse,
  ErrorResponse,
} from "../types/chat-types";

export const chatWithLLM = async (
  req: Request<{}, {}, ChatRequest>,
  res: Response<ChatResponse | ChatErrorResponse | ErrorResponse>
) => {
  const llm = req.headers["llm"] as LLMType;
  const { messages } = req.body;
  const llmHandler = getLlmHandler(llm);
  try {
    const llmRespone = await llmHandler.chatCompletion(messages);
    if (llmRespone.stream) {
      await pipeline(llmRespone.stream, res);
      return;
    }
    if (llmRespone.error) {
      res.status(400).json(llmRespone.error);
      return;
    }
  } catch (error: any) {
    console.error(error);
    // When using streams, the pipeline function can finish writing the response
    // and close the connection, leading to an error when attempt to send
    // another response in the catch block. This check prevents that.
    if (res.headersSent) {
      return;
    }
    res.status(500).json({ error: "Failed to call LLM" });
  }
};
