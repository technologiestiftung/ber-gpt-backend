import { getLlmStatus } from "./../controllers/status-controller";
import { Router } from "express";

const router = Router();

router.get("/", getLlmStatus);

export default router;
