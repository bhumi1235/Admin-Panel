import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            await login(formData.email, formData.password);
            navigate("/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
            if (!err.response) {
                setError("Network Error: Unable to reach server. Please check your connection.");
            } else {
                setError(err.response?.data?.message || "Invalid email or password");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Background pattern overlay */}
            <div className="login-bg-pattern" />

            <div className="login-card">
                {/* Header */}
                <div className="login-header">
                    {/* Decorative circles */}
                    <div className="login-header-circle-1" />
                    <div className="login-header-circle-2" />

                    <div className="login-logo-container">
                        <img
                            src="/logo.png"
                            alt="Smart Rangers Logo"
                            className="login-logo-img"
                        />
                    </div>
                    <h2 className="login-title">
                        <span className="text-red">Smart</span> <span className="text-blue">Rangers</span>
                    </h2>
                    <p className="login-subtitle">Admin Panel Login</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="login-error">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="login-field-group">
                        <label className="login-label">Email Address</label>
                        <div className="login-input-wrapper">
                            <Mail size={20} className="login-input-icon" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@example.com"
                                className="login-input"
                            />
                        </div>
                    </div>

                    <div className="login-field-group">
                        <label className="login-label">Password</label>
                        <div className="login-input-wrapper">
                            <Lock size={20} className="login-input-icon" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="login-input"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="login-btn"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;

