import { backOff } from "exponential-backoff";
import { OpenAILLMHandler } from "../llm-handlers/openai-handler";
import {
  OpenAITagsResponse,
  OpenAITextResponse,
} from "../types/document-types";
import { LLMHandler } from "../types/llm-handler-types";
import { enc } from "./extract-document";

export const MAX_TOKEN_COUNT_FOR_SUMMARY = 15000;

const llmHandler: LLMHandler = new OpenAILLMHandler();

export function splitArrayEqually<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

export function splitInParts(input: string, numParts: number): string[] {
  const parts: string[] = [];
  const partSize: number = Math.ceil(input.length / numParts);
  for (let i = 0; i < input.length; i += partSize) {
    parts.push(input.substring(i, i + partSize));
  }
  return parts;
}

export function splitInChunksAccordingToTokenLimit(
  input: string,
  tokenLimit: number,
  numParts: number = 1
): string[] {
  const splittedParts = splitInParts(input, numParts);
  const tokenLimitRespected = splittedParts.every(
    (p) => enc.encode(p).length < tokenLimit
  );
  if (tokenLimitRespected) {
    return splittedParts;
  } else {
    return splitInChunksAccordingToTokenLimit(input, tokenLimit, numParts + 1);
  }
}

export async function generateTags(
  content: string
): Promise<OpenAITagsResponse> {
  const tagSummary = await backOff(
    async () =>
      llmHandler.chatCompletion(
        [
          {
            role: "system",
            content: `
							Du bist ein politischer Dokumenten-Assistent, der Inhalte versteht, zusammenfasst und Tags generiert.
							Erhalte ein durch """ abgegrenztes Dokument.
							Generiere 10 Tags, die das Dokument treffend beschreiben.
							Konzentriere dich auf die Hauptinhalte.
							Verändere oder erfinde NIEMALS Fakten, Namen, Berufsbezeichnungen, Zahlen oder Datumsangaben.
							Antwortformat: Ein syntaktisch gültiges JSON Objekt im Format {tags: ['tag_1', 'tag_2', 'tag_x']}.`,
          },
          {
            role: "user",
            content: `Extrahiere eine Liste von inhaltlich relevanten Tags aus dem folgenden Dokument. Gebe ein JSON Objekt im Format {tags: ['tag_1', 'tag_2', 'tag_x']} zurück. Das ist das Dokument: """${content}""" `,
          },
        ],
        "json_object"
      ),
    {
      startingDelay: 1000,
      numOfAttempts: 10,
      retry: (e: any, attemptNumber: number) => {
        console.log(`retry #${attemptNumber} in generating tags, cause: ${e}`);
        return true;
      },
    }
  );

  const tags = JSON.parse(tagSummary.choices[0].message?.content ?? "");

  return {
    tags: tags,
    inputTokens: tagSummary.usage?.prompt_tokens ?? 0,
    outputTokens: tagSummary.usage?.completion_tokens ?? 0,
  };
}

export async function generateSummary(
  content: string
): Promise<OpenAITextResponse> {
  const completeSummary = await backOff(
    async () =>
      await llmHandler.chatCompletion([
        {
          role: "system",
          content: `
							Du bist ein politischer Dokumenten-Assistent, der Inhalte versteht und zusammenfasst.
							Erhalte ein durch """ abgegrenztes Dokument.
							Die Zusammenfassung soll inhaltlich prägnant sein.
							Verändere oder erfinde NIEMALS Fakten, Namen, Berufsbezeichnungen, Zahlen oder Datumsangaben.
							Begrenze die Zusammenfassung auf maximal 100 Wörter`,
        },
        {
          role: "user",
          content: `Fasse das folgende Dokument in 100 Worten zusammen: """${content}"""`,
        },
      ]),
    {
      startingDelay: 1000,
      numOfAttempts: 10,
      retry: (e: any, attemptNumber: number) => {
        console.log(`retry #${attemptNumber} in final summary, cause: ${e}`);
        return true;
      },
    }
  );

  return {
    result: completeSummary.choices[0].message?.content ?? "",
    inputTokens: completeSummary.usage?.prompt_tokens ?? 0,
    outputTokens: completeSummary.usage?.completion_tokens ?? 0,
  };
}

export async function generateSummaryForLargeDocument(
  completeDocument: string,
  allSummaries: Array<OpenAITextResponse> = []
): Promise<OpenAITextResponse> {
  // Split in chunks where each token count of chunk < MAX_TOKEN_COUNT_FOR_SUMMARY
  const maxTokenChunks = splitInChunksAccordingToTokenLimit(
    completeDocument,
    MAX_TOKEN_COUNT_FOR_SUMMARY
  );

  // Generate summaries in batches (to avoid 429)
  let batches = splitArrayEqually(maxTokenChunks, 20);
  var summaries: Array<OpenAITextResponse> = [];
  for (let idx = 0; idx < batches.length; idx++) {
    const batch = batches[idx];
    const sx = await Promise.all(
      batch.map(async (chunk) => {
        const summary = await generateSummary(chunk);
        return summary;
      })
    );
    summaries = summaries.concat(sx);
  }

  // Concatenate the summaries
  const totalSummary = summaries.map((s) => s.result).join("\n");
  const totalSummaryTokens = enc.encode(totalSummary).length;

  const combinedSummaries = allSummaries.concat(summaries);

  if (totalSummaryTokens > MAX_TOKEN_COUNT_FOR_SUMMARY) {
    // Recursively start again with new summary as document
    return generateSummaryForLargeDocument(totalSummary, combinedSummaries);
  } else {
    // Generate final summary
    const finalSummary = await generateSummary(totalSummary);
    return {
      result: finalSummary.result,
      inputTokens:
        combinedSummaries.map((s) => s.inputTokens).reduce((l, r) => l + r, 0) +
        finalSummary.inputTokens,
      outputTokens:
        combinedSummaries
          .map((s) => s.outputTokens)
          .reduce((l, r) => l + r, 0) + finalSummary.outputTokens,
    };
  }
}
