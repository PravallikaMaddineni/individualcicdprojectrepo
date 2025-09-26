import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddExpense() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/expenses/add`, {
        ...formData,
        user: { id: user.id },
      });
      if (response.status === 200) {
        setMessage("Expense added successfully!");
        setTimeout(() => navigate("/user/viewexpenses"), 1000);
      }
    } catch (err) {
      setError(err.response?.data || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#ffeaea",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          padding: "35px 30px",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <h3
          style={{
            color: "#FFB1AC",
            textAlign: "center",
            marginBottom: "25px",
            fontSize: "26px",
            textDecoration: "underline",
          }}
        >
          Add Expense
        </h3>

        {message && <p style={{ color: "green", textAlign: "center", marginBottom: "15px" }}>{message}</p>}
        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "15px" }}>{error}</p>}

        {["category", "amount", "date"].map((field) => (
          <div key={field} style={{ marginBottom: "18px", display: "flex", flexDirection: "column" }}>
            <label htmlFor={field} style={{ marginBottom: "5px", fontWeight: "600", color: "#333", fontSize: "14px" }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === "amount" ? "number" : field === "date" ? "date" : "text"}
              id={field}
              value={formData[field]}
              onChange={handleChange}
              required
              min={field === "amount" ? "0" : undefined}
              style={{
                width: "100%",
                padding: "10px 15px",
                borderRadius: "8px",
                border: "1px solid #FFB1AC",
                outline: "none",
                fontSize: "14px",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column" }}>
          <label htmlFor="description" style={{ marginBottom: "5px", fontWeight: "600", color: "#333", fontSize: "14px" }}>
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px 15px",
              borderRadius: "8px",
              border: "1px solid #FFB1AC",
              outline: "none",
              fontSize: "14px",
              minHeight: "70px",
              textAlign: "center",
              transition: "all 0.3s ease",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#FFB1AC",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#ff7f7f")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#FFB1AC")}
        >
          {loading ? "Please wait..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
