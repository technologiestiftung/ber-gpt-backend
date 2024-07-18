import { Router } from "express";
import upload from "../middleware/file-upload-middleware";
import { uploadFile } from "../controllers/file-upload-controller";
import { checkAuth } from "../middleware/auth-middleware";

const router = Router();

router.post("/upload", checkAuth, upload.single("file"), uploadFile);

export default router;
