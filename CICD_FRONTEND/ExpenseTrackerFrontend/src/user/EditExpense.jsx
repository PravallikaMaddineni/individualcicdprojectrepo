import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

export default function EditExpense() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const expenseFromState = location.state?.expense;
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Read backend URL from .env
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user) {
      navigate("/userlogin");
      return;
    }

    if (expenseFromState) {
      setFormData({
        category: String(expenseFromState.category || ""),
        amount: String(expenseFromState.amount || ""),
        date: String(expenseFromState.date || ""),
        description: String(expenseFromState.description || ""),
      });
      setLoading(false);
    } else {
      axios
        .get(`${API_URL}/expenses/${id}`)
        .then((res) =>
          setFormData({
            category: String(res.data.category || ""),
            amount: String(res.data.amount || ""),
            date: String(res.data.date || ""),
            description: String(res.data.description || ""),
          })
        )
        .catch(() => setError("Failed to load expense"))
        .finally(() => setLoading(false));
    }
    // Only run on mount or id change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await axios.put(`${API_URL}/expenses/update`, { 
        id: id,
        ...formData, 
        user: { id: user.id } 
      });
      setMessage("Expense updated successfully!");
      setTimeout(() => navigate("/user/viewexpenses"), 1000);
    } catch (err) {
      setError("Failed to update expense");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;

  const styles = {
    container: {
      maxWidth: "500px",
      margin: "50px auto",
      padding: "30px",
      backgroundColor: "#FFB1AC",
      borderRadius: "12px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      textAlign: "center",
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "25px",
      color: "#fff",
      textDecoration: "underline",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      marginBottom: "20px",
      fontSize: "16px",
      textAlign: "center",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      minHeight: "80px",
      fontSize: "16px",
      marginBottom: "20px",
      resize: "vertical",
      textAlign: "center",
    },
    button: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: saving ? "not-allowed" : "pointer",
      backgroundColor: "#ff6f61",
      color: "#fff",
      transition: "0.3s",
    },
    message: {
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "green",
    },
    error: {
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "red",
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Edit Expense</h3>
      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Amount</label>
        <input
          type="text"
          inputMode="numeric"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button} disabled={saving}>
          {saving ? "Saving..." : "Update Expense"}
        </button>
      </form>
    </div>
  );
}
