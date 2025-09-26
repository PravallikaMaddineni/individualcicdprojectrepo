import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ViewExpenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch expenses for logged-in user
  const fetchExpenses = async () => {
    if (!user || !user.id) {
      navigate("/userlogin");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/expenses/user/${user.id}`);
      setExpenses(response.data || []);
    } catch {
      setError("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Edit expense
  const handleEdit = (expense) => {
    navigate(`/editexpense/${expense.id}`, { state: { expense } });
  };

  // Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      setDeletingId(id);
      await axios.delete(`${API_URL}/expenses/delete/${id}`);
      setExpenses(expenses.filter((exp) => exp.id !== id));
    } catch {
      setError("Failed to delete expense");
    } finally {
      setDeletingId(null);
    }
  };

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#FFB1AC",
      borderRadius: "15px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      textAlign: "center",
      color: "#fff",
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "30px",
      letterSpacing: "1px",
      textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
    },
    error: {
      color: "red",
      textAlign: "center",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    tableWrapper: {
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 12px",
      textAlign: "center",
    },
    th: {
      backgroundColor: "#fff",
      color: "#FF6F61",
      padding: "15px",
      fontSize: "16px",
      borderRadius: "12px 12px 0 0",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    td: {
      padding: "15px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    actionBtn: {
      padding: "8px 18px",
      margin: "0 5px",
      borderRadius: "8px",
      border: "none",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    editBtn: {
      backgroundColor: "#4CAF50",
      color: "white",
    },
    deleteBtn: {
      backgroundColor: "#e74c3c",
      color: "white",
    },
    deleteDisabled: {
      backgroundColor: "#ff9999",
      cursor: "not-allowed",
    },
    noData: {
      textAlign: "center",
      fontStyle: "italic",
      padding: "30px",
      color: "#fff",
      fontSize: "16px",
    },
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "60px", fontSize: "18px" }}>Loading...</div>;
  if (!user) return <div style={{ textAlign: "center", marginTop: "60px", fontSize: "18px" }}>No user found.</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Expenses</h2>
      {error && <p style={styles.error}>{error}</p>}

      {expenses.length === 0 ? (
        <p style={styles.noData}>No expenses found.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td style={styles.td}>{expense.category}</td>
                  <td style={styles.td}>${expense.amount}</td>
                  <td style={styles.td}>{new Date(expense.date).toLocaleDateString()}</td>
                  <td style={styles.td}>{expense.description}</td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.actionBtn, ...styles.editBtn }}
                      onClick={() => handleEdit(expense)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        ...styles.actionBtn,
                        ...(deletingId === expense.id ? styles.deleteDisabled : styles.deleteBtn),
                      }}
                      onClick={() => handleDelete(expense.id)}
                      disabled={deletingId === expense.id}
                    >
                      {deletingId === expense.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
