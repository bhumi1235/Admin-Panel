import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Supervisors from "../pages/Supervisors";
import AddSupervisor from "../pages/AddSupervisor";
import SupervisorDetails from "../pages/SupervisorDetails";
import Guards from "../pages/Guards";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/supervisors" element={<Supervisors />} />
      <Route path="/supervisors/add" element={<AddSupervisor />} />
      <Route path="/supervisors/:id" element={<SupervisorDetails />} />
      <Route path="/supervisors/:id/guards" element={<Guards />} />
    </Routes>
  );
}

export default AppRoutes;
