import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { IncidentProvider } from "./context/IncidentContext";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <IncidentProvider>
                    <AppRoutes />
                </IncidentProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

