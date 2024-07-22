import { Request, Response } from "express";
import { OpenAILLMHandler } from "../llm-handlers/openai-handler";
import { ChatMessage, ChatResponse } from "../types/chat-types";
import { LLMHandler } from "../types/llm-handler-types";
import { extract } from "../utils/extract-document";

const llmHandler: LLMHandler = new OpenAILLMHandler();

export const chatWithDocument = async (req: Request, res: Response) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { messages: userMessages } = JSON.parse(req.body.user_messages);

  try {
    const buffer = file.buffer;
    const extractedText = await extract(buffer);

    const systemMessages: ChatMessage[] = [
      {
        role: "system",
        content: `Du bist ein System, welches Dokumente verarbeiten kann und Fragen des Users zu diesem Dokument beantwortet.`,
      },
      {
        role: "user",
        content: `Das ist der Inhalt des Dokuments: ${extractedText}`,
      },
    ];

    const allMessages = systemMessages.concat(userMessages);

    const llmResponse = await llmHandler.chatCompletion(allMessages);

    const response: ChatResponse = {
      id: llmResponse.id,
      model: llmResponse.model,
      choices: llmResponse.choices,
      usage: llmResponse.usage,
    };

    res.json({ ...response, extractedText: extractedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
