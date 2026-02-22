import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, User, Mail, Shield, Calendar } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

function ProfileModal({ isOpen, onClose }) {
    const { user, setUser } = useAuth();

    // Fetch fresh profile data when modal opens
    useEffect(() => {
        const fetchProfile = async () => {
            if (isOpen) {
                try {
                    const res = await api.get('/api/admin/profile');
                    console.log('Full API Response:', res);
                    console.log('res.data:', res.data);
                    console.log('res.data.data:', res.data?.data);
                    console.log('res.data.data.userData:', res.data?.data?.userData);

                    // Handle various response structures
                    const userData = res.data.userData || res.data.data || res.data;

                    if (userData) {
                        setUser(userData);
                        console.log('User set to:', userData);
                    } else {
                        console.log('User data not found in response');
                    }
                } catch (err) {
                    console.error('Failed to fetch profile:', err);
                }
            }
        };

        if (isOpen) {
            fetchProfile();
        }
    }, [isOpen, setUser]);



    if (!isOpen) return null;

    const adminName = user?.name || "User";
    const adminEmail = user?.email || "";
    const userRole = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : "User";

    // Format join date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };
    const joinDate = formatDate(user?.createdAt || user?.created_at);



    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 999,
                    animation: 'fadeIn 0.2s ease'
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    zIndex: 1000,
                    width: '90%',
                    maxWidth: '420px',
                    overflow: 'hidden',
                    animation: 'slideIn 0.3s ease'
                }}
            >
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #0d7377 0%, #14a0a5 100%)',
                    padding: '1.5rem',
                    position: 'relative',
                    color: 'white'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            borderRadius: '8px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <X size={18} />
                    </button>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        {/* Avatar */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #32e0c4 0%, #14a0a5 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                            border: '4px solid rgba(255, 255, 255, 0.3)'
                        }}>
                            <User size={40} color="#0d7377" strokeWidth={2.5} />
                        </div>

                        <h2 style={{
                            margin: 0,
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '0.25rem'
                        }}>
                            {adminName}
                        </h2>
                        <p style={{
                            margin: 0,
                            fontSize: '0.875rem',
                            opacity: 0.9,
                            fontWeight: '500'
                        }}>
                            {userRole}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Info Items */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                            <Mail size={20} color="#0d7377" />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Email Address</p>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#111827', fontWeight: '600' }}>{adminEmail}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                            <Shield size={20} color="#0d7377" />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Role</p>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#111827', fontWeight: '600' }}>{userRole}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                            <Calendar size={20} color="#0d7377" />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>Member Since</p>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#111827', fontWeight: '600' }}>{joinDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes slideIn { from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
                `}
            </style>
        </>
    );
}

ProfileModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ProfileModal;

