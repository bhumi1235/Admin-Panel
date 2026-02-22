import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
    Users, Shield, UserCheck, UserX, UserMinus,
    TrendingUp, ChevronRight
} from "lucide-react";
import api from "../api/api";
import "../styles/pages/Dashboard.css";

const MiniStatCard = ({ label, value, color, onClick }) => (
    <div className={`mini-stat-card mini-stat-${color}`} onClick={onClick}>
        <p className="mini-stat-label">{label}</p>
        <h3 className="mini-stat-value">{value}</h3>
        {onClick && <ChevronRight size={14} className="mini-stat-arrow" />}
    </div>
);

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalSupervisors: 0,
        totalGuards: 0,
        activeSupervisorsCount: 0,
        suspendedSupervisorsCount: 0,
        terminatedSupervisorsCount: 0,
        activeGuardsCount: 0,
        suspendedGuardsCount: 0,
        terminatedGuardsCount: 0,
    });

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const dashboardRes = await api.get(`/api/admin/dashboard`);
                const res = dashboardRes.data;

                setStats({
                    totalSupervisors: res.totalSupervisors ?? 0,
                    totalGuards: res.totalGuards ?? 0,
                    activeSupervisorsCount: res.totalActiveSupervisors ?? 0,
                    suspendedSupervisorsCount: res.totalSuspendedSupervisors ?? 0,
                    terminatedSupervisorsCount: res.totalTerminatedSupervisors ?? 0,
                    activeGuardsCount: res.totalActiveGuards ?? 0,
                    suspendedGuardsCount: res.totalSuspendedGuards ?? 0,
                    terminatedGuardsCount: res.totalTerminatedGuards ?? 0,
                });
            } catch (err) {
                console.error("Failed to load dashboard:", err);
            }
        };

        fetchDashboard();
    }, []);

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="dashboard-main">
                <Navbar />

                <div className="dashboard-content">
                    {/* Welcome Section */}
                    <div className="welcome-header">
                        <div className="welcome-text">
                            <h1>Welcome back, {localStorage.getItem('adminName') || 'Admin'}!</h1>
                            <p>Here's what's happening with your security team today.</p>
                        </div>
                        <div className="welcome-badge">
                            <TrendingUp size={18} />
                            Live Overview
                        </div>
                    </div>

                    {/* Summary Row */}
                    <div className="summary-row">
                        <div
                            className="summary-card summary-supervisors"
                            onClick={() => navigate('/supervisors?status=Active')}
                        >
                            <div className="summary-icon">
                                <Users size={28} />
                            </div>
                            <div className="summary-info">
                                <p className="summary-label">Total Supervisors</p>
                                <h2 className="summary-value">{stats.totalSupervisors}</h2>
                            </div>
                        </div>

                        <div
                            className="summary-card summary-guards"
                            onClick={() => navigate('/all-guards')}
                        >
                            <div className="summary-icon">
                                <Shield size={28} />
                            </div>
                            <div className="summary-info">
                                <p className="summary-label">Total Guards</p>
                                <h2 className="summary-value">{stats.totalGuards}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="breakdown-grid">

                        {/* Supervisors Section */}
                        <div className="breakdown-section">
                            <div className="breakdown-header">
                                <div className="breakdown-header-icon breakdown-header-supervisor">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h3 className="breakdown-title">Supervisors</h3>
                                    <p className="breakdown-subtitle">Status breakdown</p>
                                </div>
                            </div>
                            <div className="mini-stats-grid">
                                <MiniStatCard
                                    label="Active"
                                    value={stats.activeSupervisorsCount}
                                    color="success"
                                    onClick={() => navigate('/supervisors?status=Active')}
                                />
                                <MiniStatCard
                                    label="Suspended"
                                    value={stats.suspendedSupervisorsCount}
                                    color="warning"
                                    onClick={() => navigate('/supervisors?status=Suspended')}
                                />
                                <MiniStatCard
                                    label="Terminated"
                                    value={stats.terminatedSupervisorsCount}
                                    color="danger"
                                    onClick={() => navigate('/supervisors?status=Terminated')}
                                />
                            </div>
                        </div>

                        {/* Guards Section */}
                        <div className="breakdown-section">
                            <div className="breakdown-header">
                                <div className="breakdown-header-icon breakdown-header-guard">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="breakdown-title">Guards</h3>
                                    <p className="breakdown-subtitle">Status breakdown</p>
                                </div>
                            </div>
                            <div className="mini-stats-grid">
                                <MiniStatCard
                                    label="Active"
                                    value={stats.activeGuardsCount}
                                    color="success"
                                    onClick={() => navigate('/all-guards?status=Active')}
                                />
                                <MiniStatCard
                                    label="Suspended"
                                    value={stats.suspendedGuardsCount}
                                    color="warning"
                                    onClick={() => navigate('/all-guards?status=Suspended')}
                                />
                                <MiniStatCard
                                    label="Terminated"
                                    value={stats.terminatedGuardsCount}
                                    color="danger"
                                    onClick={() => navigate('/all-guards?status=Terminated')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions-card">
                        <h3>Quick Actions</h3>
                        <div className="actions-group">
                            <button
                                onClick={() => navigate('/supervisors/add')}
                                className="btn-add-supervisor"
                            >
                                Add New Supervisor
                            </button>
                            <button
                                onClick={() => navigate('/supervisors')}
                                className="btn-view-all"
                            >
                                View All Supervisors
                            </button>
                            <button
                                onClick={() => navigate('/all-guards')}
                                className="btn-view-all"
                            >
                                View All Guards
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
