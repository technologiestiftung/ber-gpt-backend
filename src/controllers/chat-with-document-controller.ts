import { Request, Response } from "express";
import { pipeline } from "node:stream/promises";
import { LLMType, getLlmHandler } from "../llm-handlers/choose-llm-handler";
import { ChatMessage } from "../types/chat-types";
import { extract } from "../utils/extract-document";

export const chatWithDocument = async (req: Request, res: Response) => {
  const llm = req.headers["llm"] as LLMType;
  const llmHandler = getLlmHandler(llm);

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
        content: `
Du bist ein Assistent, der in der Lage ist, verschiedene Aufgaben im Zusammenhang mit Dokumenten zu übernehmen,
wie das Zusammenfassen von Inhalten, das Extrahieren wichtiger Informationen und das Bereitstellen detaillierter
Erklärungen. Du kannst Fragen zu Dokumenten beantworten und Usern bei der Analyse von Inhalten helfen.
Beantworte die folgenden Fragen nur mit Informationen aus dem Dokument.
        `,
      },
      {
        role: "user",
        content: `Das ist der Inhalt des Dokuments: ${extractedText}`,
      },
    ];

    const allMessages = systemMessages.concat(userMessages);

    const llmStream = await llmHandler.chatCompletion(allMessages);

    await pipeline(llmStream, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
