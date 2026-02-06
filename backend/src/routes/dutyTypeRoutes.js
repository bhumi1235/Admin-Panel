import express from "express";
import {
    getAllDutyTypes,
    createDutyType,
    updateDutyType,
    getDutyTypeById,
    deleteDutyType
} from "../controllers/dutyTypeController.js";
// import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (or protected if middleware uncommented)
router.get("/", getAllDutyTypes);
router.get("/:id", getDutyTypeById);

// Admin only routes
router.post("/", createDutyType);
router.put("/:id", updateDutyType);
router.delete("/:id", deleteDutyType);

export default router;
