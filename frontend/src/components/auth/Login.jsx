import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const selectedRole = localStorage.getItem("selectedRole");

  useEffect(() => {
    if (!selectedRole) {
      navigate("/");
    }
  }, [selectedRole, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      login(data.token, data.role);

      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
      console.error("Login error:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {selectedRole === "admin" ? "Admin Login" : "User Login"}
      </h2>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter your email"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          style={
            selectedRole === "admin" ? styles.adminButton : styles.userButton
          }
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Login
        </button>
        {selectedRole === "user" && (
          <p style={styles.registerText}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.link}>
              Register Now
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "100px auto",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
    fontSize: "24px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "#555",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  input: {
    padding: "12px",
    borderRadius: "15px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    transition: "border-color 0.3s ease",
    outline: "none",
    "&:focus": {
      borderColor: "#87CEEB",
    },
  },
  adminButton: {
    padding: "12px",
    backgroundColor: "#FF69B4",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    marginTop: "10px",
  },
  userButton: {
    padding: "12px",
    backgroundColor: "#87CEEB",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
    marginTop: "10px",
  },
  error: {
    color: "#ff4d4f",
    textAlign: "center",
    marginBottom: "15px",
    padding: "10px",
    backgroundColor: "#fff2f0",
    borderRadius: "10px",
  },
  registerText: {
    textAlign: "center",
    color: "#666",
    fontSize: "0.9rem",
    marginTop: "15px",
  },
  link: {
    color: "#87CEEB",
    textDecoration: "none",
    fontWeight: "500",
    "&:hover": {
      textDecoration: "underline",
    },
  },
};

export default Login;
