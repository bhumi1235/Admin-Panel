import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

            // Get user from token
            // Check admins/users table first
            let userRes = await query("SELECT id, email, name, role FROM users WHERE id = $1", [decoded.id]);

            if (userRes.rowCount === 0) {
                // Check supervisors table
                userRes = await query("SELECT id, email, full_name as name, role FROM supervisors WHERE id = $1", [decoded.id]);
            }

            if (userRes.rowCount === 0) {
                // Check guards table
                userRes = await query("SELECT id, email, full_name as name, role FROM guards WHERE id = $1", [decoded.id]);
            }

            if (userRes.rowCount === 0) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            req.user = userRes.rows[0];
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
