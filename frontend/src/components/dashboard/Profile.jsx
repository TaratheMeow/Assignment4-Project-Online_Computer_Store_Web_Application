import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile({
            ...data,
            address: data.address || {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
          });
        }
      } catch (err) {
        console.log("Load profile error:", err);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: profile.address }),
      });

      if (res.ok) {
        setMessage("Address updated");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (err) {
      console.log("Update error:", err);
      setMessage("Update failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    }
  };

  return (
    <div className="profile-container">
      <div className="header-with-back">
        <button onClick={() => navigate("/dashboard")}>
          <i className="bx bx-arrow-back"></i>
          Back
        </button>
        <h2>Profile</h2>
      </div>

      <div className="profile-info">
        <p>Email: {profile.email}</p>
      </div>

      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit} className="address-form">
        <h3>Address</h3>
        <div className="form-group">
          <label>Street</label>
          <input
            name="address.street"
            value={profile.address.street}
            onChange={handleChange}
            placeholder="Enter street"
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            name="address.city"
            value={profile.address.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>

        <div className="form-group">
          <label>State</label>
          <input
            name="address.state"
            value={profile.address.state}
            onChange={handleChange}
            placeholder="Enter state"
          />
        </div>

        <div className="form-group">
          <label>ZIP Code</label>
          <input
            name="address.zipCode"
            value={profile.address.zipCode}
            onChange={handleChange}
            placeholder="Enter ZIP code"
          />
        </div>

        <div className="form-group">
          <label>Country</label>
          <input
            name="address.country"
            value={profile.address.country}
            onChange={handleChange}
            placeholder="Enter country"
          />
        </div>

        <button type="submit">Save Address</button>
      </form>
    </div>
  );
}

export default Profile;
