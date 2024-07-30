import { Request, Response } from "express";
import { extract } from "../utils/extract-document";

export const extractDocumentContent = async (req: Request, res: Response) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({
      message: "No file uploaded",
      code: "no_file_uploaded",
      status: 400,
    });
  }

  try {
    const buffer = file.buffer;
    const extractedText = await extract(buffer);
    res.json({ content: extractedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unexpected error while extracting document content",
      code: "text_extraction_failed",
      status: 500,
    });
  }
};
