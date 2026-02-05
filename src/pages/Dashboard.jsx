import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "20px" }}>
          <h2>Dashboard</h2>

          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <div style={{ padding: "20px", background: "#f1f5f9", borderRadius: "8px" }}>
              <h3>Total Supervisors</h3>
              <p>2</p>
            </div>

            <div style={{ padding: "20px", background: "#f1f5f9", borderRadius: "8px" }}>
              <h3>Total Guards</h3>
              <p>3</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
