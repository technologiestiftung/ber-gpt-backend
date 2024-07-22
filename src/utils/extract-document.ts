import pdf from "pdf-parse";

export const extract = async (documentFileBuffer: Buffer): Promise<string> => {
  const buffer = Buffer.from(documentFileBuffer);
  const mdText = await pdf(buffer);
  return mdText.text;
};
