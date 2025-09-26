import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contextapi/AuthContext";

export default function UserLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsUserLoggedIn } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL; // Docker-friendly URL

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/users/login`,
        null,
        { params: { email: formData.email, password: formData.password } }
      );

      if (!response.data || !response.data.id) {
        setError("Invalid email or password");
        return;
      }

      // Save full user object for profile
      localStorage.setItem("user", JSON.stringify(response.data));
      setIsUserLoggedIn(true);

      navigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#ffeaea",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <form 
        onSubmit={handleSubmit} 
        style={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          padding: "40px 30px",
          width: "350px",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s ease, box-shadow 0.3s ease"
        }}
      >
        <h3 style={{ color: "#FFB1AC", marginBottom: "25px", textAlign: "center" }}>User Login</h3>
        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>{error}</p>}

        {/* Email field */}
        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column" }}>
          <label htmlFor="email" style={{ marginBottom: "5px", fontWeight: "600", color: "#333", fontSize: "14px" }}>Email</label>
          <input 
            type="email" 
            id="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            style={{
              width: "100%",
              padding: "10px 15px",
              border: "1px solid #FFB1AC",
              borderRadius: "8px",
              outline: "none",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Password field */}
        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column" }}>
          <label htmlFor="password" style={{ marginBottom: "5px", fontWeight: "600", color: "#333", fontSize: "14px" }}>Password</label>
          <input 
            type="password" 
            id="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            style={{
              width: "100%",
              padding: "10px 15px",
              border: "1px solid #FFB1AC",
              borderRadius: "8px",
              outline: "none",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />
        </div>

        <button 
          type="submit" 
          style={{
            width: "100%",
            padding: "12px",
            background: "#FFB1AC",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.3s ease"
          }}
          onMouseOver={e => e.currentTarget.style.background = "#ff7f7f"}
          onMouseOut={e => e.currentTarget.style.background = "#FFB1AC"}
        >
          Login
        </button>
      </form>
    </div>
  );
}
