import { Router } from "express";
import * as guardController from "../controllers/guardController.js";

const router = Router();

router.get("/", guardController.getAll);
router.get("/:id", guardController.getById);
router.post("/", guardController.create);
router.put("/:id", guardController.update);
router.put("/:id/status", guardController.updateStatus);
router.delete("/:id", guardController.remove);

export default router;

