import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config"; // backend URL

export default function ViewApprovedRequests() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  // Fetch approved expenses for the logged-in supervisor
  const fetchApprovedExpenses = async () => {
    const supervisorId = localStorage.getItem("supervisorId"); // ✅ read from localStorage
    if (!supervisorId) {
      setError("Supervisor ID is missing. Please login again.");
      return;
    }

    try {
      const response = await axios.get(
        `${config.url}/expenses/approved/supervisor/${supervisorId}`
      );
      setExpenses(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching approved expenses", err);
      setError("Failed to fetch approved expenses");
    }
  };

  useEffect(() => {
    fetchApprovedExpenses();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Approved Expenses</h2>

      {error && <p style={styles.error}>{error}</p>}

      {expenses.length === 0 ? (
        <p style={styles.noData}>No approved expenses found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.td}>ID</th>
              <th style={styles.td}>User Name</th>
              <th style={styles.td}>Category</th>
              <th style={styles.td}>Amount</th>
              <th style={styles.td}>Date</th>
              <th style={styles.td}>Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, index) => (
              <tr
                key={exp.id}
                style={{
                  ...styles.tbodyRow,
                  backgroundColor: index % 2 === 0 ? "#fff" : "#ffe9e4", // alternating row colors
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffe3df")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? "#fff" : "#ffe9e4")
                }
              >
                <td style={styles.td}>{exp.id}</td>
                <td style={styles.td}>{exp.user?.name || "N/A"}</td>
                <td style={styles.td}>{exp.category}</td>
                <td style={styles.td}>{exp.amount}</td>
                <td style={styles.td}>{exp.date}</td>
                <td style={styles.td}>{exp.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ==================== CSS in JS ====================
const styles = {
  container: {
    padding: "30px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fff5f4",
    minHeight: "100vh",
  },
  title: {
    color: "#FF6F61",
    marginBottom: "25px",
    fontSize: "28px",
    textAlign: "center",
    fontWeight: "600",
  },
  error: {
    color: "#d8000c",
    backgroundColor: "#ffd2d2",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "15px",
    textAlign: "center",
    fontWeight: "500",
  },
  noData: {
    color: "#555",
    textAlign: "center",
    fontSize: "18px",
    marginTop: "20px",
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
  theadRow: {
    backgroundColor: "#FF8F81",
    color: "#fff",
    textAlign: "left",
    fontSize: "16px",
  },
  tbodyRow: {
    transition: "background 0.3s",
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #f0f0f0",
  },
};
