import fs from "fs";
import {
  ExtractionResult,
  OpenAITextResponse,
  SummarizeResult,
} from "../types/document-types";
import { enc } from "./extract-document";
import { LLMHandler } from "../types/llm-handler-types";
import { OpenAILLMHandler } from "../llm-handlers/openai-handler";
import {
  generateSummary,
  generateSummaryForLargeDocument,
  generateTags,
} from "./open-ai-utils";

// We use a model with 16k context size, we reserve 1k for the prompt so that we can send ~15k tokens as payload
export const MAX_TOKEN_COUNT_FOR_SUMMARY = 15000;
const llmHandler: LLMHandler = new OpenAILLMHandler();

export const summarize = async (
  extractionResult: ExtractionResult
): Promise<SummarizeResult> => {
  const markdownFiles = fs
    .readdirSync(extractionResult.pagesPath)
    .filter((file) => file.endsWith(".md"))
    .sort();

  // Generate page summaries
  const markdownTexts = await Promise.all(
    markdownFiles.map(async (mf) => {
      const markdownText = fs.readFileSync(
        `${extractionResult.pagesPath}/${mf}`,
        "utf-8"
      );
      return markdownText;
    })
  );
  const completeMarkdown = markdownTexts.join("\n");

  // Generate summary
  const numTokens = enc.encode(completeMarkdown).length;
  let summary: OpenAITextResponse | undefined = undefined;
  if (numTokens > MAX_TOKEN_COUNT_FOR_SUMMARY) {
    summary = await generateSummaryForLargeDocument(completeMarkdown);
  } else {
    summary = await generateSummary(completeMarkdown);
  }

  // Generate embedding
  const embeddingResponse = await llmHandler.embed(summary!.result);

  // Generate tags
  const tagsResponse = await generateTags(summary!.result);

  const summaryResponse = {
    document: extractionResult.document,
    processedDocument: extractionResult.processedDocument!,
    summary: summary!.result,
    embedding: embeddingResponse,
    tags: tagsResponse.tags.tags,
    pagesPath: extractionResult.pagesPath,
    embeddingTokens: 0, //TODO: fix
    inputTokens: summary!.inputTokens,
    outputTokens: summary!.outputTokens,
  };

  return summaryResponse;
};
