import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FormInput from "../components/FormInput";
import { ArrowLeft, Save } from "lucide-react";
import api from "../api/api";
import "../styles/global/layout.css";
import "../styles/shared/Form.css";

function EditDutyType() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchDutyType = async () => {
            try {
                const res = await api.get(`/api/duty-types/${id}`);
                const data = res.data.duty_type || res.data.dutyType || res.data.data || res.data;

                setFormData({
                    name: data.name || data.duty_type_name || "",
                    description: data.description || ""
                });
            } catch (err) {
                console.error("Failed to fetch duty type:", err);
                alert("Failed to load duty type details");
                navigate("/duty-types");
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchDutyType();
        }
    }, [id, navigate]);

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

        if (!formData.name.trim()) {
            newErrors.name = "Duty type name is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);

            const response = await api.put(`/api/duty-types/${id}`, {
                name: formData.name,
                description: formData.description
            });

            console.log('Duty type updated:', response.data);

            if (response.data?.message) {
                alert(response.data.message);
            }

            navigate("/duty-types");
        } catch (err) {
            console.error("Failed to update duty type:", err);
            console.error("Error response:", err.response);

            const errorMessage = err.response?.data?.message || "Failed to update duty type";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="page-container">
                <Sidebar />
                <div className="page-main">
                    <Navbar />
                    <div className="page-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <Sidebar />

            <div className="page-main">
                <Navbar />

                <div className="page-content">
                    {/* Header */}
                    <div className="header-wrapper" style={{ marginBottom: "2rem" }}>
                        <button
                            onClick={() => navigate('/duty-types')}
                            className="btn-back"
                        >
                            <ArrowLeft size={16} />
                            Back to Duty Types
                        </button>

                        <h1 className="page-title">
                            Edit Duty Type
                        </h1>
                        <p className="page-subtitle">
                            Update duty type details
                        </p>
                    </div>

                    {/* Form */}
                    <div className="form-card">
                        <form onSubmit={handleSubmit}>
                            <FormInput
                                label="Duty Type Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Night Shift, Day Shift, Patrol"
                                error={errors.name}
                                required
                            />

                            <FormInput
                                label="Description"
                                type="textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter a brief description (optional)"
                                error={errors.description}
                            />

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-submit"
                                >
                                    <Save size={18} />
                                    {loading ? "Updating..." : "Update Duty Type"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/duty-types')}
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

export default EditDutyType;
