import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UpdateProfile() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    mobile: "",
    status: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setFormData(JSON.parse(storedUser));
    } else {
      navigate("/userlogin");
    }
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.put(`${API_URL}/users/update`, formData);
      if (response.status === 200) {
        setMessage("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(formData)); // Update localStorage
        setTimeout(() => navigate("/user/profile"), 1000);
      }
    } catch (err) {
      if (err.response) setError(err.response.data);
      else setError("An unexpected error occurred.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "30px",
        backgroundColor: "#FFB1AC",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          fontSize: "26px",
          marginBottom: "25px",
          color: "#fff",
          textDecoration: "underline",
        }}
      >
        Update Profile
      </h3>

      {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ marginBottom: "15px", padding: "10px", borderRadius: "8px", border: "1px solid #FFB1AC" }}
        />
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginBottom: "15px", padding: "10px", borderRadius: "8px", border: "1px solid #FFB1AC" }}
        />
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ marginBottom: "15px", padding: "10px", borderRadius: "8px", border: "1px solid #FFB1AC" }}
        />
        <input
          type="number"
          id="mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
          style={{ marginBottom: "20px", padding: "10px", borderRadius: "8px", border: "1px solid #FFB1AC" }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#FFB1AC",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Update
        </button>
      </form>
    </div>
  );
}
