import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, AlertCircle, Shield, User, Clock, Briefcase, FileText, Download, UserCheck, FileSpreadsheet } from 'lucide-react';
import api from "../api/api";
import { getImageUrl } from "../utils/imageUtils";
import { API_BASE_URL } from "../config/config";
import "../styles/global/layout.css";
import "../styles/shared/Details.css";

const downloadFile = async (url, filename) => {
    const token = localStorage.getItem("token");
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

function GuardDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state } = useLocation();
    const fromSupervisorId = state?.fromSupervisorId;
    const [guard, setGuard] = useState(null);
    const [supervisor, setSupervisor] = useState(null);
    const [photoModalOpen, setPhotoModalOpen] = useState(false);

    useEffect(() => {
        const fetchGuard = async () => {
            try {
                const res = await api.get(`/api/guards/${id}`);
                const g = res.data.data;

                setGuard(g);

                if (g.supervisorId) {
                    const supRes = await api.get(`/api/admin/supervisors/${g.supervisorId}`);
                    setSupervisor(supRes.data.data);
                }

            } catch (err) {
                console.error("Failed to load guard:", err);
                navigate('/guards');
            }
        };

        fetchGuard();
    }, [id, navigate]);

    if (!guard) {
        return (
            <div className="page-container">
                <Sidebar />
                <div className="page-main">
                    <Navbar />
                    <div className="page-content" style={{ textAlign: "center" }}>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

    const formatTime = (timeString) => {
        if (!timeString) return "—";
        // Convert 24h to 12h format
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    return (
        <div className="page-container">
            <Sidebar />

            <div className="page-main">
                <Navbar />

                <div className="page-content">
                    {/* Back Button */}
                    <button
                        onClick={() => fromSupervisorId
                            ? navigate(`/supervisors/${fromSupervisorId}/guards`)
                            : navigate('/guards')
                        }
                        className="btn-back"
                        style={{ marginBottom: "1.5rem" }}
                    >
                        <ArrowLeft size={16} />
                        {fromSupervisorId ? "Back to Supervisor's Guards" : "Back to All Guards"}
                    </button>

                    {/* Header with Profile Photo */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                        borderRadius: '16px',
                        padding: '2rem',
                        marginBottom: '2rem',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem'
                    }}>
                        {/* Profile Photo - clickable if photo exists */}
                        <div
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: getImageUrl(guard.profileImage)
                                    ? `url(${getImageUrl(guard.profileImage)}) center/cover`
                                    : 'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)',
                                border: '4px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                flexShrink: 0,
                                cursor: getImageUrl(guard.profileImage) ? 'pointer' : 'default',
                                position: 'relative',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                            title={getImageUrl(guard.profileImage) ? 'Click to view photo' : ''}
                            onClick={() => getImageUrl(guard.profileImage) && setPhotoModalOpen(true)}
                            onMouseEnter={e => { if (getImageUrl(guard.profileImage)) e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            {!getImageUrl(guard.profileImage) && (guard.fullName?.split(' ').map(n => n[0]).join('') || 'G')}
                        </div>

                        {/* Photo Modal/Card */}
                        {photoModalOpen && getImageUrl(guard.profileImage) && (
                            <div
                                onClick={() => setPhotoModalOpen(false)}
                                style={{
                                    position: 'fixed', inset: 0,
                                    background: 'rgba(0,0,0,0.75)',
                                    backdropFilter: 'blur(6px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    zIndex: 9999, padding: '1.5rem'
                                }}
                            >
                                <div
                                    onClick={e => e.stopPropagation()}
                                    style={{
                                        background: 'white', borderRadius: '20px',
                                        overflow: 'hidden', maxWidth: '420px', width: '100%',
                                        boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                                        animation: 'slideUp 0.25s ease-out'
                                    }}
                                >
                                    {/* Card header */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
                                        padding: '1rem 1.5rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <p style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: '1.125rem' }}>{guard.fullName}</p>
                                            <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' }}>Guard ID: {guard.guardID || '—'}</p>
                                        </div>
                                        <button
                                            onClick={() => setPhotoModalOpen(false)}
                                            style={{
                                                background: 'rgba(255,255,255,0.2)', border: 'none',
                                                borderRadius: '50%', width: 36, height: 36,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', color: 'white', fontSize: '1.25rem', fontWeight: 700
                                            }}
                                        >✕</button>
                                    </div>
                                    {/* Photo */}
                                    <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                                        <img
                                            src={getImageUrl(guard.profileImage)}
                                            alt={guard.fullName}
                                            style={{
                                                width: '100%', maxHeight: '340px',
                                                objectFit: 'contain', borderRadius: '12px',
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Header Info */}
                        <div style={{ flex: 1 }}>
                            <h1 style={{
                                fontSize: '2rem',
                                fontWeight: '700',
                                margin: 0,
                                marginBottom: '0.5rem'
                            }}>
                                {guard.fullName || "—"}
                            </h1>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', opacity: 0.95 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Shield size={18} />
                                    <span>Guard ID: {guard.guardID || "—"}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={18} />
                                    <span>Joined: {formatDate(guard.dateOfJoining)}</span>
                                </div>
                                <div>
                                    <span style={{
                                        background: guard.status === "Active"
                                            ? 'rgba(16, 185, 129, 0.2)'
                                            : 'rgba(239, 68, 68, 0.2)',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        border: `2px solid ${guard.status === "Active" ? '#10b981' : '#ef4444'}`
                                    }}>
                                        {guard.status || "—"}
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={async () => {
                                        try {
                                            const url = `${API_BASE_URL}/api/admin/guards/${guard.id}/export/pdf`;
                                            await downloadFile(url, `Guard_${guard.fullName?.replace(/\s+/g, "_")}.pdf`);
                                        } catch (e) {
                                            alert("PDF download failed. Please try again.");
                                        }
                                    }}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer'
                                    }}
                                >
                                    <FileText size={18} />
                                    PDF Download
                                </button>
                                <button
                                    onClick={async () => {
                                        try {
                                            const url = `${API_BASE_URL}/api/admin/guards/${guard.id}/export/excel`;
                                            await downloadFile(url, `Guard_${guard.fullName?.replace(/\s+/g, "_")}.xlsx`);
                                        } catch (e) {
                                            alert("Excel download failed. Please try again.");
                                        }
                                    }}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                        color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer'
                                    }}
                                >
                                    <FileSpreadsheet size={18} />
                                    Excel Download
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="info-grid">
                        {/* Contact Information */}
                        <div className="info-card">
                            <h2 className="info-card-title">
                                <Phone size={20} />
                                Contact Information
                            </h2>
                            <div className="info-items-container">
                                <div>
                                    <p className="info-item-label">Email Address</p>
                                    <div className="info-item-value-box">
                                        <Mail size={18} style={{ color: "#3b82f6", flexShrink: 0 }} />
                                        <p className="info-item-text">{guard.email || "—"}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="info-item-label">Phone Number</p>
                                    <div className="info-item-value-box">
                                        <Phone size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                                        <p className="info-item-text">{guard.phone || "—"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="info-card">
                            <h2 className="info-card-title">
                                <MapPin size={20} />
                                Address Information
                            </h2>
                            <div className="info-items-container">
                                <div>
                                    <p className="info-item-label">Current Address</p>
                                    <div className="info-item-value-box" style={{ alignItems: "flex-start" }}>
                                        <MapPin size={18} style={{ color: "#f59e0b", flexShrink: 0, marginTop: "0.125rem" }} />
                                        <p className="info-item-text" style={{ lineHeight: "1.6" }}>
                                            {guard.address || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="info-item-label">Permanent Address</p>
                                    <div className="info-item-value-box" style={{ alignItems: "flex-start" }}>
                                        <MapPin size={18} style={{ color: "#8b5cf6", flexShrink: 0, marginTop: "0.125rem" }} />
                                        <p className="info-item-text" style={{ lineHeight: "1.6" }}>
                                            {guard.permanentAddress || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="info-item-label">Emergency Address</p>
                                    <div className="info-item-value-box" style={{ alignItems: "flex-start" }}>
                                        <AlertCircle size={18} style={{ color: "#ef4444", flexShrink: 0, marginTop: "0.125rem" }} />
                                        <p className="info-item-text" style={{ lineHeight: "1.6" }}>
                                            {guard.emergencyAddress || "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Duty Information */}
                        <div className="info-card">
                            <h2 className="info-card-title">
                                <Clock size={20} />
                                Duty Information
                            </h2>
                            <div className="info-items-container">
                                <div>
                                    <p className="info-item-label">Duty Type</p>
                                    <div className="info-item-value-box">
                                        <Clock size={18} style={{ color: "#0d7377", flexShrink: 0 }} />
                                        <p className="info-item-text">{guard.dutyType || "—"}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="info-item-label">Duty Timing</p>
                                    <div className="info-item-value-box">
                                        <Clock size={18} style={{ color: "#3b82f6", flexShrink: 0 }} />
                                        <p className="info-item-text">
                                            {formatTime(guard.dutyStartTime)} - {formatTime(guard.dutyEndTime)}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="info-item-label">Assigned Area</p>
                                    <div className="info-item-value-box highlight">
                                        <Shield size={18} style={{ color: "#0d7377", flexShrink: 0 }} />
                                        <p className="info-item-text" style={{ color: "#0d7377", fontWeight: "600" }}>
                                            {guard.assignedArea || "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Experience & Reference */}
                        <div className="info-card">
                            <h2 className="info-card-title">
                                <Briefcase size={20} />
                                Experience & Reference
                            </h2>
                            <div className="info-items-container">
                                <div>
                                    <p className="info-item-label">Work Experience</p>
                                    <div className="info-item-value-box">
                                        <Briefcase size={18} style={{ color: "#8b5cf6", flexShrink: 0 }} />
                                        <p className="info-item-text">{guard.workExperience || "—"}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="info-item-label">Reference By</p>
                                    <div className="info-item-value-box">
                                        <UserCheck size={18} style={{ color: "#3b82f6", flexShrink: 0 }} />
                                        <p className="info-item-text">{guard.referenceBy || "—"}</p>
                                    </div>
                                </div>


                                <div>
                                    <p className="info-item-label">Supervisor</p>
                                    {supervisor ? (
                                        <div
                                            onClick={() => navigate(`/supervisors/${guard.supervisorId}`)}
                                            className="info-item-value-box clickable"
                                            style={{
                                                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.08) 100%)",
                                                borderColor: "rgba(59, 130, 246, 0.2)"
                                            }}
                                        >
                                            <User size={18} style={{ color: "#2563eb", flexShrink: 0 }} />
                                            <p className="info-item-text" style={{ color: "#2563eb", fontWeight: "600" }}>
                                                {supervisor.fullName || "—"}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="info-item-value-box">
                                            <User size={18} style={{ color: "#9ca3af", flexShrink: 0 }} />
                                            <p className="info-item-text" style={{ color: "#6b7280" }}>
                                                Unassigned
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contacts */}
                        <div className="info-card">
                            <h2 className="info-card-title">
                                <AlertCircle size={20} />
                                Emergency Contacts
                            </h2>
                            <div className="info-items-container">
                                <div>
                                    <p className="info-item-label">Primary Emergency Contact</p>
                                    <div className="info-item-value-box">
                                        <Phone size={18} style={{ color: "#ef4444", flexShrink: 0 }} />
                                        <p className="info-item-text">{guard.emergencyContact || "—"}</p>
                                    </div>
                                </div>

                                {guard.emergencyContactName1 && (
                                    <div>
                                        <p className="info-item-label">Emergency Contact 1</p>
                                        <div className="info-item-value-box">
                                            <User size={18} style={{ color: "#f59e0b", flexShrink: 0 }} />
                                            <div>
                                                <p className="info-item-text" style={{ fontWeight: "600" }}>
                                                    {guard.emergencyContactName1}
                                                </p>
                                                <p className="info-item-text" style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
                                                    {guard.emergencyContactPhone1 || "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {guard.emergencyContactName2 && (
                                    <div>
                                        <p className="info-item-label">Emergency Contact 2</p>
                                        <div className="info-item-value-box">
                                            <User size={18} style={{ color: "#f59e0b", flexShrink: 0 }} />
                                            <div>
                                                <p className="info-item-text" style={{ fontWeight: "600" }}>
                                                    {guard.emergencyContactName2}
                                                </p>
                                                <p className="info-item-text" style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
                                                    {guard.emergencyContactPhone2 || "—"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="info-card" style={{ gridColumn: '1 / -1' }}>
                            <h2 className="info-card-title">
                                <FileText size={20} />
                                Uploaded Documents
                            </h2>
                            {guard.documents && guard.documents.length > 0 ? (
                                <div style={{ display: 'grid', gap: '0.75rem' }}>
                                    {guard.documents.map((doc, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '1rem',
                                                background: '#f9fafb',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '8px',
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white'
                                                }}>
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: '600', color: '#111827' }}>
                                                        {doc.original_name}
                                                    </p>
                                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', marginTop: '0.125rem' }}>
                                                        Document {index + 1}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={doc.file_path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.5rem 1rem',
                                                    background: 'linear-gradient(135deg, #0d7377 0%, #14a0a5 100%)',
                                                    color: 'white',
                                                    borderRadius: '6px',
                                                    textDecoration: 'none',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    transition: 'transform 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                <Download size={16} />
                                                Download
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem',
                                    color: '#6b7280',
                                    background: '#f9fafb',
                                    borderRadius: '8px',
                                    border: '2px dashed #e5e7eb'
                                }}>
                                    <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                    <p style={{ margin: 0, fontWeight: '500' }}>No documents uploaded</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GuardDetails;
