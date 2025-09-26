import { useState } from "react";
import axios from "axios";

export default function SupervisorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL; // ✅ Using .env

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/supervisors/register`, formData);
      if (response.status === 200) {
        setMessage(response.data || "Registration successful!");
        setError("");
        setFormData({
          name: "",
          email: "",
          password: "",
          mobile: "",
        });
      }
    } catch (err) {
      setMessage("");
      if (err.response) {
        const msg = err.response.data.message || err.response.data;
        setError(msg);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#ffe5e3",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            color: "#FFB1AC",
            marginBottom: "10px",
          }}
        >
          Supervisor Registration
        </h3>

        {message && (
          <p style={{ textAlign: "center", color: "green", fontWeight: "bold" }}>
            {message}
          </p>
        )}
        {error && !message && (
          <p style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", color: "#555" }}>Full Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", color: "#555" }}>Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", color: "#555" }}>Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", color: "#555" }}>Mobile</label>
          <input
            type="text"
            id="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#FFB1AC",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#ff8f85")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#FFB1AC")}
        >
          Register
        </button>
      </form>
    </div>
  );
}
