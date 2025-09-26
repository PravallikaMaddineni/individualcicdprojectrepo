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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

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

      navigate("/user/profile");
    } catch (err) {
      setError(err.response?.data || "Invalid email or password");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#ffeaea" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.1)", padding: "40px 30px", width: "350px", display: "flex", flexDirection: "column" }}>
        <h3 style={{ color: "#FFB1AC", marginBottom: "25px", textAlign: "center" }}>User Login</h3>
        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>{error}</p>}

        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column" }}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column" }}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
