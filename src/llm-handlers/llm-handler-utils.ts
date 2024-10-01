import { LLMResponse } from "../types/llm-handler-types";

export const toCustomError = async (
  response: Response
): Promise<LLMResponse> => {
  let rawError: { code: string; message: string } = { code: "", message: "" };
  try {
    rawError = (await response.json()).error;
  } catch (e) {
    rawError = {
      code: "unknown",
      //@ts-ignore
      message: e.message,
    };
  }

  if (rawError.code === "content_filter") {
    return {
      status: response.status,
      error: {
        message: "Message contains inappropriate content.",
        code: "inappropriate_content",
        status: 400,
      },
      stream: undefined,
    };
  }

  if (rawError.code === "context_length_exceeded") {
    return {
      status: response.status,
      error: {
        message: rawError.message,
        code: rawError.code,
        status: 400,
      },
      stream: undefined,
    };
  }

  if (response.status === 429) {
    return {
      status: response.status,
      error: {
        message:
          "LLM token rate limit exceeded, please try again after one minute.",
        code: "token_rate_limit_exceeded",
        status: 429,
      },
      stream: undefined,
    };
  }

  return {
    status: response.status,
    error: {
      message: rawError.message,
      code: rawError.code,
      status: 500,
    },
    stream: undefined,
  };
};
