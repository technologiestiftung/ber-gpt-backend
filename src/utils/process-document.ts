import { SupabaseClient } from "@supabase/supabase-js";
import { RegisteredDocument } from "../types/database-types";
import { User } from "@supabase/supabase-js";
import { extract } from "./extract-document";
import { summarize } from "./summarize-document";
import { embedd } from "./embed-document";
import fs from "fs";
import os from "os";
import path from "path";

export async function processDocument(
  registeredDocument: RegisteredDocument,
  authenticatedSupabaseClient: SupabaseClient,
  user: User
): Promise<void> {
  // Make temp folder for processing data
  const filename = registeredDocument.source_url.split("/").slice(-1)[0];
  const filenameWithoutExtension = filename.replace(".pdf", "");
  const tempDir = os.tmpdir();
  const tempFolderPath = path.join(
    tempDir,
    `ber-gpt-backend-${Date.now()}`,
    filenameWithoutExtension
  );
  fs.mkdirSync(tempFolderPath, { recursive: true });

  const fullPath = `${user.id}/${registeredDocument.source_url
    .split("/")
    .pop()}`;

  const { data, error } = await authenticatedSupabaseClient.storage
    .from("documents")
    .download(fullPath);

  const extractionResult = await extract(
    data as Blob,
    registeredDocument,
    tempFolderPath
  );

  const {
    data: insertProcessedDocumentData,
    error: insertProcessedDocumentError,
  } = await authenticatedSupabaseClient
    .from("processed_documents")
    .insert({
      file_checksum: extractionResult.checksum,
      file_size: extractionResult.fileSize,
      num_pages: extractionResult.numPages,
      processing_started_at: new Date(),
      registered_document_id: extractionResult.document.id,
      user_id: user.id,
    })
    .select("*")
    .single();

  const fullExtractionResult = {
    ...extractionResult,
    processedDocument: insertProcessedDocumentData,
  };

  const summary = await summarize(fullExtractionResult);

  const { error: insertSummaryError } = await authenticatedSupabaseClient
    .from("processed_document_summaries")
    .insert({
      summary: summary.summary,
      summary_embedding: summary.embedding,
      tags: summary.tags,
      processed_document_id: summary.processedDocument.id,
      user_id: user.id,
    });

  const embeddResult = await embedd(fullExtractionResult);

  const { error: embeddInsertError } = await authenticatedSupabaseClient
    .from("processed_document_chunks")
    .insert(
      embeddResult.embeddings.map((e) => {
        return {
          content: e.content,
          embedding: e.embedding,
          page: e.page,
          chunk_index: e.chunkIndex,
          processed_document_id: embeddResult.processedDocument.id,
          user_id: user.id,
        };
      })
    );

  if (
    error ||
    insertProcessedDocumentError ||
    insertSummaryError ||
    embeddInsertError
  ) {
    await authenticatedSupabaseClient
      .from("processed_documents")
      .update({
        processing_finished_at: new Date(),
        processing_error: "Error during processing",
      })
      .eq("id", insertProcessedDocumentData.id)
      .select("*")
      .single();

    if (fs.existsSync(tempFolderPath)) {
      fs.rmSync(tempFolderPath, { force: true, recursive: true });
    }

    throw new Error(`Failed to process file`);
  }

  await authenticatedSupabaseClient
    .from("processed_documents")
    .update({
      processing_finished_at: new Date(),
    })
    .eq("id", insertProcessedDocumentData.id)
    .select("*")
    .single();

  if (fs.existsSync(tempFolderPath)) {
    fs.rmSync(tempFolderPath, { force: true, recursive: true });
  }

  return;
}
