import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import crypto from "crypto";
import {
  ProcessedDocument,
  RegisteredDocument,
} from "../types/database-types.js";
import { get_encoding } from "@dqbd/tiktoken";
import { promises as fs_promise } from "fs";
import { ExtractedFile, ExtractionResult } from "../types/document-types.js";

const MAGIC_TEXT_TOO_SHORT_LENGTH = 32;
const MAGIC_OCR_WIDTH = 2048;
const MAGIC_OCR_HEIGHT = 2887;
const MAGIC_TIMEOUT = 100000;

export const enc = get_encoding("cl100k_base");

async function splitPdf(
  pathToPdf: string,
  pdfFilename: string,
  pagesDirectory: string
) {
  const pdfData = await fs.promises.readFile(pathToPdf);
  const pdfDoc = await PDFDocument.load(pdfData);
  const numberOfPages = pdfDoc.getPages().length;
  for (let i = 0; i < numberOfPages; i++) {
    const subDocument = await PDFDocument.create();
    const [copiedPage] = await subDocument.copyPages(pdfDoc, [i]);
    subDocument.addPage(copiedPage);
    const pdfBytes = await subDocument.save();
    await fs.promises.writeFile(
      `${pagesDirectory}/${pdfFilename.replace(".pdf", "")}-${i}.pdf`,
      pdfBytes
    );
  }
}

function getHash(file: string): string {
  const fileBuffer = fs.readFileSync(file);
  const hashSum = crypto.createHash("md5");
  hashSum.update(fileBuffer);
  const hex = hashSum.digest("hex");
  return hex;
}

function getFileSize(file: string): number {
  const stats = fs.statSync(file);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

export const extract = async (
  documentBlob: Blob,
  registeredDocument: RegisteredDocument,
  processingFolder: string
): Promise<ExtractionResult> => {
  // @ts-ignore
  const pdf2md = (await import("@opendocsg/pdf2md")).default;

  const filename = registeredDocument.source_url.split("/").slice(-1)[0];

  const filenameWithoutExtension = filename.replace(".pdf", "");

  const pathToPdf = `${processingFolder}/${filename}`;

  console.log(pathToPdf);

  // Write file to disk
  const arrayBuffer = await documentBlob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs_promise.writeFile(pathToPdf, buffer);

  const pagesFolder = `${processingFolder}/pages`;
  if (!fs.existsSync(pagesFolder)) {
    fs.mkdirSync(pagesFolder);
  }

  await splitPdf(pathToPdf, filename, pagesFolder);

  const pdfPageFiles = fs
    .readdirSync(pagesFolder)
    .filter((file) => file.endsWith(".pdf"));

  let extractedFiles: Array<ExtractedFile> = [];
  for (let idx = 0; idx < pdfPageFiles.length; idx++) {
    const pdfPageFile = pdfPageFiles[idx];
    const pdfPage = pdfPageFile.replace(".pdf", "").split("-").slice(-1)[0];
    const pdfBuffer = fs.readFileSync(`${pagesFolder}/${pdfPageFile}`);

    let mdText = "";
    let ocrText = "";

    const uint8Array = new Uint8Array(pdfBuffer);
    mdText = await pdf2md(uint8Array);

    let text = mdText.length < 32 ? ocrText : mdText;
    let outputFile = `${pagesFolder}/${filenameWithoutExtension}-${pdfPage}.md`;
    let outPath = path.resolve(outputFile);
    fs.writeFileSync(outPath, text);

    extractedFiles.push({
      page: parseInt(pdfPage),
      path: outPath,
      tokens: enc.encode(text).length,
    } as ExtractedFile);
  }

  return {
    document: registeredDocument,
    processedDocument: undefined,
    pagesPath: pagesFolder,
    fileSize: getFileSize(pathToPdf),
    numPages: pdfPageFiles.length,
    checksum: getHash(pathToPdf),
    extractedFiles: extractedFiles,
    totalTokens: extractedFiles.map((f) => f.tokens).reduce((l, r) => l + r, 0),
  } as ExtractionResult;
};
