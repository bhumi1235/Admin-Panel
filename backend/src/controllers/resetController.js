import { query, initSchema } from "../config/db.js";

export const resetDatabase = async (req, res) => {
    try {
        // Drop all tables in reverse order (to handle foreign keys)
        await query("DROP TABLE IF EXISTS guards CASCADE");
        await query("DROP TABLE IF EXISTS supervisors CASCADE");
        await query("DROP TABLE IF EXISTS users CASCADE");

        // Recreate schema by calling initSchema
        await initSchema();

        res.status(200).json({
            success: true,
            message: "Database reset successfully"
        });
    } catch (err) {
        console.error("Reset database error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to reset database",
            error: err.message
        });
    }
};

