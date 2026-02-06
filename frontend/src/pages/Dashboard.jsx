import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { Users, Shield, UserCheck, ShieldCheck } from "lucide-react";
import api from "../api/api";
import "../styles/pages/Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalSupervisors: 0,
        activeSupervisors: 0,
        totalGuards: 0,
    });

    const fetchDashboard = async () => {
        try {
            const res = await api.get(`/api/admin/dashboard`);

            setStats({
                totalSupervisors: res.data.totalSupervisors,
                activeSupervisors: res.data.activeSupervisors,
                totalGuards: res.data.totalGuards,
            });

        } catch (err) {
            console.error("Failed to load dashboard:", err);
        }
    };


    useEffect(() => {
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
                            icon={UserCheck}
                            title="Active Supervisors"
                            value={stats.activeSupervisors}
                            color="success"
                            onClick={() => navigate('/supervisors?status=Active')}
                        />
                        <StatCard
                            icon={Shield}
                            title="Total Guards"
                            value={stats.totalGuards}
                            color="secondary"
                            onClick={() => navigate('/all-guards')}
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

