import React, { useState, useEffect } from 'react';

export default function ShiftModal({ isOpen, onClose, onSave, editingShift = null }) {
    const [formData, setFormData] = useState({
        guard: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        status: 'Scheduled',
        notes: ''
    });

    useEffect(() => {
        if (editingShift) {
            setFormData(editingShift);
        } else {
            // Reset form when opening for new shift
            setFormData({
                guard: '',
                date: new Date().toISOString().split('T')[0],
                startTime: '',
                endTime: '',
                location: '',
                status: 'Scheduled',
                notes: ''
            });
        }
    }, [editingShift, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.guard || !formData.date || !formData.startTime || !formData.endTime || !formData.location) {
            alert('Please fill in all required fields');
            return;
        }

        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="flex justify-between items-center mb-6">
                    <h2 style={{ margin: 0 }}>
                        {editingShift ? 'Edit Shift' : 'Assign New Shift'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#64748b',
                            padding: '0.25rem'
                        }}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Guard Name */}
                        <div>
                            <label className="form-label">Guard Name *</label>
                            <input
                                type="text"
                                name="guard"
                                value={formData.guard}
                                onChange={handleChange}
                                className="input"
                                placeholder="Enter guard name"
                                required
                            />
                        </div>

                        {/* Date and Location */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="e.g., Main Gate"
                                    required
                                />
                            </div>
                        </div>

                        {/* Start and End Time */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Start Time *</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">End Time *</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="form-label">Status *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="input"
                                required
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="form-label">Notes (Optional)</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="input"
                                rows="3"
                                placeholder="Additional notes about this shift..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {editingShift ? 'Update Shift' : 'Assign Shift'}
                            </button>
                        </div>
                    </div>
                </form>
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

                .form-label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #334155;
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </div>
    );
}
