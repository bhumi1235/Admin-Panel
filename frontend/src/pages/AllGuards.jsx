import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { Shield, UserCheck, Trash2, Download, ChevronDown, UserPlus } from "lucide-react";
import api from "../api/api";
import { exportToPDF, exportToExcel } from "../utils/exportUtils";
import "../styles/global/layout.css";
import "../styles/shared/GuardTable.css";

function AllGuards() {
    const navigate = useNavigate();
    const [guards, setGuards] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);

    useEffect(() => {
        const fetchAllGuards = async () => {
            try {
                // guards
                const guardsRes = await api.get(`/api/guards`);
                const g = guardsRes.data.data;

                const formattedGuards = g.map(guard => ({
                    id: guard.id,
                    name: guard.fullName,
                    phone: guard.phone,
                    assignedArea: guard.assignedArea,
                    status: guard.status,
                    supervisorId: guard.supervisorId
                }));

                setGuards(formattedGuards);


                // Fetch ALL supervisors (Active, Suspended, Terminated) for proper name lookup
                // Guards may reference supervisors of any status
                const [activeRes, suspendedRes, terminatedRes] = await Promise.all([
                    api.get(`/api/admin/supervisors?status=Active`),
                    api.get(`/api/admin/supervisors?status=Suspended`),
                    api.get(`/api/admin/supervisors?status=Terminated`)
                ]);

                const allSupervisors = [
                    ...activeRes.data.data,
                    ...suspendedRes.data.data,
                    ...terminatedRes.data.data
                ];

                const formattedSup = allSupervisors.map(sp => ({
                    id: sp.id,
                    fullName: sp.fullName
                }));

                setSupervisors(formattedSup);

            } catch (err) {
                console.error("Failed to load guards:", err);
            }
        };

        fetchAllGuards();
    }, [navigate]);




    const getSupervisorName = (supervisorId) => {
        if (!supervisorId) {
            return 'Unassigned';
        }
        // Handle both string and number IDs
        const supervisor = supervisors.find(s => s.id == supervisorId); // Use == for type coercion
        const result = supervisor ? supervisor.fullName : 'Unassigned';

        return result;
    };

    const handleGuardClick = (guard) => {
        navigate(`/guards/${guard.id}`);
    };

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
        {
            header: "Actions",
            render: (row) => (
                <button
                    onClick={async (e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
                            try {
                                await api.delete(`/api/guards/${row.id}`);
                                // Refresh the list
                                const guardsRes = await api.get(`/api/guards`);
                                const updatedGuards = guardsRes.data.data.map(guard => ({
                                    id: guard.id,
                                    name: guard.fullName,
                                    phone: guard.phone,
                                    assignedArea: guard.assignedArea,
                                    status: guard.status,
                                    supervisorId: guard.supervisorId
                                }));
                                setGuards(updatedGuards);
                            } catch (err) {
                                console.error("Failed to delete guard:", err);
                                alert("Failed to delete guard. Please try again.");
                            }
                        }
                    }}
                    className="btn-delete"
                >
                    <Trash2 size={14} />
                    Delete
                </button>
            )
        }
    ];

    const handleDownload = async (format) => {
        setIsDownloadOpen(false);
        const fileName = `All_Guards_${new Date().toISOString().split('T')[0]}`;
        const title = "All Security Guards List";

        if (format === 'pdf') {
            exportToPDF(title, columns, guards, fileName);
        } else {
            await exportToExcel(guards, fileName, columns);
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
                                All Security Guards
                            </h1>
                            <p className="page-subtitle">
                                View all guards with their assignment status
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
                        data={guards}
                        onRowClick={handleGuardClick}
                        emptyMessage="No guards found in the system."
                    />
                </div>
            </div>
        </div>
    );
}

export default AllGuards;

