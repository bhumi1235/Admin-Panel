import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

// Support both DATABASE_URL (for Railway/Neon) and individual parameters (for local dev)
const pool = (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("your-neon-connection"))
  ? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Neon and most cloud PostgreSQL providers
    },
  })
  : new Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    database: process.env.DB_NAME || "secureguard",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1375",
  });

export async function query(text, params = []) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

export async function initSchema() {
  // Migration: Add role column if it doesn't exist
  try {
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'admin'`);
    await query(`ALTER TABLE supervisors ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'supervisor'`);
    await query(`ALTER TABLE guards ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'guard'`);
    await query(`ALTER TABLE guards ADD COLUMN IF NOT EXISTS password VARCHAR(255)`);
  } catch (err) {
    console.log("Migration (columns) maybe already done or failed:", err.message);
  }

  // Users table (Admins/Main Staff)
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL DEFAULT 'Admin',
      role VARCHAR(50) NOT NULL DEFAULT 'admin'
    );
  `);

  // Supervisors table
  await query(`
    CREATE TABLE IF NOT EXISTS supervisors (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'supervisor',
      status VARCHAR(20) NOT NULL DEFAULT 'Active',
      created_date DATE NOT NULL DEFAULT CURRENT_DATE
    );
  `);

  // Guards table
  await query(`
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
      supervisor_id INTEGER REFERENCES supervisors(id) ON DELETE SET NULL
    );
  `);

  // Ensure Admin user exists
  console.log("Checking for default admin user...");
  const adminCheck = await query("SELECT id FROM users WHERE email = $1", ["admin@example.com"]);

  if (adminCheck.rowCount === 0) {
    console.log("Admin not found. Seeding default admin user...");
    const adminPassword = "admin123";
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);

    await query(
      `INSERT INTO users (email, password, name, role) 
       VALUES ($1, $2, $3, $4)`,
      ["admin@example.com", hashedAdminPassword, "Admin", "admin"]
    );
    console.log("Admin user seeded.");
  } else {
    console.log("Admin user already exists.");
  }
}

function mapSupervisor(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    password: row.password,
    status: row.status,
    createdDate: row.created_date ? (typeof row.created_date === "string" ? row.created_date : row.created_date.toISOString().split("T")[0]) : null,
  };
}

function mapGuard(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    dateOfBirth: row.date_of_birth ? (typeof row.date_of_birth === "string" ? row.date_of_birth : row.date_of_birth.toISOString().split("T")[0]) : null,
    emergencyContact: row.emergency_contact,
    assignedArea: row.assigned_area,
    status: row.status,
    supervisorId: row.supervisor_id,
  };
}

export { mapSupervisor, mapGuard };
