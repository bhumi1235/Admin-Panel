import { query, mapSupervisor, mapGuard } from "../config/db.js";
import bcrypt from "bcryptjs";

export async function getAll(req, res) {
  try {
    const r = await query("SELECT * FROM supervisors ORDER BY id");
    res.status(200).json(r.rows.map(mapSupervisor));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const r = await query("SELECT * FROM supervisors WHERE id = $1", [id]);
    const supervisor = r.rows[0];
    if (!supervisor) {
      return res.status(404).json({ error: "Supervisor not found" });
    }
    res.status(200).json(mapSupervisor(supervisor));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const { fullName, email, phone, password, status } = req.body || {};
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ error: "fullName, email, phone, and password are required" });
    }
    const exists = await query(
      "SELECT 1 FROM supervisors WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))",
      [email]
    );
    if (exists.rows.length) {
      return res.status(409).json({ error: "A supervisor with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const r = await query(
      `INSERT INTO supervisors (full_name, email, phone, password, status, created_date)
       VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
       RETURNING *`,
      [fullName, String(email).trim(), phone, hashedPassword, status || "Active"]
    );
    res.status(201).json(mapSupervisor(r.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { fullName, email, phone, password, status } = req.body || {};
    const r = await query("SELECT * FROM supervisors WHERE id = $1", [id]);
    if (!r.rows.length) {
      return res.status(404).json({ error: "Supervisor not found" });
    }
    const cur = r.rows[0];
    const fn = fullName !== undefined ? fullName : cur.full_name;
    const em = email !== undefined ? email : cur.email;
    const ph = phone !== undefined ? phone : cur.phone;

    let pw = cur.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      pw = await bcrypt.hash(password, salt);
    }

    const st = status !== undefined ? status : cur.status;
    const u = await query(
      `UPDATE supervisors SET full_name = $1, email = $2, phone = $3, password = $4, status = $5 WHERE id = $6 RETURNING *`,
      [fn, em, ph, pw, st, id]
    );
    res.status(200).json(mapSupervisor(u.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateStatus(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body || {};
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const r = await query("SELECT * FROM supervisors WHERE id = $1", [id]);
    if (!r.rows.length) {
      return res.status(404).json({ error: "Supervisor not found" });
    }
    const u = await query(
      "UPDATE supervisors SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    res.status(200).json(mapSupervisor(u.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const r = await query(
      "UPDATE supervisors SET status = 'Terminated' WHERE id = $1 RETURNING *",
      [id]
    );
    if (!r.rows.length) {
      return res.status(404).json({ error: "Supervisor not found" });
    }
    res.status(200).json({ message: "Supervisor terminated", supervisor: mapSupervisor(r.rows[0]) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getGuardsBySupervisorId(req, res) {
  try {
    const supervisorId = parseInt(req.params.id, 10);
    const r = await query("SELECT * FROM guards WHERE supervisor_id = $1 ORDER BY id", [supervisorId]);
    res.status(200).json(r.rows.map(mapGuard));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

