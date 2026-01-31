import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Shield, LogOut, ChevronDown, ChevronRight, UserPlus, ShieldCheck } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "../styles/components/Sidebar.css";

function Sidebar() {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [supervisorsOpen, setSupervisorsOpen] = useState(false);

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const isSubActive = (path, status) => {
        const queryParams = new URLSearchParams(location.search);
        return location.pathname === path && queryParams.get('status') === status;
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/');
        }
    };

    const supervisorSubItems = [
        { label: "Active Supervisors", status: "Active" },
        { label: "Suspended Supervisors", status: "Suspended" },
        { label: "Terminated Supervisors", status: "Terminated" }
    ];

    return (
        <aside className="sidebar">
            {/* Logo/Brand */}
            <Link to="/dashboard" className="sidebar-header-link" style={{ textDecoration: "none" }}>
                <div className="sidebar-header">
                    <div className="flex items-center gap-md">
                        <div className="sidebar-brand-img">
                            <img
                                src="/logo.png"
                                alt="SecureGuard Logo"
                                className="brand-logo"
                            />
                        </div>
                        <div className="sidebar-logo-text">
                            <h2>SecureGuard</h2>
                            <p>Admin Panel</p>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {/* Dashboard */}
                <Link
                    to="/dashboard"
                    className={`sidebar-item ${isActive("/dashboard") ? "active" : ""}`}
                >
                    <LayoutDashboard size={22} strokeWidth={isActive("/dashboard") ? 2.5 : 2} />
                    <span>Dashboard</span>
                </Link>

                {/* Supervisors Dropdown */}
                <div>
                    <div
                        onClick={() => setSupervisorsOpen(!supervisorsOpen)}
                        className={`sidebar-item ${(isActive("/supervisors") || supervisorsOpen) ? "group-active" : ""}`}
                    >
                        <Users size={22} strokeWidth={(isActive("/supervisors") || supervisorsOpen) ? 2.5 : 2} />
                        <span style={{ flex: 1 }}>Supervisors</span>
                        {supervisorsOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </div>

                    {supervisorsOpen && (
                        <div className="sidebar-sub-list">
                            {supervisorSubItems.map((subItem) => (
                                <Link
                                    key={subItem.status}
                                    to={`/supervisors?status=${subItem.status}`}
                                    className={`sidebar-sub-item ${isSubActive("/supervisors", subItem.status) ? "active" : ""}`}
                                >
                                    {subItem.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* All Guards */}
                <Link
                    to="/all-guards"
                    className={`sidebar-item ${isActive("/all-guards") ? "active" : ""}`}
                >
                    <Shield size={22} strokeWidth={isActive("/all-guards") ? 2.5 : 2} />
                    <span>All Guards</span>
                </Link>

                {/* Quick Actions */}
                <div className="sidebar-group-label" style={{ padding: '1rem 1.25rem 0.5rem', fontSize: '0.75rem', opacity: 0.6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Quick Actions
                </div>

                <Link
                    to="/supervisors/add"
                    className={`sidebar-item ${isActive("/supervisors/add") ? "active" : ""}`}
                >
                    <UserPlus size={22} strokeWidth={isActive("/supervisors/add") ? 2.5 : 2} />
                    <span>Add Supervisor</span>
                </Link>

                <Link
                    to="/guards/add"
                    className={`sidebar-item ${isActive("/guards/add") ? "active" : ""}`}
                >
                    <ShieldCheck size={22} strokeWidth={isActive("/guards/add") ? 2.5 : 2} />
                    <span>Add Guard</span>
                </Link>
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="btn-logout">
                    <LogOut size={18} />
                    Logout
                </button>
                <p className="sidebar-footer-text">
                    © 2024 SecureGuard
                </p>
            </div>
        </aside>
    );
}

export default Sidebar;

