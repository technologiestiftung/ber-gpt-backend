import { Router } from "express";
import { getHealthStatus } from "../controllers/health-controller";

const router = Router();

router.get("/", getHealthStatus);

export default router;
