import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import supervisorRoutes from "./routes/supervisorRoutes.js";
import guardRoutes from "./routes/guardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import resetRoutes from "./routes/resetRoutes.js";
import dutyTypeRoutes from "./routes/dutyTypeRoutes.js";

// ... other imports

// generic auth...
app.use("/api/auth", authRoutes);

// Admin Directed Routes
app.use("/api/admin", adminRoutes);

app.use("/api/guards", protect, guardRoutes);
app.use("/api/duty-types", protect, authorize("admin"), dutyTypeRoutes);

app.use("/api/reset-database", resetRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Security Guard Admin API",
    deployment_time: new Date().toISOString()
  });
});

export default app;
