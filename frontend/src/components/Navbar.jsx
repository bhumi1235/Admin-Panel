import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import ProfileModal from "./ProfileModal";
import { useAuth } from "../context/AuthContext";
import "../styles/components/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const adminName = user?.name || 'Admin';
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleProfileClick = () => {
        navigate("/profile");
        setIsProfileOpen(false);
    };

    return (
        <div className="navbar-container">
            {/* Left side - Welcome message */}
            <div className="welcome-section">
                <h3>Welcome back, {adminName}!</h3>
                <p>Manage your security team</p>
            </div>

            {/* Right side - User profile & actions */}
            <div className="user-actions">
                {/* User Profile - navigates to profile page */}
                <div
                    onClick={handleProfileClick}
                    className="profile-trigger"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleProfileClick()}
                >
                    {/* Avatar with gradient ring */}
                    <div className="avatar-container">
                        {/* Gradient ring */}
                        <div className="gradient-ring"></div>

                        {/* Avatar circle */}
                        <div className="avatar-circle">
                            <User size={18} strokeWidth={2.5} color="#ffffff" />
                        </div>

                        {/* Status indicator */}
                        <div className="status-indicator"></div>
                    </div>

                    {/* Text content */}
                    <div className="text-content">
                        <p className="user-name">{user?.name || 'Admin'}</p>
                        <p className="user-role">{user?.role || 'Administrator'}</p>
                    </div>
                </div>
            </div>

            {/* Profile Modal (optional; profile page is primary) */}
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </div>
    );
}

export default Navbar;

