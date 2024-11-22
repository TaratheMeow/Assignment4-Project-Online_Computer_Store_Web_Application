import React from "react";
import { useNavigate } from "react-router-dom";

function RoleSelect() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    localStorage.setItem("selectedRole", role);
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome! Please Select Your Role</h2>
      <div style={styles.buttonContainer}>
        <button
          style={styles.adminButton}
          onClick={() => handleRoleSelect("admin")}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Admin Login
        </button>
        <button
          style={styles.userButton}
          onClick={() => handleRoleSelect("user")}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          User Login/Register
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "100px auto",
    padding: "30px",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#333",
    marginBottom: "30px",
    fontSize: "24px",
    fontWeight: "600",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "30px",
  },
  adminButton: {
    padding: "15px 30px",
    fontSize: "1.1rem",
    backgroundColor: "#FF69B4",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  userButton: {
    padding: "15px 30px",
    fontSize: "1.1rem",
    backgroundColor: "#87CEEB",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

export default RoleSelect;
