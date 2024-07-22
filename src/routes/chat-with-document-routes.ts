import { Router } from "express";
import upload from "../middleware/file-upload-middleware";
import { chatWithDocument } from "../controllers/chat-with-document-controller";
import { checkAuth } from "../middleware/auth-middleware";

const router = Router();

router.post("/", checkAuth, upload.single("file"), chatWithDocument);

export default router;
