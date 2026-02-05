import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        width: "350px",
        padding: "30px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px"
      }}>
        <h2>Admin Login</h2>

        <input placeholder="Email" style={{ width: "100%", marginTop: "10px" }} />
        <input placeholder="Password" type="password" style={{ width: "100%", marginTop: "10px" }} />

        <button 
          onClick={handleLogin}
          style={{ width: "100%", marginTop: "20px" }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
