import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check in users(admins) table - Case insensitive
    let userRes = await query("SELECT * FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))", [email]);
    let table = "users";

    if (userRes.rowCount === 0) {
      // Check in supervisors
      userRes = await query("SELECT * FROM supervisors WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))", [email]);
      table = "supervisors";
    }

    if (userRes.rowCount === 0) {
      // Check in guards
      userRes = await query("SELECT * FROM guards WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))", [email]);
      table = "guards";
    }

    if (userRes.rowCount > 0) {
      const user = userRes.rows[0];
      console.log(`Login attempt for email: ${email}, found in table: ${table}`);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`Password match result: ${isMatch}`);

      if (isMatch) {
        res.json({
          id: user.id,
          name: user.name || user.full_name,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          token: generateToken(user.id),
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      console.log(`Login attempt failed: Email ${email} not found in any user table.`);

      // Safety check: if no admins exist at all, suggest seeding
      const anyUser = await query("SELECT 1 FROM users LIMIT 1");
      if (anyUser.rowCount === 0) {
        return res.status(401).json({
          message: "No administrator found in system. Please run seed-admin endpoint.",
          action_required: "seed_needed"
        });
      }

      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      db_status: "Connection attempt failed"
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let table = "users";
    if (role === 'supervisor') table = "supervisors";
    if (role === 'guard') table = "guards";

    const userRes = await query(`SELECT * FROM ${table} WHERE id = $1`, [userId]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await query(`UPDATE ${table} SET password = $1 WHERE id = $2`, [hashedPassword, userId]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let table = "users";
    let nameColumn = "name";
    if (role === 'supervisor') {
      table = "supervisors";
      nameColumn = "full_name";
    }
    if (role === 'guard') {
      table = "guards";
      nameColumn = "full_name";
    }

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const emailExistsInUsers = await query("SELECT 1 FROM users WHERE email = $1 AND id != $2", [email, table === 'users' ? userId : -1]);
      const emailExistsInSupervisors = await query("SELECT 1 FROM supervisors WHERE email = $1 AND id != $2", [email, table === 'supervisors' ? userId : -1]);
      const emailExistsInGuards = await query("SELECT 1 FROM guards WHERE email = $1 AND id != $2", [email, table === 'guards' ? userId : -1]);

      if (emailExistsInUsers.rowCount > 0 || emailExistsInSupervisors.rowCount > 0 || emailExistsInGuards.rowCount > 0) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    await query(
      `UPDATE ${table} SET ${nameColumn} = $1, email = $2 WHERE id = $3`,
      [name || req.user.name, email || req.user.email, userId]
    );

    res.json({
      id: userId,
      name: name || req.user.name,
      email: email || req.user.email,
      role: role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Manually seed admin user
// @route   GET /api/auth/seed-admin
// @access  Public (Emergency only)
export const seedAdmin = async (req, res) => {
  try {
    console.log("Starting exhaustive manual seed...");
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "admin123";
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);

    // 1. Create ALL tables (in case initSchema failed)
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL DEFAULT 'Admin',
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS supervisors (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'supervisor',
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS guards (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        password VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'guard',
        address TEXT NOT NULL,
        date_of_birth DATE NOT NULL,
        emergency_contact VARCHAR(50) NOT NULL,
        assigned_area VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'Active',
        supervisor_id INTEGER REFERENCES supervisors(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Clear then Insert/Update Admin to be absolutely sure
    await query("DELETE FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))", [adminEmail]);
    const result = await query(
      `INSERT INTO users (email, password, name, role) 
       VALUES ($1, $2, $3, $4)
       RETURNING id, email`,
      [adminEmail, hashedAdminPassword, "Admin", "admin"]
    );

    // 3. Get total counts for diagnosis
    const userCount = await query("SELECT COUNT(*) FROM users");
    const supervisorCount = await query("SELECT COUNT(*) FROM supervisors");

    res.json({
      success: true,
      message: "Admin user RE-SEEDED successfully",
      admin: result.rows[0],
      diagnostics: {
        totalUsers: userCount.rows[0].count,
        totalSupervisors: supervisorCount.rows[0].count,
        databaseTarget: process.env.DATABASE_URL ? "Remote/Production" : "Local/Fallback",
        db_url_masked: process.env.DATABASE_URL ? (process.env.DATABASE_URL.substring(0, 15) + "...") : "none",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Exhaustive seed failed:", error);
    res.status(500).json({
      success: false,
      message: "Seeding failed",
      error: error.message,
      stack: error.stack
    });
  }
};

