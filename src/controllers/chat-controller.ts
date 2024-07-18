import { Request, Response } from "express";
import { ChatRequest, ChatResponse } from "../types/chat-types";

export const chatWithLLM = (
  req: Request<ChatRequest>,
  res: Response<ChatResponse>
) => {
  console.log(req.body);
  res.json({ llmResponse: "Was kann ich tun?" });
};
