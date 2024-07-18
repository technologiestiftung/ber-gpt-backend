import { SupabaseClient } from "@supabase/supabase-js";
import { Request, Response } from "express";

export const uploadFile = async (req: Request, res: Response) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const user = (req as any).user;
  const supabaseClient = (req as any).supabaseClient as SupabaseClient;
  const filePath = `uploads/${user.user.id}/${file.originalname}`;

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

    const { error: insertRegisteredDocumentError } = await supabaseClient
      .from("registered_documents")
      .insert({
        user_id: user.user.id,
        source_url: publicURLData.publicUrl,
        source_type: "pdf",
        registered_at: new Date().toISOString(),
        metadata: {},
      });

    if (insertRegisteredDocumentError) {
      return res
        .status(500)
        .json({ error: insertRegisteredDocumentError.message });
    }

    res.json({ data, publicURL: publicURLData.publicUrl });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
