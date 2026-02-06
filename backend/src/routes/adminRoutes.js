import express from "express";
import {
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
} from "../controllers/adminController.js";
import { adminLogin } from "../controllers/authController.js";
import * as dashboardController from "../controllers/dashboardController.js";
import * as supervisorController from "../controllers/supervisorController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { query } from "../config/db.js";

const router = express.Router();

// --- PUBLIC / DEBUG endpoints ---

// Login
router.post("/login", adminLogin);

// Bootstrap Admin (No token for now as requested)
router.post("/create-admin", createAdmin);

// Debug Users
router.get("/debug-users", async (req, res) => {
    try {
        const r = await query("SELECT email, role FROM users");
        res.json(r.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- PROTECTED ADMIN endpoints ---
router.use(protect);
router.use(authorize("admin"));

// Admin Profile Management
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);
router.put("/change-password", changeAdminPassword);

router.get("/dashboard", dashboardController.getStats);

// Supervisor Management
router.get("/supervisors", supervisorController.getAll);
router.post("/supervisors", supervisorController.create);
router.get("/supervisors/:id", supervisorController.getById);
router.put("/supervisors/:id", supervisorController.update);
router.put("/supervisors/:id/status", supervisorController.updateStatus);
router.delete("/supervisors/:id", supervisorController.remove);
router.get("/supervisors/:id/guards", supervisorController.getGuardsBySupervisorId);
// Note: PUT/DELETE for supervisors might need to stay or be aliased; 
// fitting them into this structure implies /api/admin/supervisors/:id

// Admin Management (The old /api/admins routes)
// Maybe alias these to /api/admin/accounts or similar if needed, 
// but user only asked for specific routes. We can keep basic CRUD here if desired.
router.get("/accounts", getAllAdmins);

export default router;

