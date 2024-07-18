import { ProcessedDocument, RegisteredDocument } from "./database-types";

export interface Embedding {
  content: string;
  embedding: Array<number>;
  chunkIndex: number;
  page: number;
}

export interface EmbeddingResult {
  document: RegisteredDocument;
  processedDocument: ProcessedDocument;
  embeddings: Array<Embedding>;
  tokenUsage: number;
}

export interface Chunk {
  content: string;
  page: number;
  chunkIndex: number;
  tokenCount: number;
}

export interface ExtractRequest {
  document: RegisteredDocument;
  targetPath: string;
}

export interface ExtractedFile {
  page: number;
  path: string;
  tokens: number;
}

export interface ExtractionResult {
  document: RegisteredDocument;
  processedDocument: ProcessedDocument | undefined;
  pagesPath: string;
  fileSize: number;
  numPages: number;
  checksum: string;
  extractedFiles: Array<ExtractedFile>;
  totalTokens: number;
}

export interface SummarizeResult {
  document: RegisteredDocument;
  processedDocument: ProcessedDocument;
  pagesPath: string;
  summary: string;
  embedding: Array<number>;
  tags: Array<string>;
  embeddingTokens: number;
  inputTokens: number;
  outputTokens: number;
}

export interface OpenAITextResponse {
  result: string;
  inputTokens: number;
  outputTokens: number;
}

export interface OpenAIEmbeddingResponse {
  data: {
    embedding: Array<number>;
  }[];
}

export interface OpenAITagsResponse {
  tags: {
    tags: Array<string>;
  };
  inputTokens: number;
  outputTokens: number;
}

export interface DocumentImporter {
  documentType: string;
  settings: Settings;
  import(): Promise<number>;
}

export interface Settings {
  postgresConnection: string;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  openaAiApiKey: string;
  processingDirectory: string;
  allowDeletion: boolean;
  maxPagesLimit: number;
  openAiModel: string;
  openAiEmbeddingModel: string;
  maxDocumentsToProcessInOneRun: number;
  maxDocumentsToImportPerDocumentType: number;
}

export interface TokenUsage {
  embeddings: number;
  inputs: number;
  outputs: number;
}
