import React, { useState } from 'react';
import { useIncidents } from '../context/IncidentContext';

export default function IncidentModal({ isOpen, onClose }) {
    const { createIncident } = useIncidents();
    const [formData, setFormData] = useState({
        title: '',
        type: 'incident',
        severity: 'medium',
        location: '',
        officer: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.location || !formData.officer || !formData.description) {
            alert('Please fill in all required fields');
            return;
        }

        createIncident(formData);

        // Reset form
        setFormData({
            title: '',
            type: 'incident',
            severity: 'medium',
            location: '',
            officer: '',
            description: ''
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="flex justify-between items-center mb-6">
                    <h2 style={{ margin: 0 }}>Log New Incident</h2>
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
                        {/* Title */}
                        <div>
                            <label className="form-label">Incident Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="input"
                                placeholder="Brief description of the incident"
                                required
                            />
                        </div>

                        {/* Type and Severity */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label className="form-label">Type *</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                >
                                    <option value="incident">Incident</option>
                                    <option value="report">Report</option>
                                    <option value="alert">Alert</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Severity *</label>
                                <select
                                    name="severity"
                                    value={formData.severity}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        {/* Location and Officer */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                            <div>
                                <label className="form-label">Reporting Officer *</label>
                                <input
                                    type="text"
                                    name="officer"
                                    value={formData.officer}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Officer name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="form-label">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="input"
                                rows="4"
                                placeholder="Detailed description of the incident..."
                                required
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
                                Log Incident
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
