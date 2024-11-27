import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RoleSelect from "./components/RoleSelect";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard"; // 注意路径
import AdminDashboard from "./components/admin/AdminDashboard";
import PrivateRoute from "./components/auth/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App" style={{ minHeight: "100vh" }}>
          <div style={contentStyle}>
            <Routes>
              <Route path="/" element={<RoleSelect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute role="user">
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute role="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

const contentStyle = {
  padding: "20px",
  maxWidth: "1200px",
  margin: "0 auto",
};

export default App;
