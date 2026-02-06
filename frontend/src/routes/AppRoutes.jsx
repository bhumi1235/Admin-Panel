import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Supervisors from "../pages/Supervisors";
import AddSupervisor from "../pages/AddSupervisor";
import SupervisorDetails from "../pages/SupervisorDetails";
import Guards from "../pages/Guards";
import AllGuards from "../pages/AllGuards";
import GuardDetails from "../pages/GuardDetails";
import ResetData from "../pages/ResetData";
import DutyTypes from "../pages/DutyTypes";
import AddDutyType from "../pages/AddDutyType";
import EditDutyType from "../pages/EditDutyType";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/supervisors" element={<Supervisors />} />
                <Route path="/supervisors/add" element={<AddSupervisor />} />
                <Route path="/supervisors/:id" element={<SupervisorDetails />} />
                <Route path="/supervisors/:id/guards" element={<Guards />} />
                <Route path="/guards" element={<AllGuards />} />
                <Route path="/guards/:id" element={<GuardDetails />} />
                <Route path="/all-guards" element={<AllGuards />} />

                {/* Duty Types Routes */}
                <Route path="/duty-types" element={<DutyTypes />} />
                <Route path="/duty-types/add" element={<AddDutyType />} />
                <Route path="/duty-types/edit/:id" element={<EditDutyType />} />
            </Route>

            <Route path="/reset" element={<ResetData />} />
        </Routes>
    );
}

export default AppRoutes;
