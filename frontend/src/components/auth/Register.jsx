import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const registerData = {
      email: formData.email,
      password: formData.password,
      role: "user",
    };

    console.log("Attempting registration with:", registerData);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error details:", err);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Registration</h2>
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
        <div style={styles.formGroup}>
          <label style={styles.label}>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Confirm your password"
          />
        </div>
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Register
        </button>
        <p style={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
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
  button: {
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
  loginText: {
    textAlign: "center",
    color: "#666",
    fontSize: "0.9rem",
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

export default Register;
