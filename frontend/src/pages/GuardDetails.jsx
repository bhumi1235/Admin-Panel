import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, AlertCircle, Shield, User, Activity, ToggleLeft, ToggleRight } from "lucide-react";
import api from "../api/api";
import "../styles/global/layout.css";
import "../styles/shared/Details.css";

function GuardDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const fromSupervisorId = state?.fromSupervisorId;
    const [guard, setGuard] = useState(null);
    const [supervisor, setSupervisor] = useState(null);

    useEffect(() => {
        const fetchGuard = async () => {
            try {
                const res = await api.get(`/api/guards/${id}`);
                const g = res.data.data;

                const formattedGuard = {
                    id: g.id,
                    name: g.fullName,
                    email: g.email,
                    phone: g.phone,
                    emergencyContact: g.emergencyContact,
                    dateOfBirth: g.dateOfBirth,
                    address: g.address,
                    assignedArea: g.assignedArea,
                    status: g.status,
                    supervisorId: g.supervisorId
                };

                setGuard(formattedGuard);

                if (g.supervisorId) {
                    const supRes = await api.get(`/api/admin/supervisors/${g.supervisorId}`);
                    const s = supRes.data.data;

                    setSupervisor({
                        id: s.id,
                        fullName: s.fullName,
                        email: s.email,
                        phone: s.phone,
                        status: s.status
                    });
                }

            } catch (err) {
                console.error("Failed to load guard:", err);
                navigate('/guards');
            }
        };

        fetchGuard();
    }, [id, navigate]);




    const handleStatusToggle = async () => {
        try {
            const newStatus = guard.status === "Active" ? "Inactive" : "Active";

            await api.put(`/api/guards/${id}/status`, {
                status: newStatus
            });

            setGuard({ ...guard, status: newStatus });

        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Status update failed");
        }
    };


    if (!guard) {
        return (
            <div className="page-container">
                <Sidebar />
                <div className="page-main">
                    <Navbar />
                    <div className="page-content" style={{ textAlign: "center" }}>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <Sidebar />

            <div className="page-main">
                <Navbar />

                <div className="page-content">
                    {/* Back Button */}
                    <button
                        onClick={() => fromSupervisorId
                            ? navigate(`/supervisors/${fromSupervisorId}/guards`)
                            : navigate('/guards')
                        }
                        className="btn-back"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        <ArrowLeft size={16} />
                        {fromSupervisorId ? "Back to Supervisor's Guards" : "Back to All Guards"}
                    </button>

                    {/* Header */}
                    <div style={{ marginBottom: "2rem" }}>
                        <h1 style={{
                            fontSize: "2rem",
                            fontWeight: "700",
                            color: "#111827",
                            marginBottom: "0.5rem"
                        }}>
                            Guard Details
                        </h1>
                        <p style={{
                            fontSize: "1rem",
                            color: "#6b7280",
                            margin: 0
                        }}>
                            View and manage security guard information
                        </p>
                    </div>

                    {/* Information Grid */}
                    <div className="info-grid">
                        {/* Contact Information */}
                        <div className="info-card">
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "1.5rem"
                            }}>
                                <h2 className="info-card-title">
                                    <Phone size={20} />
                                    Contact Information
                                </h2>
                                <span className={`status-badge-sm ${guard.status === "Active" ? "active" : "inactive"}`}>
                                    {guard.status || "—"}
                                </span>
                            </div>
                            <div className="info-items-container">
                                <div>
                                    <p className="info-item-label">Full Name</p>
                                    <p className="info-item-text" style={{ fontWeight: "700", fontSize: "1.125rem" }}>
                                        {guard.name || "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="info-item-label">Email Address</p>
                                    <div className="info-item-value-box">
                                        <Mail size={18} style={{ color: "#3b82f6", flexShrink: 0 }} />
                                        <p className="info-item-text">{guard.email || "—"}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="info-item-label">Phone Number</p>
                                    <div className="info-item-value-box">
                                        <Phone size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                                        <p className="info-item-text">{guard.phone || "—"}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="info-item-label">Emergency Contact</p>
                                    <div className="info-item-value-box">
                                        <AlertCircle size={18} style={{ color: "#ef4444", flexShrink: 0 }} />
                                        <p className="info-item-text">{guard.emergencyContact || "—"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="info-card">
                            <h2 className="info-card-title">
                                <User size={20} />
                                Personal Information
                            </h2>
                            <div className="info-items-container">
                                <div>
                                    <p className="info-item-label">Date of Birth</p>
                                    <div className="info-item-value-box">
                                        <Calendar size={18} style={{ color: "#8b5cf6", flexShrink: 0 }} />
                                        <p className="info-item-text">
                                            {guard.dateOfBirth && !Number.isNaN(new Date(guard.dateOfBirth).getTime())
                                                ? new Date(guard.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                                                : "—"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="info-item-label">Address</p>
                                    <div className="info-item-value-box" style={{ alignItems: "flex-start" }}>
                                        <MapPin size={18} style={{ color: "#f59e0b", flexShrink: 0, marginTop: "0.125rem" }} />
                                        <p className="info-item-text" style={{ lineHeight: "1.6" }}>
                                            {guard.address || "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Assignment Information */}
                        <div className="info-card">
                            <h2 className="info-card-title">
                                <Shield size={20} />
                                Assignment Details
                            </h2>
                            <div className="info-items-container">
                                <div>
                                    <p className="info-item-label">Assigned Area</p>
                                    <div className="info-item-value-box highlight">
                                        <Shield size={18} style={{ color: "#0d7377", flexShrink: 0 }} />
                                        <p className="info-item-text" style={{ color: "#0d7377", fontWeight: "600" }}>
                                            {guard.assignedArea || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="info-item-label">Supervisor</p>
                                    <div
                                        onClick={supervisor ? () => navigate(`/supervisors/${guard.supervisorId}`) : undefined}
                                        className={`info-item-value-box ${supervisor ? "clickable" : ""}`}
                                        style={{
                                            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.08) 100%)",
                                            borderColor: "rgba(59, 130, 246, 0.2)"
                                        }}
                                    >
                                        <User size={18} style={{ color: "#2563eb", flexShrink: 0 }} />
                                        <p className="info-item-text" style={{ color: "#2563eb", fontWeight: "600" }}>
                                            {supervisor ? supervisor.fullName : "Unassigned"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="info-item-label">Status</p>
                                    <div
                                        className="info-item-value-box"
                                        style={{
                                            background: guard.status === "Active"
                                                ? "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.12) 100%)"
                                                : "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.12) 100%)",
                                            borderColor: guard.status === "Active"
                                                ? "rgba(16, 185, 129, 0.25)"
                                                : "rgba(239, 68, 68, 0.25)"
                                        }}
                                    >
                                        <Activity size={18} style={{
                                            color: guard.status === "Active" ? "#059669" : "#dc2626",
                                            flexShrink: 0
                                        }} />
                                        <p className="info-item-text" style={{
                                            color: guard.status === "Active" ? "#059669" : "#dc2626",
                                            fontWeight: "600",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.05em"
                                        }}>
                                            {guard.status || "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="info-card">
                            <h2 className="info-card-title">
                                <Activity size={20} />
                                Quick Actions
                            </h2>
                            <div className="action-buttons-container">
                                {supervisor && (
                                    <button
                                        onClick={() => navigate(`/supervisors/${guard.supervisorId}`)}
                                        className="btn-action-lg btn-blue-gradient"
                                    >
                                        <User size={18} />
                                        View Supervisor
                                    </button>
                                )}
                                <button
                                    onClick={handleStatusToggle}
                                    className={`btn-action-lg ${guard.status === "Active" ? "btn-red-gradient" : "btn-green-gradient"}`}
                                >
                                    {guard.status === "Active" ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                    {guard.status === "Active" ? "Deactivate" : "Activate"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GuardDetails;

