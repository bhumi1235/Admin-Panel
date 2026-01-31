import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

function ResetData() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const resetDatabase = async () => {
            try {
                // Clear authentication
                logout();

                // Call backend API to reset database
                await api.post(`/api/reset-database`);

                // Redirect to login after reset
                setTimeout(() => {
                    alert('Database has been reset! Please login again.');
                    navigate('/');
                }, 1000);
            } catch (err) {
                console.error("Failed to reset database:", err);
                alert('Failed to reset database. Please try again.');
                navigate('/');
            }
        };

        resetDatabase();
    }, [navigate]);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "600"
        }}>
            Resetting database...
        </div>
    );
}

export default ResetData;

