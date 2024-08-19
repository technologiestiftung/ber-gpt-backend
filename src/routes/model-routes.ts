import { Router } from "express";
import { getModels } from "../controllers/model-controller";

const router = Router();

router.get("/", getModels);

export default router;
