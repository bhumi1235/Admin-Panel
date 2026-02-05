import bcrypt from "bcryptjs";
import { query } from "../config/db.js";

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private/Admin
export const getAllAdmins = async (req, res) => {
    try {
        const r = await query("SELECT id, email, name, role FROM users ORDER BY id");
        res.json(r.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new admin (Bootstrap)
// @route   POST /api/admin/create-admin
// @access  Public (for now)
export const createAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const exists = await query("SELECT 1 FROM users WHERE email = $1", [email]);
        if (exists.rowCount > 0) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const r = await query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, role || "admin"]
        );

        res.status(201).json(r.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private/Admin
export const updateAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;
    const id = req.params.id;

    try {
        const userRes = await query("SELECT * FROM users WHERE id = $1", [id]);
        if (userRes.rowCount === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        let pw = userRes.rows[0].password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            pw = await bcrypt.hash(password, salt);
        }

        const r = await query(
            "UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING id, name, email, role",
            [name || userRes.rows[0].name, email || userRes.rows[0].email, pw, role || userRes.rows[0].role, id]
        );

        res.json(r.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete admin
// @route   DELETE /api/admins/:id
// @access  Private/Admin
export const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        // Prevent self-deletion
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: "You cannot delete your own account" });
        }

        await query("DELETE FROM users WHERE id = $1", [id]);
        res.json({ message: "Admin removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

