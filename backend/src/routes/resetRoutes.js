import express from "express";
import { resetDatabase } from "../controllers/resetController.js";

const router = express.Router();

router.post("/", resetDatabase);

export default router;

