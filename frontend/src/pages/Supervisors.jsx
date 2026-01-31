import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { Plus, Eye, Trash2, Ban, Download, ChevronDown } from "lucide-react";
import api from "../api/api";
import { exportToPDF, exportToExcel } from "../utils/exportUtils";
import "../styles/global/layout.css";
import "../styles/shared/GuardTable.css";
import "../styles/pages/Supervisors.css";

function Supervisors() {
    const navigate = useNavigate();
    const location = useLocation();
    const [supervisors, setSupervisors] = useState([]);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);

    // Get status from query param: ?status=Active
    const queryParams = new URLSearchParams(location.search);
    const statusFilter = queryParams.get('status') || 'Active';

    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                const res = await api.get(`/api/supervisors`);
                // Filter by status
                const filtered = res.data.filter(s => s.status === statusFilter);
                setSupervisors(filtered);
            } catch (err) {
                console.error("Failed to load supervisors:", err);
            }
        };

        fetchSupervisors();
    }, [statusFilter]);


    const columns = [
        {
            header: "Name",
            accessor: "fullName",
            render: (row) => (
                <div className="guard-name-cell">
                    <div className="guard-avatar">
                        {row.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="guard-name-text">
                        {row.fullName}
                    </span>
                </div>
            )
        },
        {
            header: "Email",
            accessor: "email",
            render: (row) => (
                <div className="guard-phone-cell">
                    {row.email}
                </div>
            )
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
                <div className="actions-cell">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/supervisors/${row.id}`);
                        }}
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
                                    await api.put(`/api/supervisors/${row.id}/status`, {
                                        status: "Active"
                                    });
                                    // Refresh the list
                                    const res = await api.get(`/api/supervisors`);
                                    setSupervisors(res.data.filter(s => s.status === statusFilter));
                                } catch (err) {
                                    console.error("Failed to activate supervisor:", err);
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
                                if (window.confirm(`Are you sure you want to suspend ${row.fullName}?`)) {
                                    try {
                                        await api.put(`/api/supervisors/${row.id}/status`, {
                                            status: "Suspended"
                                        });
                                        alert(`${row.fullName} cant log in on the app`);
                                        // Refresh the list
                                        const res = await api.get(`/api/supervisors`);
                                        setSupervisors(res.data.filter(s => s.status === statusFilter));
                                    } catch (err) {
                                        console.error("Failed to suspend supervisor:", err);
                                        alert("Failed to suspend supervisor. Please try again.");
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
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to terminate ${row.fullName}?`)) {
                                    try {
                                        await api.delete(`/api/supervisors/${row.id}`);
                                        // Refresh the list
                                        const res = await api.get(`/api/supervisors`);
                                        setSupervisors(res.data.filter(s => s.status === statusFilter));
                                    } catch (err) {
                                        console.error("Failed to terminate supervisor:", err);
                                        alert("Failed to terminate supervisor. Please try again.");
                                    }
                                }
                            }}
                            className="btn-terminate"
                        >
                            <Trash2 size={14} />
                            Terminate
                        </button>
                    )}
                </div>
            )
        }
    ];

    const handleDownload = async (format) => {
        setIsDownloadOpen(false);
        const fileName = `${statusFilter}_Supervisors_${new Date().toISOString().split('T')[0]}`;
        const title = `${statusFilter} Supervisors List`;

        if (format === 'pdf') {
            exportToPDF(title, columns, supervisors, fileName);
        } else {
            await exportToExcel(supervisors, fileName, columns);
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
                                {statusFilter} Supervisors
                            </h1>
                            <p className="page-subtitle">
                                {statusFilter === 'Active' ? 'Manage current active supervisors' :
                                    statusFilter === 'Suspended' ? 'View supervisors who are suspended' :
                                        'View supervisors who have been terminated'}
                            </p>
                        </div>

                        <div className="header-actions">
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

                            <button
                                onClick={() => navigate('/supervisors/add')}
                                className="btn-add"
                            >
                                <Plus size={18} />
                                Add Supervisor
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <Table
                        columns={columns}
                        data={supervisors}
                        emptyMessage="No supervisors found. Add your first supervisor to get started."
                    />
                </div>
            </div>
        </div>
    );
}

export default Supervisors;

