import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import supervisorRoutes from "./routes/supervisorRoutes.js";
import guardRoutes from "./routes/guardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import resetRoutes from "./routes/resetRoutes.js";
import { protect, authorize } from "./middlewares/authMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());
app.options("*", cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/supervisors", protect, authorize("admin"), supervisorRoutes);
app.use("/api/guards", protect, guardRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);
app.use("/api/reset-database", resetRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, message: "Security Guard Admin API" });
});

export default app;
