import { Request, Response } from "express";
import { extract } from "../utils/extract-document";

export const extractDocumentContent = async (req: Request, res: Response) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const buffer = file.buffer;
    const extractedText = await extract(buffer);
    res.json({ content: extractedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error extracting text from document" });
  }
};
