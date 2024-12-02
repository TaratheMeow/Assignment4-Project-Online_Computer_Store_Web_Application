import React from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Inventory from "./Inventory";
import AdminOrders from "./AdminOrders";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedRole");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="nav-left">
          <NavLink
            to="/admin/inventory"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Inventory
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Orders
          </NavLink>
        </div>
        <div className="nav-right">
          <button onClick={handleLogout} className="logout-button">
            <i className="bx bx-log-out"></i>
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-content">
        <Routes>
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<AdminOrders />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
