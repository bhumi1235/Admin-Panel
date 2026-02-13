import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import { ArrowLeft, Save } from "lucide-react";
import api from "../api/api";
import "../styles/global/layout.css";
import "../styles/shared/Form.css";

function AddSupervisor() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        status: "Active"
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ""
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }


        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\+?[\d\s()-]+$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

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

            const response = await api.post(
                `/api/admin/supervisors`,
                {
                    name: formData.fullName,  // Backend expects 'name', not 'fullName'
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                    // Note: status is set to 'Active' by default in backend
                }
            );

            console.log('Supervisor created:', response.data);

            // Show success message if available
            if (response.data?.message) {
                alert(response.data.message);
            }

            navigate("/supervisors");
        } catch (err) {
            console.error("Failed to add supervisor:", err);
            console.error("Error response:", err.response);

            // Show specific error message from backend
            const errorMessage = err.response?.data?.message || "Failed to add supervisor";
            alert(errorMessage);
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
                            onClick={() => navigate('/supervisors')}
                            className="btn-back"
                        >
                            <ArrowLeft size={16} />
                            Back to Supervisors
                        </button>

                        <h1 className="page-title">
                            Add New Supervisor
                        </h1>
                        <p className="page-subtitle">
                            Fill in the details to create a new supervisor account
                        </p>
                    </div>

                    {/* Form */}
                    <div className="form-card">
                        <form onSubmit={handleSubmit}>
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
                                placeholder="supervisor@example.com"
                                error={errors.email}
                                required
                            />

                            <FormInput
                                label="Phone Number"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 123-4567"
                                error={errors.phone}
                                required
                            />

                            <FormInput
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 6 characters"
                                error={errors.password}
                                required
                            />

                            <FormInput
                                label="Status"
                                type="select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={[
                                    { value: "Active", label: "Active" },
                                    { value: "Suspended", label: "Suspended" }
                                ]}
                                required
                            />

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-submit"
                                >
                                    <Save size={18} />
                                    {loading ? "Creating..." : "Create Supervisor"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/supervisors')}
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

export default AddSupervisor;

