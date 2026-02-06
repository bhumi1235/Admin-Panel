import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import { Plus, Edit3, Trash2 } from "lucide-react";
import api from "../api/api";
import "../styles/global/layout.css";
import "../styles/shared/GuardTable.css";

function DutyTypes() {
    const navigate = useNavigate();
    const [dutyTypes, setDutyTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDutyTypes = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/duty-types`);
                console.log('Duty types response:', res.data);
                // Handle different response structures (backend sends duty_types)
                const data = res.data.duty_types || res.data.dutyTypes || res.data.data || res.data || [];
                setDutyTypes(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load duty types:", err);
                setDutyTypes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDutyTypes();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await api.delete(`/api/duty-types/${id}`);
                // Refresh logic - need to re-fetch. Since fetchDutyTypes is now inside useEffect, 
                // we can either move it out (with useCallback) or just reload window, 
                // OR better: trigger a state change to re-run effect.
                // Let's use a simpler approach: remove from state.
                setDutyTypes(prev => prev.filter(dt => dt.id !== id));
            } catch (err) {
                console.error("Failed to delete duty type:", err);
                alert("Failed to delete duty type. Please try again.");
            }
        }
    };

    const columns = [
        {
            header: "Name",
            accessor: "name",
            render: (row) => (
                <div className="guard-name-cell">
                    <span className="guard-name-text">
                        {row.name || row.duty_type_name || "N/A"}
                    </span>
                </div>
            )
        },
        {
            header: "Description",
            accessor: "description",
            render: (row) => (
                <div className="guard-phone-cell">
                    {row.description || "No description"}
                </div>
            )
        },
        {
            header: "Actions",
            render: (row) => (
                <div className="actions-cell">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/duty-types/edit/${row.id}`);
                        }}
                        className="btn-view"
                    >
                        <Edit3 size={14} />
                        Edit
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row.id, row.name || row.duty_type_name);
                        }}
                        className="btn-terminate"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            )
        }
    ];

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
                                Duty Types
                            </h1>
                            <p className="page-subtitle">
                                Manage duty types for guard assignments
                            </p>
                        </div>

                        <div className="header-actions">
                            <button
                                onClick={() => navigate('/duty-types/add')}
                                className="btn-add"
                            >
                                <Plus size={18} />
                                Add Duty Type
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            Loading...
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={dutyTypes}
                            emptyMessage="No duty types found. Add your first duty type to get started."
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default DutyTypes;
