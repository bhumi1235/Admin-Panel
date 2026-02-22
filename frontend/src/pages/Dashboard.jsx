import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { Users, Shield, UserCheck, UserX, UserMinus } from "lucide-react";
import api from "../api/api";
import "../styles/pages/Dashboard.css";

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
                        <h1>
                            Welcome back, {localStorage.getItem('adminName') || 'Admin'}!
                        </h1>
                        <p>
                            Here's what's happening with your security team today.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <StatCard
                            icon={Users}
                            title="Total Supervisors"
                            value={stats.totalSupervisors}
                            color="primary"
                            onClick={() => navigate('/supervisors?status=Active')}
                        />

                        <StatCard
                            icon={Shield}
                            title="Total Guards"
                            value={stats.totalGuards}
                            color="secondary"
                            onClick={() => navigate('/all-guards')}
                        />

                        <StatCard
                            icon={UserCheck}
                            title="Total Active Supervisor/Guard"
                            value={stats.activeSupervisorsCount + stats.activeGuardsCount}
                            color="success"
                            onClick={() => navigate('/supervisors?status=Active')}
                        />

                        <StatCard
                            icon={UserMinus}
                            title="Total Suspended Supervisor/Guard"
                            value={stats.suspendedSupervisorsCount + stats.suspendedGuardsCount}
                            color="warning"
                            onClick={() => navigate('/supervisors?status=Suspended')}
                        />

                        <StatCard
                            icon={UserX}
                            title="Total Terminated Supervisor/Guard"
                            value={stats.terminatedSupervisorsCount + stats.terminatedGuardsCount}
                            color="danger"
                            onClick={() => navigate('/supervisors?status=Terminated')}
                        />
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

