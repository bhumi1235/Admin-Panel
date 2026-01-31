import PropTypes from 'prop-types';
import { X, Phone, MapPin, User, Activity } from 'lucide-react';
import "../styles/shared/Details.css";

function GuardDetailsModal({ isOpen, onClose, guard, supervisorName }) {
    if (!isOpen || !guard) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>

                    <div className="modal-header-content">
                        <div className="modal-avatar-lg">
                            {guard.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.25rem" }}>
                                {guard.name}
                            </h2>
                            <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.9 }}>
                                Security Guard • ID: {guard.id}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="modal-body">
                    <div className="modal-info-list">
                        {/* Phone */}
                        <div className="modal-info-item">
                            <div className="modal-icon-box modal-icon-blue">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="info-item-label" style={{ marginBottom: "0.25rem" }}>Phone Number</p>
                                <p className="info-item-text" style={{ fontWeight: "600" }}>{guard.phone}</p>
                            </div>
                        </div>

                        {/* Assigned Area */}
                        <div className="modal-info-item">
                            <div className="modal-icon-box modal-icon-teal">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="info-item-label" style={{ marginBottom: "0.25rem" }}>Assigned Area</p>
                                <p className="info-item-text" style={{ fontWeight: "600" }}>{guard.assignedArea}</p>
                            </div>
                        </div>

                        {/* Supervisor */}
                        <div className="modal-info-item">
                            <div className="modal-icon-box modal-icon-purple">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="info-item-label" style={{ marginBottom: "0.25rem" }}>Supervisor</p>
                                <p className="info-item-text" style={{ fontWeight: "600" }}>{supervisorName}</p>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="modal-info-item">
                            <div className={`modal-icon-box ${guard.status === "Active" ? "btn-green-gradient" : "btn-red-gradient"}`} style={{ borderRadius: "10px" }}>
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="info-item-label" style={{ marginBottom: "0.25rem" }}>Status</p>
                                <div className={`status-badge-sm ${guard.status.toLowerCase()}`}>
                                    <div className={`status-dot-sm ${guard.status.toLowerCase()}`}></div>
                                    {guard.status}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

GuardDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    guard: PropTypes.object,
    supervisorName: PropTypes.string
};

export default GuardDetailsModal;

