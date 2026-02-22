import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { ArrowLeft, Mail, Phone, Calendar, Shield, ToggleLeft, ToggleRight, FileText, FileSpreadsheet } from "lucide-react";
import api from "../api/api";
import { getImageUrl } from "../utils/imageUtils";
import { API_BASE_URL } from "../config/config";
import "../styles/global/layout.css";
import "../styles/shared/Details.css";

const downloadFile = async (url, filename) => {
    const token = localStorage.getItem("token");
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

function SupervisorDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [supervisor, setSupervisor] = useState(null);
    const [guards, setGuards] = useState([]);
    const [guardsCount, setGuardsCount] = useState(0);

    useEffect(() => {
        const fetchSupervisorAndGuards = async () => {
            try {
                // supervisor
                const supRes = await api.get(`/api/admin/supervisors/${id}`);
                const s = supRes.data.data;

                setSupervisor({
                    id: s.id,
                    fullName: s.fullName || s.full_name,
                    email: s.email,
                    phone: s.phone,
                    status: s.status,
                    createdDate: s.createdDate || s.created_date,
                    profileImage: s.profileImage || s.profile_image
                });

                // guards
                const guardsRes = await api.get(`/api/admin/supervisors/${id}/guards`);
                const formattedGuards = guardsRes.data.data.map(g => ({
                    id: g.id,
                    name: g.fullName,
                    phone: g.phone,
                    assignedArea: g.assignedArea,
                    status: g.status
                }));

                setGuards(formattedGuards);
                setGuardsCount(guardsRes.data.data.length);

            } catch (err) {
                console.error("Failed to load supervisor/guards:", err);
                navigate('/supervisors');
            }
        };

        fetchSupervisorAndGuards();
    }, [id, navigate]);

    const handleSupervisorStatusToggle = async () => {
        try {
            const newStatus = supervisor.status === "Active" ? "Suspended" : "Active";
            await api.put(`/api/admin/supervisors/${id}/status`, {
                status: newStatus
            });
            setSupervisor({ ...supervisor, status: newStatus });
        } catch (err) {
            console.error("Failed to update supervisor status:", err);
            alert("Status update failed");
        }
    };

    const columns = [
        {
            header: "Guard Name",
            accessor: "name",
            render: (row) => (
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div className="table-avatar">
                        {row.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="table-name">
                        {row.name}
                    </span>
                </div>
            )
        },
        {
            header: "Phone Number",
            accessor: "phone",
            render: (row) => (
                <div className="table-phone">
                    {row.phone}
                </div>
            )
        },
        {
            header: "Assigned Area",
            accessor: "assignedArea",
            render: (row) => (
                <div className="area-badge">
                    <Shield size={15} strokeWidth={2.5} />
                    {row.assignedArea}
                </div>
            )
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <span className={`status-badge-sm ${row.status.toLowerCase()}`}>
                    <div className={`status-dot-sm ${row.status.toLowerCase()}`}></div>
                    {row.status}
                </span>
            )
        },
        {
            header: "Actions",
            render: (row) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/guards/${row.id}`);
                    }}
                    className="btn-table-action btn-blue-gradient"
                >
                    View
                </button>
            )
        }
    ];

    if (!supervisor) {
        return (
            <div className="page-container">
                <Sidebar />
                <div className="page-main">
                    <Navbar />
                    <div className="page-content" style={{ textAlign: "center", justifyContent: "center" }}>
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
                    {/* Header */}
                    <div style={{ marginBottom: "2rem" }}>
                        <button
                            onClick={() => navigate('/supervisors')}
                            className="back-button"
                            style={{ marginBottom: "1rem" }}
                        >
                            <ArrowLeft size={16} />
                            back to Supervisors
                        </button>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                            <div>
                                <h1 style={{
                                    fontSize: "2rem",
                                    fontWeight: "700",
                                    color: "#111827",
                                    marginBottom: "0.5rem"
                                }}>
                                    Supervisor Details
                                </h1>
                                <p style={{
                                    fontSize: "1rem",
                                    color: "#6b7280",
                                    margin: 0
                                }}>
                                    View and manage supervisor information and assigned guards
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                                <button
                                    onClick={async () => {
                                        try {
                                            const url = `${API_BASE_URL}/api/admin/supervisors/${id}/export/pdf`;
                                            await downloadFile(url, `Supervisor_${supervisor.fullName?.replace(/\s+/g, "_")}.pdf`);
                                        } catch (e) {
                                            alert("PDF download failed. Please try again.");
                                        }
                                    }}
                                    className="btn-download"
                                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                                >
                                    <FileText size={18} />
                                    PDF Download
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            const url = `${API_BASE_URL}/api/admin/supervisors/${id}/export/excel`;
                                            await downloadFile(url, `Supervisor_${supervisor.fullName?.replace(/\s+/g, "_")}.xlsx`);
                                        } catch (e) {
                                            alert("Excel download failed. Please try again.");
                                        }
                                    }}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        padding: "0.5rem 1rem",
                                        background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        fontSize: "0.875rem",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    <FileSpreadsheet size={18} />
                                    Excel Download
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="info-grid">
                        {/* Personal Information Card */}
                        <div className="info-card">
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: "1.5rem"
                            }}>
                                <h3 className="info-card-title">
                                    Personal Information
                                </h3>
                                <span className={`status-badge-sm ${supervisor.status.toLowerCase()}`}>
                                    {supervisor.status}
                                </span>
                            </div>

                            {/* Supervisor profile photo */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1.5rem",
                                marginBottom: "1.5rem",
                                paddingBottom: "1.5rem",
                                borderBottom: "1px solid #e5e7eb"
                            }}>
                                <div style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    background: getImageUrl(supervisor.profileImage)
                                        ? `url(${getImageUrl(supervisor.profileImage)}) center/cover`
                                        : "linear-gradient(135deg, #0d7377 0%, #14a0a5 100%)",
                                    border: "3px solid #e5e7eb",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.5rem",
                                    fontWeight: "700",
                                    color: "white"
                                }}>
                                    {!getImageUrl(supervisor.profileImage) && (supervisor.fullName?.split(" ").map(n => n[0]).join("") || "S")}
                                </div>
                                <div>
                                    <p className="info-item-label" style={{ marginBottom: "0.25rem" }}>Profile</p>
                                    <p className="info-item-text" style={{ fontWeight: "600", fontSize: "1.125rem" }}>
                                        {supervisor.fullName}
                                    </p>
                                </div>
                            </div>

                            <div className="info-items-container">
                                <div>
                                    <p className="info-item-label">Full Name</p>
                                    <p className="info-item-text" style={{ fontWeight: "700", fontSize: "1.125rem" }}>
                                        {supervisor.fullName}
                                    </p>
                                </div>

                                <div className="info-item-value-box">
                                    <Mail size={18} color="#6b7280" />
                                    <div>
                                        <p className="info-item-label" style={{ marginBottom: "0.125rem" }}>Email</p>
                                        <p className="info-item-text">{supervisor.email}</p>
                                    </div>
                                </div>

                                <div className="info-item-value-box">
                                    <Phone size={18} color="#6b7280" />
                                    <div>
                                        <p className="info-item-label" style={{ marginBottom: "0.125rem" }}>Phone</p>
                                        <p className="info-item-text">{supervisor.phone}</p>
                                    </div>
                                </div>

                                <div className="info-item-value-box">
                                    <Calendar size={18} color="#6b7280" />
                                    <div>
                                        <p className="info-item-label" style={{ marginBottom: "0.125rem" }}>Created Date</p>
                                        <p className="info-item-text">
                                            {new Date(supervisor.createdDate).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="info-card">
                            <h3 className="info-card-title">
                                Quick Stats
                            </h3>

                            <div className="stats-banner-card">
                                <div className="stats-banner-title">
                                    <Shield size={24} />
                                    <p className="stats-banner-label">
                                        Assigned Guards
                                    </p>
                                </div>
                                <p className="stats-banner-value">
                                    {guardsCount}
                                </p>
                            </div>

                            <button
                                onClick={handleSupervisorStatusToggle}
                                className={`btn-action-lg ${supervisor.status === "Active" ? "btn-red-gradient" : "btn-green-gradient"}`}
                            >
                                {supervisor.status === "Active" ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                {supervisor.status === "Active" ? "Deactivate Supervisor" : "Activate Supervisor"}
                            </button>
                        </div>
                    </div>

                    {/* Incorporated Guards Table */}
                    <div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "1.5rem"
                        }}>
                            <h2 className="details-section-title" style={{ margin: 0 }}>
                                Assigned Guards
                            </h2>

                        </div>
                        <Table
                            columns={columns}
                            data={guards}
                            emptyMessage={`No guards assigned to ${supervisor.fullName} yet.`}
                            onRowClick={(row) => navigate(`/guards/${row.id}`)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupervisorDetails;

