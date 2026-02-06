import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, User, Mail, Shield, Calendar, Lock, ArrowLeft, Save, AlertCircle, CheckCircle, Edit3 } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

function ProfileModal({ isOpen, onClose }) {
    const { user, setUser } = useAuth();
    const [view, setView] = useState('info'); // 'info', 'password', or 'edit'
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

                    // The response structure is: res.data.data.userData
                    if (res.data?.data?.userData) {
                        setUser(res.data.data.userData);
                        console.log('User set to:', res.data.data.userData);
                    } else {
                        console.log('userData not found in expected path');
                    }
                } catch (err) {
                    console.error('Failed to fetch profile:', err);
                }
            }
        };

        if (isOpen) {
            fetchProfile();
            setView('info');
            setError('');
            setSuccess('');
        }
    }, [isOpen, setUser]);

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) {
            return setError('New passwords do not match');
        }

        if (formData.newPassword.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        const payload = {
            old_password: formData.currentPassword,
            new_password: formData.newPassword
        };

        console.log('Password change payload:', payload);
        console.log('Form data:', formData);

        setLoading(true);
        try {
            const response = await api.put('/api/admin/change-password', payload);
            console.log('Password change response:', response);
            setSuccess('Password updated successfully!');
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            setTimeout(() => setView('info'), 2000);
        } catch (err) {
            console.error('Password change error:', err);
            console.error('Error response:', err.response);
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        setLoading(true);
        try {
            const res = await api.put('/api/admin/profile', {
                name: formData.name,
                email: formData.email
            });
            setUser(res.data);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setView('info'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

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
                    {view === 'info' ? (
                        <>
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

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button
                                    onClick={() => setView('edit')}
                                    style={{
                                        flex: 1,
                                        padding: '0.875rem',
                                        background: 'white',
                                        color: '#0d7377',
                                        border: '1px solid #0d7377',
                                        borderRadius: '12px',
                                        fontSize: '0.9375rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Edit3 size={18} />
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => setView('password')}
                                    style={{
                                        flex: 1,
                                        padding: '0.875rem',
                                        background: 'white',
                                        color: '#0d7377',
                                        border: '1px solid #0d7377',
                                        borderRadius: '12px',
                                        fontSize: '0.9375rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Lock size={18} />
                                    Password
                                </button>
                            </div>
                        </>
                    ) : view === 'password' ? (
                        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setView('info')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Change Password</h3>
                            </div>

                            {error && (
                                <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div style={{ padding: '0.75rem', background: '#ecfdf5', color: '#059669', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={16} />
                                    {success}
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.375rem', textTransform: 'uppercase' }}>Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.375rem', textTransform: 'uppercase' }}>New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.375rem', textTransform: 'uppercase' }}>Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    marginTop: '0.5rem',
                                    padding: '0.875rem',
                                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #0d7377 0%, #14a0a5 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.9375rem',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 12px rgba(13, 115, 119, 0.25)'
                                }}
                            >
                                <Save size={18} />
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setView('info')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
                                >
                                    <ArrowLeft size={18} />
                                </button>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#111827' }}>Edit Profile</h3>
                            </div>

                            {error && (
                                <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div style={{ padding: '0.75rem', background: '#ecfdf5', color: '#059669', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={16} />
                                    {success}
                                </div>
                            )}

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.375rem', textTransform: 'uppercase' }}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.375rem', textTransform: 'uppercase' }}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    marginTop: '0.5rem',
                                    padding: '0.875rem',
                                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #0d7377 0%, #14a0a5 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '0.9375rem',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 12px rgba(13, 115, 119, 0.25)'
                                }}
                            >
                                <Save size={18} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    )}
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

