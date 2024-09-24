import {
  LLMIdentifier,
  resolveLlmHandler,
} from "../llm-handlers/resolve-llm-handler";
import { ModelStatus } from "../types/model-types";

export const getLlmStatus = async () => {
  const llms = [
    "openai-gpt-4o-mini",
    "azure-gpt-4o-mini",
    "citylab-macstudio-llama-3.1",
  ];

  const pingResults = await Promise.all(
    llms.map(async (llm) => {
      const llmHandler = resolveLlmHandler(llm as LLMIdentifier);

      try {
        const then = Date.now();
        const llmRespone = await llmHandler.chatCompletion([
          {
            role: "user",
            content: "Say hi in one sentence.",
          },
        ]);

        const status = llmRespone.status;

        if (status !== 200) {
          return {
            llm: llm,
            status: status,
            healthy: false,
            error: llmRespone.error?.message,
            welcomeMessage: undefined,
            responseTimeMs: undefined,
          };
        }

        const stream: NodeJS.ReadableStream = llmRespone.stream!;

        const rawChunks: string = await new Promise((resolve, reject) => {
          let data = "";
          stream.on("data", (chunk) => {
            data += chunk;
          });
          stream.on("end", () => {
            const streamData = data.toString();
            resolve(streamData);
          });
          stream.on("error", (error) => {
            reject(error);
          });
        });

        const now = Date.now();
        const elapsed = now - then;

        let llmResponse = "";
        if (llm === "openai-gpt-4o-mini" || llm === "azure-gpt-4o-mini") {
          llmResponse = rawChunks
            .split("\n")
            .filter((chunk) => chunk !== "")
            .filter((chunk) => chunk !== "data: [DONE]")
            .map((chunk) => chunk.replace("data: ", ""))
            .map((chunk) => JSON.parse(chunk))
            .map((chunk) => chunk.choices[0].delta)
            .filter((chunk) => chunk.content !== "")
            .filter((chunk) => Object.keys(chunk).length !== 0)
            .map((chunk) => chunk.content)
            .join("");
        }
        if (llm === "citylab-macstudio-llama-3.1") {
          llmResponse = rawChunks
            .split("\n")
            .filter((chunk) => chunk !== "")
            .map((chunk) => JSON.parse(chunk))
            .map((chunk) => chunk.message)
            .filter((chunk) => chunk.content !== "")
            .filter((chunk) => Object.keys(chunk).length !== 0)
            .map((chunk) => chunk.content)
            .join("");
        }

        return {
          llm: llm,
          status: status,
          healthy: status === 200,
          error: undefined,
          welcomeMessage: llmResponse,
          responseTimeMs: elapsed,
        };
      } catch (e: any) {
        return {
          llm: llm,
          status: 500,
          healthy: false,
          error: e.message,
          welcomeMessage: undefined,
          responseTimeMs: undefined,
        };
      }
    })
  );

  const pingResultsObject: { [key: string]: any } = pingResults.reduce(
    (acc, curr) => {
      acc[curr.llm] = curr as ModelStatus;
      return acc;
    },
    {} as { [key: string]: ModelStatus }
  );

  return pingResultsObject;
};
