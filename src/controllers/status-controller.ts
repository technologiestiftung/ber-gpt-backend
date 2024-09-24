import { Request, Response } from "express";
import {
  LLMIdentifier,
  resolveLlmHandler,
} from "../llm-handlers/resolve-llm-handler";

export const getLlmStatus = async (req: Request, res: Response<any>) => {
  const llms = [
    "openai-gpt-4o-mini",
    "azure-gpt-4o-mini",
    "citylab-macstudio-llama-3.1",
  ];

  const pingResults = await Promise.all(
    llms.map(async (llm) => {
      const llmHandler = resolveLlmHandler(llm as LLMIdentifier);

      try {
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
        };
      } catch (e: any) {
        return {
          llm: llm,
          status: 500,
          healthy: false,
          error: e.message,
          welcomeMessage: undefined,
        };
      }
    })
  );

  const pingResultsObject: { [key: string]: any } = pingResults.reduce(
    (acc, curr) => {
      acc[curr.llm] = curr;
      return acc;
    },
    {} as { [key: string]: any }
  );

  res.json({ ping: pingResultsObject, time: new Date() });
};
