import { SupabaseClient } from "@supabase/supabase-js";
import { Request, Response } from "express";
import { processDocument } from "../utils/process-document";

export const uploadFile = async (req: Request, res: Response) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const user = (req as any).user;
  const supabaseClient = (req as any).supabaseClient as SupabaseClient;
  const filePath = `${user.user.id}/${file.originalname}`;
  console.log(user, supabaseClient, filePath);

  try {
    const { data, error } = await supabaseClient.storage
      .from("documents")
      .upload(filePath, file.buffer, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data: publicURLData } = supabaseClient.storage
      .from("documents")
      .getPublicUrl(filePath);

    const {
      data: insertRegisteredDocumentData,
      error: insertRegisteredDocumentError,
    } = await supabaseClient
      .from("registered_documents")
      .insert({
        user_id: user.user.id,
        source_url: publicURLData.publicUrl,
        source_type: "pdf",
        registered_at: new Date().toISOString(),
        metadata: {},
      })
      .select("*")
      .single();

    if (insertRegisteredDocumentError) {
      console.error(JSON.stringify(insertRegisteredDocumentError));
      return res
        .status(500)
        .json({ error: insertRegisteredDocumentError.message });
    }

    console.log(
      `Starting processing of uploaded file ${publicURLData.publicUrl}...`
    );
    processDocument(insertRegisteredDocumentData, supabaseClient, user.user)
      .then(() => {
        console.log(
          `Uploaded file ${publicURLData.publicUrl} processed successfully...`
        );
      })
      .catch((error) => {
        console.error(
          `Error processing uploaded file ${publicURLData.publicUrl}...`
        );
        console.error(error);
      });

    res.json({ publicURL: publicURLData.publicUrl });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
