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
  const { model, messages, max_tokens, temperature, top_p } = req.body;

  try {
    const llmResponse = await llmHandler.callLLM(
      model,
      messages,
      max_tokens,
      temperature,
      top_p
    );

    const response: ChatResponse = {
      id: llmResponse.id,
      model: llmResponse.model,
      choices: llmResponse.choices,
      usage: llmResponse.usage,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to call LLM" });
  }
};
