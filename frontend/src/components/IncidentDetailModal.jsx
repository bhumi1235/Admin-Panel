import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import { formatTimeAgo } from '../services/incidentService';

export default function IncidentDetailModal({ isOpen, onClose, incident }) {
    const { resolveIncident } = useIncidents();
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [isResolving, setIsResolving] = useState(false);

    if (!isOpen || !incident) return null;

    const getSeverityColor = (severity) => {
        const colors = {
            low: '#22c55e',
            medium: '#f59e0b',
            high: '#ef4444',
            critical: '#ec4899'
        };
        return colors[severity] || '#f59e0b';
    };

    const handleResolve = () => {
        if (!resolutionNotes.trim()) {
            alert('Please provide resolution notes');
            return;
        }

        resolveIncident(incident.id, 'Current User', resolutionNotes);
        setResolutionNotes('');
        setIsResolving(false);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                <div className="flex justify-between items-start mb-6">
                    <div style={{ flex: 1 }}>
                        <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>{incident.title}</h2>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    backgroundColor: getSeverityColor(incident.severity) + '20',
                                    color: getSeverityColor(incident.severity),
                                    textTransform: 'uppercase'
                                }}
                            >
                                {incident.severity}
                            </span>
                            <span
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    backgroundColor: incident.status === 'active' ? '#fef3c7' : '#f0fdf4',
                                    color: incident.status === 'active' ? '#b45309' : '#15803d',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {incident.status}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#64748b',
                            padding: '0.25rem',
                            marginLeft: '1rem'
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                Type
                            </div>
                            <div style={{ fontSize: '0.9375rem', color: '#1e293b', textTransform: 'capitalize' }}>
                                {incident.type}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                Location
                            </div>
                            <div style={{ fontSize: '0.9375rem', color: '#1e293b' }}>
                                📍 {incident.location}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                Reporting Officer
                            </div>
                            <div style={{ fontSize: '0.9375rem', color: '#1e293b' }}>
                                👮 {incident.officer}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                Reported
                            </div>
                            <div style={{ fontSize: '0.9375rem', color: '#1e293b' }}>
                                {formatTimeAgo(incident.createdAt)}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>
                            Description
                        </div>
                        <div style={{
                            fontSize: '0.9375rem',
                            color: '#475569',
                            lineHeight: 1.6,
                            padding: '1rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }}>
                            {incident.description}
                        </div>
                    </div>

                    {/* Resolution Section */}
                    {incident.status === 'resolved' ? (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: '#f0fdf4',
                            borderRadius: '8px',
                            border: '1px solid #bbf7d0'
                        }}>
                            <div style={{ fontSize: '0.75rem', color: '#15803d', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase' }}>
                                ✓ Resolution
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '0.5rem' }}>
                                <strong>Resolved by:</strong> {incident.resolvedBy}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '0.5rem' }}>
                                <strong>Resolved at:</strong> {formatTimeAgo(incident.resolvedAt)}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#166534' }}>
                                <strong>Notes:</strong> {incident.resolutionNotes}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {!isResolving ? (
                                <button
                                    onClick={() => setIsResolving(true)}
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    Resolve Incident
                                </button>
                            ) : (
                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: '#fef3c7',
                                    borderRadius: '8px',
                                    border: '1px solid #fde68a'
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '0.75rem', fontWeight: 600 }}>
                                        Resolution Notes *
                                    </div>
                                    <textarea
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                        className="input"
                                        rows="3"
                                        placeholder="Describe how this incident was resolved..."
                                        style={{ marginBottom: '0.75rem' }}
                                    />
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button
                                            onClick={() => {
                                                setIsResolving(false);
                                                setResolutionNotes('');
                                            }}
                                            className="btn btn-secondary"
                                            style={{ flex: 1 }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleResolve}
                                            className="btn btn-primary"
                                            style={{ flex: 1 }}
                                        >
                                            Confirm Resolution
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.2s ease;
                }

                .modal-content {
                    background: white;
                    border-radius: 12px;
                    padding: 2rem;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    animation: slideUp 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
