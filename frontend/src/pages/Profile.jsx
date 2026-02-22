import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { User, Mail, Shield, Calendar, ArrowLeft } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../styles/global/layout.css";
import "../styles/shared/Details.css";

function Profile() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/api/admin/profile");
                const userData = res.data.userData || res.data.data || res.data;
                if (userData) setUser(userData);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };
        fetchProfile();
    }, [setUser]);

    const adminName = user?.name || user?.fullName || "Admin";
    const adminEmail = user?.email || "";
    const userRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : "Administrator";
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    };
    const joinDate = formatDate(user?.createdAt || user?.created_at);

    return (
        <div className="page-container">
            <Sidebar />
            <div className="page-main">
                <Navbar />
                <div className="page-content">
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-back back-button-styled"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <div className="info-card" style={{ maxWidth: "560px" }}>
                        <h2 className="info-card-title" style={{ marginBottom: "1.5rem" }}>
                            Admin Profile
                        </h2>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1.5rem",
                            marginBottom: "2rem",
                            paddingBottom: "2rem",
                            borderBottom: "1px solid #e5e7eb"
                        }}>
                            <div style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #0d7377 0%, #14a0a5 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "4px solid #e5e7eb"
                            }}>
                                <User size={40} color="white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700", color: "#111827" }}>
                                    {adminName}
                                </p>
                                <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
                                    {userRole}
                                </p>
                            </div>
                        </div>

                        <div className="info-items-container">
                            <div className="info-item-value-box">
                                <Mail size={20} color="#0d7377" />
                                <div>
                                    <p className="info-item-label" style={{ marginBottom: "0.25rem" }}>Email</p>
                                    <p className="info-item-text" style={{ fontWeight: "600" }}>{adminEmail || "—"}</p>
                                </div>
                            </div>
                            <div className="info-item-value-box">
                                <Shield size={20} color="#0d7377" />
                                <div>
                                    <p className="info-item-label" style={{ marginBottom: "0.25rem" }}>Role</p>
                                    <p className="info-item-text" style={{ fontWeight: "600" }}>{userRole}</p>
                                </div>
                            </div>
                            <div className="info-item-value-box">
                                <Calendar size={20} color="#0d7377" />
                                <div>
                                    <p className="info-item-label" style={{ marginBottom: "0.25rem" }}>Member Since</p>
                                    <p className="info-item-text" style={{ fontWeight: "600" }}>{joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
