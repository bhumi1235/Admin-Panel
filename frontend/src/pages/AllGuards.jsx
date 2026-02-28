import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import TerminationReasonModal from "../components/TerminationReasonModal";
import { Plus, Eye, Trash2, Ban, Download, ChevronDown, Shield, UserCheck } from "lucide-react";
import api from "../api/api";
import { exportToPDF, exportToExcel } from "../utils/exportUtils";
import { getImageUrl } from "../utils/imageUtils";
import "../styles/global/layout.css";
import "../styles/shared/GuardTable.css";
import "../styles/pages/Supervisors.css"; // Reuse supervisor styles for buttons

function AllGuards() {
    const navigate = useNavigate();
    const location = useLocation();
    const [guards, setGuards] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [terminationModal, setTerminationModal] = useState({ isOpen: false, guard: null, isEdit: false });

    // Get status from query param: ?status=Active
    const queryParams = new URLSearchParams(location.search);
    const statusFilter = queryParams.get('status') || 'Active';

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all guards
                const guardsRes = await api.get(`/api/guards`);
                const g = guardsRes.data.data;

                const formattedGuards = g.map(guard => ({
                    id: guard.id,
                    name: guard.fullName || guard.name,
                    phone: guard.phone,
                    assignedArea: guard.assignedArea,
                    status: guard.status,
                    supervisorId: guard.supervisorId || guard.supervisor_id,
                    profileImage: guard.profileImage || null,
                    terminationReason: guard.terminationReason || guard.termination_reason
                }));

                setGuards(formattedGuards);

                // Fetch ALL supervisors for displaying supervisor name
                const [activeRes, suspendedRes, terminatedRes, adminRes] = await Promise.all([
                    api.get(`/api/admin/supervisors?status=Active`),
                    api.get(`/api/admin/supervisors?status=Suspended`),
                    api.get(`/api/admin/supervisors?status=Terminated`),
                    api.get(`/api/admin/profile`).catch(() => ({ data: null }))
                ]);

                let allSupervisors = [
                    ...activeRes.data.data,
                    ...suspendedRes.data.data,
                    ...terminatedRes.data.data
                ];

                if (adminRes.data) {
                    const adminData = adminRes.data.userData || adminRes.data.data || adminRes.data;
                    if (adminData && adminData.id) {
                        if (!allSupervisors.find(s => s.id === adminData.id)) {
                            allSupervisors.push({
                                id: adminData.id,
                                fullName: adminData.name || adminData.fullName || 'Admin',
                                role: 'admin'
                            });
                        }
                    }
                }

                setSupervisors(allSupervisors.map(sp => ({
                    id: sp.id,
                    fullName: sp.fullName || sp.name
                })));

            } catch (err) {
                console.error("Failed to load data:", err);
            }
        };

        fetchData();
    }, [statusFilter]);

    const getSupervisorName = (supervisorId) => {
        if (!supervisorId) return 'Unassigned';
        const supervisor = supervisors.find(s => s.id == supervisorId);
        return supervisor ? supervisor.fullName : `Unknown (ID: ${supervisorId})`;
    };

    const refreshGuards = async () => {
        try {
            const guardsRes = await api.get(`/api/guards`);
            const g = guardsRes.data.data;
            const formattedGuards = g.map(guard => ({
                id: guard.id,
                name: guard.fullName || guard.name,
                phone: guard.phone,
                assignedArea: guard.assignedArea,
                status: guard.status,
                supervisorId: guard.supervisorId || guard.supervisor_id,
                profileImage: guard.profileImage || null,
                terminationReason: guard.terminationReason || guard.termination_reason
            }));
            setGuards(formattedGuards);
        } catch (err) {
            console.error("Failed to refresh guards:", err);
        }
    };

    const filteredGuards = guards.filter(g => g.status === statusFilter).sort((a, b) => a.id - b.id);

    const columns = [
        {
            header: "Guard Name",
            accessor: "name",
            render: (row) => {
                const photoUrl = getImageUrl(row.profileImage);
                return (
                    <div className="guard-name-cell">
                        <div
                            className="guard-avatar"
                            style={photoUrl ? {
                                background: `url(${photoUrl}) center/cover no-repeat`,
                                fontSize: 0
                            } : undefined}
                        >
                            {!photoUrl && (row.name?.split(' ').map(n => n[0]).join('') || 'G')}
                        </div>
                        <span className="guard-name-text">{row.name}</span>
                    </div>
                );
            }
        },
        {
            header: "Phone",
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
            header: "Supervisor",
            accessor: "supervisorId",
            render: (row) => {
                const supervisorName = getSupervisorName(row.supervisorId);
                return (
                    <div className="supervisor-badge">
                        <UserCheck size={15} strokeWidth={2.5} />
                        {supervisorName}
                    </div>
                );
            }
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
        ...(statusFilter === 'Terminated' ? [{
            header: "Termination Reason",
            accessor: "terminationReason",
            render: (row) => (
                <div style={{
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: '#6b7280',
                    fontSize: '0.875rem'
                }}>
                    {row.terminationReason || '—'}
                </div>
            )
        }] : []),
        {
            header: "Actions",
            render: (row) => (
                <div className="actions-cell">
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/guards/${row.id}`); }}
                        className="btn-view"
                    >
                        <Eye size={14} />
                        View
                    </button>

                    {row.status === "Suspended" && (
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    await api.put(`/api/admin/guards/${row.id}/status`, { status: "Active" });
                                    refreshGuards();
                                } catch (err) {
                                    console.error("Failed to activate guard:", err);
                                }
                            }}
                            className="btn-activate"
                        >
                            Activate
                        </button>
                    )}

                    {row.status === "Active" && (
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to suspend ${row.name}?`)) {
                                    try {
                                        await api.put(`/api/admin/guards/${row.id}/status`, { status: "Suspended" });
                                        alert(`${row.name} can't log in on the app`);
                                        refreshGuards();
                                    } catch (err) {
                                        console.error("Failed to suspend guard:", err);
                                        alert("Failed to suspend guard. Please try again.");
                                    }
                                }
                            }}
                            className="btn-suspend"
                        >
                            <Ban size={14} />
                            Suspend
                        </button>
                    )}

                    {row.status !== "Terminated" && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTerminationModal({ isOpen: true, guard: row, isEdit: false });
                                }}
                                className="btn-terminate"
                            >
                                <Trash2 size={14} />
                                Terminate
                            </button>
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Permanently delete ${row.name}? This cannot be undone.`)) {
                                        try {
                                            await api.delete(`/api/admin/guards/${row.id}/permanent`);
                                            refreshGuards();
                                        } catch (err) {
                                            console.error("Failed to delete guard:", err);
                                            alert("Failed to permanently delete guard.");
                                        }
                                    }
                                }}
                                className="btn-icon-delete"
                                title="Permanently delete"
                                style={{ padding: '0.5rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </>
                    )}

                    {row.status === "Terminated" && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTerminationModal({ isOpen: true, guard: row, isEdit: true });
                                }}
                                className="btn-edit-reason"
                                style={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem'
                                }}
                            >
                                Edit Reason
                            </button>
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Permanently delete ${row.name}? This cannot be undone.`)) {
                                        try {
                                            await api.delete(`/api/admin/guards/${row.id}/permanent`);
                                            refreshGuards();
                                        } catch (err) {
                                            console.error("Failed to delete guard:", err);
                                            alert("Failed to permanently delete guard. Please try again.");
                                        }
                                    }
                                }}
                                className="btn-icon-delete"
                                title="Permanently delete"
                                style={{ padding: '0.5rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    const handleDownload = async (format) => {
        setIsDownloadOpen(false);
        const fileName = `${statusFilter}_Guards_${new Date().toISOString().split('T')[0]}`;
        const title = `${statusFilter} Security Guards List`;

        if (format === 'pdf') {
            exportToPDF(title, columns, filteredGuards, fileName);
        } else {
            await exportToExcel(filteredGuards, fileName, columns);
        }
    };

    const handleTerminate = async (reason) => {
        try {
            if (terminationModal.isEdit) {
                // Update termination reason
                await api.put(`/api/admin/guards/${terminationModal.guard.id}/termination-reason`, {
                    reason
                });
            } else {
                // Terminate guard
                await api.delete(`/api/admin/guards/${terminationModal.guard.id}`, {
                    data: { reason }
                });
            }
            refreshGuards();
            setTerminationModal({ isOpen: false, guard: null, isEdit: false });
        } catch (err) {
            console.error("Failed to process request:", err);
            alert(`Failed to ${terminationModal.isEdit ? 'update reason' : 'terminate guard'}. Please try again.`);
        }
    };

    return (
        <div className="page-container">
            <Sidebar />

            <div className="page-main">
                <Navbar />

                <div className="page-content">
                    {/* Header */}
                    <div className="page-header">
                        <div>
                            <h1 className="page-title">
                                {statusFilter} Security Guards
                            </h1>
                            <p className="page-subtitle">
                                {statusFilter === 'Active' ? 'View active guards and their assignments' :
                                    statusFilter === 'Suspended' ? 'View guards who are suspended' :
                                        'View guards who have been terminated'}
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: "1rem" }}>

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

                    {/* Guards Table */}
                    <Table
                        columns={columns}
                        data={filteredGuards}
                        emptyMessage={`No ${statusFilter.toLowerCase()} guards found.`}
                    />
                </div>
            </div>

            {/* Termination Reason Modal */}
            <TerminationReasonModal
                isOpen={terminationModal.isOpen}
                onClose={() => setTerminationModal({ isOpen: false, guard: null, isEdit: false })}
                onSubmit={handleTerminate}
                supervisorName={terminationModal.guard?.name || ''}
                initialReason={terminationModal.guard?.terminationReason || ''}
                titleLabel="Guard"
            />
        </div>
    );
}

export default AllGuards;
