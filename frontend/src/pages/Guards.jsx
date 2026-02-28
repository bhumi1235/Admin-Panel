import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { ArrowLeft, Shield, Download, ChevronDown, Ban, UserX, UserCheck } from "lucide-react";
import api from "../api/api";
import TerminationReasonModal from "../components/TerminationReasonModal";
import { exportToPDF, exportToExcel } from "../utils/exportUtils";
import "../styles/global/layout.css";
import "../styles/shared/GuardTable.css";
import "../styles/pages/Guards.css";


function Guards() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [supervisor, setSupervisor] = useState(null);
    const [guards, setGuards] = useState([]);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [terminationModal, setTerminationModal] = useState({ isOpen: false, guard: null, isEdit: false });

    const fetchSupervisorAndGuards = async () => {
        try {
            // supervisor details
            const supRes = await api.get(`/api/admin/supervisors/${id}`);

            const sup = supRes.data.data;
            setSupervisor({
                id: sup.id,
                fullName: sup.full_name,
                email: sup.email,
                phone: sup.phone,
                status: sup.status
            });

            // guards under this supervisor
            const guardRes = await api.get(`/api/admin/supervisors/${id}/guards`);

            const formattedGuards = guardRes.data.data.map(g => ({
                id: g.id,
                name: g.fullName,
                phone: g.phone,
                assignedArea: g.assignedArea,
                status: g.status
            }));

            setGuards(formattedGuards);

        } catch (err) {
            console.error("Failed to load supervisor/guards:", err);
            setSupervisor({ fullName: "Error loading data" }); // Fallback
        }
    };

    useEffect(() => {
        fetchSupervisorAndGuards();
    }, [id, navigate]);


    const columns = [
        {
            header: "Guard Name",
            accessor: "name",
            render: (row) => (
                <div className="guard-name-cell">
                    <div className="guard-avatar">
                        {row.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="guard-name-text">
                        {row.name}
                    </span>
                </div>
            )
        },
        {
            header: "Phone Number",
            accessor: "phone",
            render: (row) => (
                <div className="guard-phone-cell">
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
                <span className={`status-label ${row.status === "Active" ? "status-active" : "status-inactive"}`}>
                    <div className="status-dot"></div>
                    {row.status}
                </span>
            )
        },
        {
            header: "Actions",
            render: (row) => (
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/guards/${row.id}`, { state: { fromSupervisorId: id } });
                        }}
                        className="btn-view"
                        title="View Details"
                    >
                        View Details
                    </button>

                    {row.status === "Active" && (
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to suspend ${row.name}?`)) {
                                    try {
                                        await api.put(`/api/admin/guards/${row.id}/status`, { status: "Suspended" });
                                        alert(`${row.name} is now suspended`);
                                        fetchSupervisorAndGuards();
                                    } catch (err) {
                                        console.error("Failed to suspend guard:", err);
                                        alert("Failed to suspend guard.");
                                    }
                                }
                            }}
                            className="btn-suspend"
                            title="Suspend Guard"
                        >
                            <Ban size={14} />
                        </button>
                    )}

                    {row.status === "Suspended" && (
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    await api.put(`/api/admin/guards/${row.id}/status`, { status: "Active" });
                                    alert(`${row.name} is now active`);
                                    fetchSupervisorAndGuards();
                                } catch (err) {
                                    console.error("Failed to activate guard:", err);
                                    alert("Failed to activate guard.");
                                }
                            }}
                            className="btn-activate"
                            title="Activate Guard"
                            style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                color: 'white', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer'
                            }}
                        >
                            <UserCheck size={14} />
                        </button>
                    )}

                    {row.status !== "Terminated" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setTerminationModal({ isOpen: true, guard: row });
                            }}
                            className="btn-terminate"
                            title="Terminate Guard"
                        >
                            <UserX size={14} />
                        </button>
                    )}
                </div>
            )
        }
    ];

    const handleDownload = async (format) => {
        setIsDownloadOpen(false);
        const fileName = `${supervisor.fullName}_Guards_${new Date().toISOString().split('T')[0]}`;
        const title = `Security Guards assigned to ${supervisor.fullName}`;

        if (format === 'pdf') {
            exportToPDF(title, columns, guards, fileName);
        } else {
            await exportToExcel(guards, fileName, columns);
        }
    };

    if (!supervisor) {
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
                    {/* Header */}
                    <div className="header-wrapper">
                        <button
                            onClick={() => navigate(`/supervisors/${id}`)}
                            className="btn-back"
                        >
                            <ArrowLeft size={16} />
                            Back to Supervisor Details
                        </button>

                        <div className="page-header">
                            <div>
                                <h1 className="page-title">
                                    Security Guards
                                </h1>
                                <p className="page-subtitle">
                                    Guards assigned to <strong>{supervisor.fullName}</strong>
                                </p>
                            </div>

                            {/* Download Dropdown */}
                            <div className="download-dropdown-container">
                                <button
                                    onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                                    className="btn-download"
                                >
                                    <Download size={18} />
                                    Download as
                                    <ChevronDown
                                        size={14}
                                        style={{ transform: isDownloadOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}
                                    />
                                </button>

                                {isDownloadOpen && (
                                    <div className="dropdown-menu">
                                        <button
                                            onClick={() => handleDownload('pdf')}
                                            className="dropdown-item"
                                        >
                                            PDF Document
                                        </button>
                                        <button
                                            onClick={() => handleDownload('excel')}
                                            className="dropdown-item"
                                        >
                                            Excel Spreadsheet
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Banner */}
                    <div className="stats-banner">
                        <div className="stats-banner-text">
                            <p>Total Guards Assigned</p>
                            <p>{guards.length}</p>
                        </div>
                        <div className="stats-banner-icon">
                            <Shield size={32} />
                        </div>
                    </div>

                    {/* Guards Table */}
                    <Table
                        columns={columns}
                        data={guards}
                        onRowClick={(row) => navigate(`/guards/${row.id}`, { state: { fromSupervisorId: id } })}
                        emptyMessage={`No guards assigned to ${supervisor.fullName} yet.`}
                    />

                    <TerminationReasonModal
                        isOpen={terminationModal.isOpen}
                        onClose={() => setTerminationModal({ isOpen: false, guard: null, isEdit: false })}
                        onSubmit={async (reason) => {
                            try {
                                await api.delete(`/api/admin/guards/${terminationModal.guard.id}`, {
                                    data: { reason }
                                });
                                fetchSupervisorAndGuards();
                                setTerminationModal({ isOpen: false, guard: null, isEdit: false });
                            } catch (err) {
                                console.error("Failed to terminate guard:", err);
                                alert("Failed to terminate guard.");
                            }
                        }}
                        name={terminationModal.guard?.name}
                    />
                </div>
            </div>
        </div>
    );
}

export default Guards;

