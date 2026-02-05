function Navbar() {
  return (
    <div style={{
      height: "60px",
      background: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      borderBottom: "1px solid #e5e7eb"
    }}>
      <h3>Admin Dashboard</h3>
      <button>Logout</button>
    </div>
  );
}

export default Navbar;
