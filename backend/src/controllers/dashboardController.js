import { query } from "../config/db.js";

export async function getStats(req, res) {
  try {
    const [sup, actSup, guard, actGuard] = await Promise.all([
      query("SELECT COUNT(*)::int AS n FROM supervisors"),
      query("SELECT COUNT(*)::int AS n FROM supervisors WHERE status = 'Active'"),
      query("SELECT COUNT(*)::int AS n FROM guards"),
      query("SELECT COUNT(*)::int AS n FROM guards WHERE status = 'Active'")
    ]);
    res.status(200).json({
      totalSupervisors: sup.rows[0].n,
      activeSupervisors: actSup.rows[0].n,
      totalGuards: guard.rows[0].n,
      activeGuards: actGuard.rows[0].n
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

