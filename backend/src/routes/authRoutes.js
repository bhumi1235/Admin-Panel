import express from "express";
import { login, getMe, changePassword, updateProfile, seedAdmin } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);
router.put("/profile", protect, updateProfile);
router.get("/seed-admin", seedAdmin);

export default router;

