import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';
import IncidentModal from '../components/IncidentModal';
import IncidentDetailModal from '../components/IncidentDetailModal';

export default function Incidents() {
    const { incidents, loading } = useIncidents();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [filter, setFilter] = useState('all');

    const filteredIncidents = filter === 'all'
        ? incidents
        : incidents.filter(inc => inc.status === filter);

    const getSeverityColor = (severity) => {
        const colors = {
            low: { bg: '#f0fdf4', text: '#15803d', border: '#22c55e' },
            medium: { bg: '#fef3c7', text: '#b45309', border: '#f59e0b' },
            high: { bg: '#fee2e2', text: '#b91c1c', border: '#ef4444' },
            critical: { bg: '#fce7f3', text: '#be185d', border: '#ec4899' }
        };
        return colors[severity] || colors.medium;
    };

    const getTypeIcon = (type) => {
        const icons = { incident: '⚠️', report: '📝', alert: '🔔' };
        return icons[type] || '📋';
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return past.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="grid-3 animate-pulse">
                <div className="skeleton" style={{ height: '200px' }}></div>
                <div className="skeleton" style={{ height: '200px' }}></div>
                <div className="skeleton" style={{ height: '200px' }}></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                        Incident Management
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                        Log and track security incidents and reports
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        border: '1px solid transparent',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
                        width: 'fit-content',
                        maxWidth: 'none',
                        flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 12px rgba(37, 99, 235, 0.3)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <span>+</span>
                    <span>Log Incident</span>
                </button>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginBottom: '2rem',
                flexWrap: 'wrap'
            }}>
                {[
                    { key: 'all', label: 'All', count: incidents.length },
                    { key: 'active', label: 'Active', count: incidents.filter(i => i.status === 'active').length },
                    { key: 'resolved', label: 'Resolved', count: incidents.filter(i => i.status === 'resolved').length }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        style={{
                            padding: '0.625rem 1.25rem',
                            borderRadius: '8px',
                            border: filter === tab.key ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                            backgroundColor: filter === tab.key ? '#eff6ff' : '#ffffff',
                            color: filter === tab.key ? '#3b82f6' : '#64748b',
                            fontWeight: filter === tab.key ? 600 : 500,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <span>{tab.label}</span>
                        <span style={{
                            padding: '0.125rem 0.5rem',
                            borderRadius: '12px',
                            backgroundColor: filter === tab.key ? '#3b82f6' : '#e2e8f0',
                            color: filter === tab.key ? '#ffffff' : '#64748b',
                            fontSize: '0.75rem',
                            fontWeight: 700
                        }}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Incidents Grid */}
            {filteredIncidents.length === 0 ? (
                <div className="card" style={{
                    textAlign: 'center',
                    padding: '3rem',
                    backgroundColor: '#f8fafc'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                    <h3 style={{ color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>
                        No incidents found
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                        {filter === 'all' ? 'Get started by logging your first incident' : `No ${filter} incidents`}
                    </p>
                </div>
            ) : (
                <div className="grid-3">
                    {filteredIncidents.map((incident) => {
                        const severityColors = getSeverityColor(incident.severity);

                        return (
                            <div
                                key={incident.id}
                                className="card incident-card"
                                onClick={() => setSelectedIncident(incident)}
                                style={{
                                    cursor: 'pointer',
                                    borderLeft: `4px solid ${severityColors.border}`,
                                    transition: 'all 0.2s',
                                    padding: '1.5rem'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                                }}
                            >
                                {/* Header */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            backgroundColor: severityColors.bg,
                                            color: severityColors.text
                                        }}>
                                            {incident.severity}
                                        </span>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                            backgroundColor: '#f1f5f9',
                                            color: '#64748b'
                                        }}>
                                            {incident.type}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '1.25rem' }}>
                                        {getTypeIcon(incident.type)}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    marginBottom: '0.75rem',
                                    lineHeight: 1.4
                                }}>
                                    {incident.title}
                                </h3>

                                {/* Description */}
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#64748b',
                                    lineHeight: 1.6,
                                    marginBottom: '1rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {incident.description}
                                </p>

                                {/* Footer */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #e2e8f0'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                                            📍 {incident.location}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                                            👮 {incident.officer}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: '#64748b',
                                        fontWeight: 500
                                    }}>
                                        {formatTimeAgo(incident.createdAt)}
                                    </div>
                                </div>

                                {/* Status Indicator */}
                                {incident.status === 'active' && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: '#f59e0b',
                                        boxShadow: '0 0 0 3px #fef3c7'
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            <IncidentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <IncidentDetailModal
                isOpen={!!selectedIncident}
                onClose={() => setSelectedIncident(null)}
                incident={selectedIncident}
            />
        </div>
    );
}
