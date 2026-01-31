import { Router } from "express";
import * as supervisorController from "../controllers/supervisorController.js";

const router = Router();

router.get("/", supervisorController.getAll);
router.get("/:id/guards", supervisorController.getGuardsBySupervisorId);
router.get("/:id", supervisorController.getById);
router.post("/", supervisorController.create);
router.put("/:id", supervisorController.update);
router.put("/:id/status", supervisorController.updateStatus);
router.delete("/:id", supervisorController.remove);

export default router;

