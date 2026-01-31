import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import { ArrowLeft, Save } from "lucide-react";
import api from "../api/api";
import "../styles/global/layout.css";
import "../styles/shared/Form.css";

function AddGuard() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const preSelectedSupervisorId = state?.supervisorId;

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        emergencyContact: "",
        assignedArea: "",
        password: "",
        status: "Active",
        supervisorId: preSelectedSupervisorId || ""
    });

    const [supervisors, setSupervisors] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                const res = await api.get("/api/supervisors");
                setSupervisors(res.data.map(s => ({
                    value: s.id,
                    label: s.fullName
                })));
            } catch (err) {
                console.error("Failed to fetch supervisors:", err);
            }
        };
        fetchSupervisors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required";
        if (!formData.assignedArea.trim()) newErrors.assignedArea = "Assigned area is required";
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            await api.post("/api/guards", {
                ...formData,
                supervisorId: formData.supervisorId ? parseInt(formData.supervisorId, 10) : null
            });

            if (preSelectedSupervisorId) {
                navigate(`/supervisors/${preSelectedSupervisorId}/guards`);
            } else {
                navigate("/guards");
            }
        } catch (err) {
            console.error("Failed to add guard:", err);
            alert(err.response?.data?.error || "Failed to add guard");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Sidebar />

            <div className="page-main">
                <Navbar />

                <div className="page-content">
                    {/* Header */}
                    <div className="header-wrapper" style={{ marginBottom: "2rem" }}>
                        <button
                            onClick={() => window.history.back()}
                            className="btn-back"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>

                        <h1 className="page-title">
                            Add New Security Guard
                        </h1>
                        <p className="page-subtitle">
                            Fill in the details to register a new security guard
                        </p>
                    </div>

                    {/* Form */}
                    <div className="form-card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                <FormInput
                                    label="Full Name"
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    error={errors.fullName}
                                    required
                                />

                                <FormInput
                                    label="Email Address"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="guard@example.com"
                                    error={errors.email}
                                    required
                                />

                                <FormInput
                                    label="Phone Number"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    error={errors.phone}
                                    required
                                />

                                <FormInput
                                    label="Date of Birth"
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    error={errors.dateOfBirth}
                                    required
                                />

                                <FormInput
                                    label="Emergency Contact"
                                    type="text"
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                    placeholder="Name and Phone"
                                    error={errors.emergencyContact}
                                    required
                                />

                                <FormInput
                                    label="Assigned Area"
                                    type="text"
                                    name="assignedArea"
                                    value={formData.assignedArea}
                                    onChange={handleChange}
                                    placeholder="e.g. Main Gate, Sector A"
                                    error={errors.assignedArea}
                                    required
                                />

                                <FormInput
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                    error={errors.password}
                                    required
                                />

                                <FormInput
                                    label="Supervisor"
                                    type="select"
                                    name="supervisorId"
                                    value={formData.supervisorId}
                                    onChange={handleChange}
                                    options={[
                                        { value: "", label: "Select Supervisor (Optional)" },
                                        ...supervisors
                                    ]}
                                />

                                <FormInput
                                    label="Status"
                                    type="select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    options={[
                                        { value: "Active", label: "Active" },
                                        { value: "Inactive", label: "Inactive" }
                                    ]}
                                    required
                                />
                            </div>

                            <div style={{ marginTop: "1.5rem" }}>
                                <FormInput
                                    label="Full Address"
                                    type="textarea"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter complete residential address"
                                    error={errors.address}
                                    required
                                />
                            </div>

                            <div className="form-actions" style={{ marginTop: "2rem" }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-submit"
                                >
                                    <Save size={18} />
                                    {loading ? "Registering..." : "Register Guard"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddGuard;
