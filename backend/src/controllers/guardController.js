import { query, mapGuard } from "../config/db.js";

const ALLOWED = ["fullName", "email", "phone", "address", "dateOfBirth", "emergencyContact", "assignedArea", "status", "supervisorId"];
const COL = { fullName: "full_name", dateOfBirth: "date_of_birth", emergencyContact: "emergency_contact", assignedArea: "assigned_area", supervisorId: "supervisor_id" };

export async function getAll(req, res) {
  try {
    const r = await query("SELECT * FROM guards ORDER BY id");
    res.status(200).json(r.rows.map(mapGuard));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req, res) {
  try {
    const data = req.body || {};
    const cols = [];
    const syms = [];
    const vals = [];
    let i = 1;

    for (const k of ALLOWED) {
      if (data[k] === undefined) continue;
      cols.push(COL[k] || k);
      syms.push(`$${i}`);
      vals.push(data[k]);
      i++;
    }

    if (cols.length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }

    const q = `INSERT INTO guards (${cols.join(", ")}) VALUES (${syms.join(", ")}) RETURNING *`;
    const r = await query(q, vals);
    res.status(201).json(mapGuard(r.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const r = await query("SELECT * FROM guards WHERE id = $1", [id]);
    const guard = r.rows[0];
    if (!guard) {
      return res.status(404).json({ error: "Guard not found" });
    }
    res.status(200).json(mapGuard(guard));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function update(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const updates = req.body || {};
    const r = await query("SELECT * FROM guards WHERE id = $1", [id]);
    if (!r.rows.length) {
      return res.status(404).json({ error: "Guard not found" });
    }
    const setParts = [];
    const vals = [];
    let i = 1;
    for (const k of ALLOWED) {
      if (updates[k] === undefined) continue;
      const col = COL[k] || k;
      setParts.push(`${col} = $${i}`);
      vals.push(updates[k]);
      i++;
    }
    if (setParts.length === 0) {
      return res.status(200).json(mapGuard(r.rows[0]));
    }
    vals.push(id);
    const u = await query(
      `UPDATE guards SET ${setParts.join(", ")} WHERE id = $${i} RETURNING *`,
      vals
    );
    res.status(200).json(mapGuard(u.rows[0]));
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
    const r = await query("SELECT * FROM guards WHERE id = $1", [id]);
    if (!r.rows.length) {
      return res.status(404).json({ error: "Guard not found" });
    }
    const u = await query(
      "UPDATE guards SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    res.status(200).json(mapGuard(u.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const r = await query("DELETE FROM guards WHERE id = $1 RETURNING id", [id]);
    if (!r.rows.length) {
      return res.status(404).json({ error: "Guard not found" });
    }
    res.status(200).json({ message: "Guard deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

