import { Router } from "express";
import { extractDocumentContent } from "../controllers/document-controller";
import upload from "../middleware/file-upload-middleware";

const router = Router();

router.post("/extract", (req, res) => {
  upload.single("file")(req, res, function (err: any) {
    if (err) {
      console.log(err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size is too large. Max limit is 2MB",
          code: "file_size_limit_exceeded",
          status: 400,
        });
      } else if (err.code === "UNSUPPORTED_FILETYPE") {
        return res.status(400).json({
          message: "File upload only supports the following filetypes: [pdf]",
          code: "unsupported_filetype",
          status: 400,
        });
      }
      return res.status(500).json({ error: err.message });
    }
    extractDocumentContent(req, res);
  });
});

export default router;
