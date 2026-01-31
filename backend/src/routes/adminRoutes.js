import express from "express";
import {
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.route("/")
    .get(getAllAdmins)
    .post(createAdmin);

router.route("/:id")
    .put(updateAdmin)
    .delete(deleteAdmin);

export default router;

