import React, { useState, useEffect } from 'react';
import { scheduleService } from '../services/scheduleService';
import ShiftModal from '../components/ShiftModal';

export default function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingShift, setEditingShift] = useState(null);

    useEffect(() => {
        loadSchedules();
    }, []);

    const loadSchedules = () => {
        setLoading(true);
        scheduleService.initializeSampleData();
        const data = scheduleService.getSchedules();
        setSchedules(data);
        setLoading(false);
    };

    const handleAddShift = () => {
        setEditingShift(null);
        setIsModalOpen(true);
    };

    const handleEditShift = (shift) => {
        setEditingShift(shift);
        setIsModalOpen(true);
    };

    const handleSaveShift = (shiftData) => {
        if (editingShift) {
            scheduleService.updateSchedule(editingShift.id, shiftData);
        } else {
            scheduleService.createSchedule(shiftData);
        }
        loadSchedules();
        setIsModalOpen(false);
        setEditingShift(null);
    };

    const handleDeleteShift = (id) => {
        if (window.confirm('Are you sure you want to delete this shift?')) {
            scheduleService.deleteSchedule(id);
            loadSchedules();
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Scheduled': { bg: '#eff6ff', text: '#3b82f6' },
            'Upcoming': { bg: '#fef3c7', text: '#f59e0b' },
            'In Progress': { bg: '#f0fdf4', text: '#22c55e' },
            'Completed': { bg: '#f1f5f9', text: '#64748b' },
            'Cancelled': { bg: '#fee2e2', text: '#ef4444' }
        };
        return colors[status] || colors['Scheduled'];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    if (loading) {
        return (
            <div className="animate-pulse">
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
                marginBottom: '2rem'
            }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                        Shift Schedule
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                        Manage and view upcoming guard shifts
                    </p>
                </div>
                <button
                    onClick={handleAddShift}
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
                    <span>Assign Shift</span>
                </button>
            </div>

            {/* Schedule Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {schedules.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                        <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>No shifts scheduled</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            Get started by assigning your first shift
                        </p>
                        <button
                            onClick={handleAddShift}
                            className="btn btn-primary"
                        >
                            + Assign Shift
                        </button>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{
                                    borderBottom: '2px solid #e2e8f0',
                                    backgroundColor: '#f8fafc'
                                }}>
                                    <th style={{ padding: '1rem', color: '#64748b', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', textAlign: 'left' }}>Guard Name</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', textAlign: 'left' }}>Date</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', textAlign: 'left' }}>Time</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', textAlign: 'left' }}>Location</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', textAlign: 'left' }}>Status</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontWeight: 700, fontSize: '0.8125rem', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((shift, index) => {
                                    const statusColors = getStatusColor(shift.status);

                                    return (
                                        <tr
                                            key={shift.id}
                                            style={{
                                                borderBottom: index < schedules.length - 1 ? '1px solid #f1f5f9' : 'none',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>
                                                👮 {shift.guard}
                                            </td>
                                            <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                                                {formatDate(shift.date)}
                                            </td>
                                            <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                                                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                                            </td>
                                            <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                                                📍 {shift.location}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.375rem 0.75rem',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    backgroundColor: statusColors.bg,
                                                    color: statusColors.text,
                                                    textTransform: 'uppercase',
                                                }}>
                                                    {shift.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                    <button
                                                        onClick={() => handleEditShift(shift)}
                                                        style={{
                                                            padding: '0.5rem',
                                                            borderRadius: '6px',
                                                            border: '1px solid #e2e8f0',
                                                            backgroundColor: '#ffffff',
                                                            color: '#3b82f6',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteShift(shift.id)}
                                                        style={{
                                                            padding: '0.5rem',
                                                            borderRadius: '6px',
                                                            border: '1px solid #e2e8f0',
                                                            backgroundColor: '#ffffff',
                                                            color: '#ef4444',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Shift Modal */}
            <ShiftModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingShift(null);
                }}
                onSave={handleSaveShift}
                editingShift={editingShift}
            />
        </div>
    );
}
