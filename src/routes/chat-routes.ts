import { Router } from "express";
import { chatWithLLM } from "../controllers/chat-controller";

const router = Router();

router.post("/", chatWithLLM);

export default router;
