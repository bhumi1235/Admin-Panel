import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { ArrowLeft, Mail, Phone, Calendar, Shield, ToggleLeft, ToggleRight, UserPlus } from "lucide-react";
import api from "../api/api";
import "../styles/global/layout.css";
import "../styles/shared/Details.css";

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
                const supRes = await api.get(`/api/supervisors/${id}`);
                const s = supRes.data;

                setSupervisor({
                    id: s.id,
                    fullName: s.fullName,
                    email: s.email,
                    phone: s.phone,
                    status: s.status,
                    createdDate: s.createdDate
                });

                // guards
                const guardsRes = await api.get(`/api/supervisors/${id}/guards`);
                const formattedGuards = guardsRes.data.map(g => ({
                    id: g.id,
                    name: g.fullName,
                    phone: g.phone,
                    assignedArea: g.assignedArea,
                    status: g.status
                }));

                setGuards(formattedGuards);
                setGuardsCount(guardsRes.data.length);

            } catch (err) {
                console.error("Failed to load supervisor/guards:", err);
                navigate('/supervisors');
            }
        };

        fetchSupervisorAndGuards();
    }, [id, navigate]);

    const handleSupervisorStatusToggle = async () => {
        try {
            const newStatus = supervisor.status === "Active" ? "Inactive" : "Active";
            await api.put(`/api/supervisors/${id}/status`, {
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
                    onClick={async (e) => {
                        e.stopPropagation();
                        try {
                            const newStatus = row.status === "Active" ? "Inactive" : "Active";
                            await api.put(`/api/guards/${row.id}/status`, {
                                status: newStatus
                            });

                            // Update local state
                            setGuards(guards.map(g =>
                                g.id === row.id ? { ...g, status: newStatus } : g
                            ));
                        } catch (err) {
                            console.error("Failed to update status:", err);
                        }
                    }}
                    className={`btn-table-action ${row.status === "Active" ? "btn-red-gradient" : "btn-green-gradient"}`}
                >
                    {row.status === "Active" ? "Deactivate" : "Activate"}
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
                            <button
                                onClick={() => navigate('/guards/add', { state: { supervisorId: id } })}
                                className="btn-add-supervisor"
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                            >
                                <UserPlus size={18} />
                                Add Guard
                            </button>
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

