import fs from "fs";
import { OpenAILLMHandler } from "../llm-handlers/openai-handler";
import {
  Chunk,
  Embedding,
  EmbeddingResult,
  ExtractionResult,
} from "../types/document-types";
import { LLMHandler } from "../types/llm-handler-types";
import { enc } from "./extract-document";
import { splitInChunksAccordingToTokenLimit } from "./open-ai-utils";
const llmHandler: LLMHandler = new OpenAILLMHandler();

// Magic token limit assuming we use a model with 16k context token limit
// With that limit, we can feed max. 10 chunks (+ prompt + query) to the completion
// query without exceeding the token limit
export const MAGIC_TOKEN_LIMIT = 1500;

export const embedd = async (
  extractionResult: ExtractionResult
): Promise<EmbeddingResult> => {
  let totalMarkdownData = "";
  let chunks: Array<Chunk> = [];

  for (let idx = 0; idx < extractionResult.extractedFiles.length; idx++) {
    const mdFile = extractionResult.extractedFiles[idx];

    const markdownData = fs
      .readFileSync(mdFile.path, "utf8")
      .replace(/\n/g, " ")
      .replace(/\0/g, " ");

    const chunksOnThisPage = splitInChunksAccordingToTokenLimit(
      markdownData,
      MAGIC_TOKEN_LIMIT
    );

    chunks = chunks.concat(
      chunksOnThisPage.map((chunk, chunkIndex) => {
        return {
          content: chunk,
          page: mdFile.page,
          tokenCount: enc.encode(chunk).length,
          chunkIndex: chunkIndex,
        } as Chunk;
      })
    );

    totalMarkdownData += markdownData;
  }

  const chunkEmbeddings = await Promise.all(
    chunks.map(async (chunk) => {
      const embedding = await llmHandler.embed(chunk.content);
      return { ...chunk, embedding: embedding };
    })
  );

  const embeddings = chunkEmbeddings.map((emb) => {
    return {
      content: emb.content,
      embedding: emb.embedding,
      chunkIndex: emb.chunkIndex,
      page: emb.page,
    } as Embedding;
  });

  const totalTokenUsage = chunkEmbeddings
    .map((chunk) => chunk.tokenCount)
    .reduce((total, num) => total + num, 0);

  return {
    document: extractionResult.document,
    processedDocument: extractionResult.processedDocument,
    embeddings: embeddings,
    tokenUsage: totalTokenUsage,
  } as EmbeddingResult;
};
