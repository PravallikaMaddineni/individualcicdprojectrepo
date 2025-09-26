import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

export default function EditExpense() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const expenseFromState = location.state?.expense;
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({ category: "", amount: "", date: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user) {
      navigate("/userlogin");
      return;
    }
    if (expenseFromState) {
      setFormData({
        category: expenseFromState.category,
        amount: expenseFromState.amount,
        date: expenseFromState.date,
        description: expenseFromState.description,
      });
      setLoading(false);
    } else {
      axios.get(`${API_URL}/expenses/${id}`)
        .then(res => setFormData({
          category: res.data.category,
          amount: res.data.amount,
          date: res.data.date,
          description: res.data.description,
        }))
        .catch(() => setError("Failed to load expense"))
        .finally(() => setLoading(false));
    }
  }, [id, expenseFromState, navigate, API_URL, user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await axios.put(`${API_URL}/expenses/update`, { id, ...formData, user: { id: user.id } });
      setMessage("Expense updated successfully!");
      setTimeout(() => navigate("/user/viewexpenses"), 1000);
    } catch {
      setError("Failed to update expense");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;

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
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "25px",
          color: "#fff",
          textDecoration: "underline",
        }}
      >
        Edit Expense
      </h3>

      {message && <p style={{ textAlign: "center", color: "green", marginBottom: "15px", fontWeight: "bold" }}>{message}</p>}
      {error && <p style={{ textAlign: "center", color: "red", marginBottom: "15px", fontWeight: "bold" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {["category", "amount", "date"].map(field => (
          <div key={field} style={{ marginBottom: "18px", display: "flex", flexDirection: "column" }}>
            <label htmlFor={field} style={{ marginBottom: "5px", fontWeight: "600", color: "#333", fontSize: "14px" }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type={field === "amount" ? "number" : field === "date" ? "date" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
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
            name="description"
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
          disabled={saving}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#FFB1AC",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: saving ? "not-allowed" : "pointer",
            transition: "background 0.3s ease",
          }}
        >
          {saving ? "Saving..." : "Update Expense"}
        </button>
      </form>
    </div>
  );
}
