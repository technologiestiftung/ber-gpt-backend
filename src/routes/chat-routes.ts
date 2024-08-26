import { Router } from "express";
import { chatWithLLM } from "../controllers/chat-controller";
import { chatWithLLMForMail } from "../controllers/mail-chat-controller";

const router = Router();

router.post("/", chatWithLLM);
router.post("/mail", chatWithLLMForMail);

export default router;
