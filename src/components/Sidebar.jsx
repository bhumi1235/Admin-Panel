import { Link } from "react-router-dom";
import { LayoutDashboard, Users } from "lucide-react";

function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#0f172a",
      color: "white",
      padding: "20px"
    }}>
      <h2 style={{ fontSize: "18px", marginBottom: "30px" }}>Admin Panel</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
          <LayoutDashboard size={18}/> Dashboard
        </Link>

        <Link to="/supervisors" style={{ color: "white", textDecoration: "none" }}>
          <Users size={18}/> Supervisors
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
