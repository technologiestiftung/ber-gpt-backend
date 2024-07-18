import { Database } from "./database";

export type RegisteredDocument =
  Database["public"]["Tables"]["registered_documents"]["Row"];

export type ProcessedDocument =
  Database["public"]["Tables"]["processed_documents"]["Row"];
