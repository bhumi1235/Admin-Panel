import { Router } from "express";
import * as dashboardController from "../controllers/dashboardController.js";

const router = Router();

router.get("/", dashboardController.getStats);

export default router;

