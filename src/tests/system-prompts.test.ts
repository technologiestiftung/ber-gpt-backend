import { test } from "node:test";
import { strictEqual } from "assert";
import { ChatMessage } from "../types/chat-types";
import {
  DEFAULT_SYSTEM_PROMPT,
  resolveMessagesForSystemPrompt,
} from "../fixtures/system-prompt";

test("system prompt should not be changed when included in messages", () => {
  const messages: ChatMessage[] = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Hello, who are you?" },
  ];
  const resolvedMessages = resolveMessagesForSystemPrompt(messages);
  strictEqual(messages, resolvedMessages);
});

test("default system prompt should be added when no system prompt included in messages", () => {
  const messages: ChatMessage[] = [
    { role: "user", content: "Hello, who are you?" },
  ];
  const resolvedMessages = resolveMessagesForSystemPrompt(messages);
  strictEqual(resolvedMessages.length, 2);
  strictEqual(resolvedMessages[0].content, DEFAULT_SYSTEM_PROMPT);
});
