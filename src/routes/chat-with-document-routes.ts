import { Router } from "express";
import { chatWithDocument } from "../controllers/chat-with-document-controller";
import upload from "../middleware/file-upload-middleware";

const router = Router();

router.post("/", upload.single("file"), chatWithDocument);

export default router;
