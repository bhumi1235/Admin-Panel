import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await axios.get(`${API_BASE_URL}/api/admin/profile`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Extract userData from response (handle various structures)
                    const userData = res.data.userData || res.data.data || res.data;
                    setUser(userData);
                } catch (error) {
                    console.error("Session expired or invalid token", error);
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post(`${API_BASE_URL}/api/admin/login`, { email, password });
        const { token, ...userData } = res.data;
        localStorage.setItem("token", token);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

