export const extract = async (documentFileBuffer: Buffer): Promise<string> => {
  // @ts-ignore
  const pdf2md = (await import("@opendocsg/pdf2md")).default;
  const buffer = Buffer.from(documentFileBuffer);
  const uint8Array = new Uint8Array(buffer);
  const mdText = await pdf2md(uint8Array);
  return mdText;
};
