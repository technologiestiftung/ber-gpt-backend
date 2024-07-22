import { Readable } from "stream";

export const convertWebStreamToNodeStream = (
  webStream: ReadableStream<Uint8Array>
): NodeJS.ReadableStream => {
  const reader = webStream.getReader();
  return new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      } catch (error) {
        this.emit("error", error);
      }
    },
  });
};
