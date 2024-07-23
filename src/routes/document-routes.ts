import { Router } from "express";
import { extractDocumentContent } from "../controllers/document-controller";
import upload from "../middleware/file-upload-middleware";

const router = Router();

router.post("/extract", upload.single("file"), extractDocumentContent);

export default router;
