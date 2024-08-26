import { Request, Response } from "express";
import {
  ChatErrorResponse,
  ChatRequest,
  ChatResponse,
} from "../types/chat-types";
import { resolveMessagesForSystemPrompt } from "../fixtures/system-prompt";

export const chatWithLLMForMail = async (
  req: Request<{}, {}, ChatRequest>,
  res: Response<ChatResponse | ChatErrorResponse>
) => {
  const { messages } = req.body;
  const resolvedMessages = resolveMessagesForSystemPrompt(messages);
  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer sk-proj-hwa3UME7hpwNDEyY81YBT3BlbkFJZsoS3LFIb8Y8k8WuhFfP`,
    },

    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: resolvedMessages,
      temperature: 0.7,
      stream: false,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "email_schema",
          schema: {
            type: "object",
            properties: {
              final_email: {
                type: "string",
              },
              next_step_suggestions: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              questions_to_user: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: [
              "final_email",
              "questions_to_user",
              "next_step_suggestions",
            ],
          },
        },
      },
    }),
  });
  const x = await response.json();
  console.log(JSON.stringify(x));
  res.status(200).json(x);
};
