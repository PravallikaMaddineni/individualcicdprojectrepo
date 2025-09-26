import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewApprovedRequests() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  // safe supervisor fetch from sessionStorage or fallback to localStorage
  const supervisor = JSON.parse(sessionStorage.getItem("supervisor") || localStorage.getItem("supervisor") || "null");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchApprovedExpenses = async () => {
    if (!supervisor?.id) {
      setError("Supervisor not logged in. Please login again.");
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/expenses/approved/supervisor/${supervisor.id}`);
      setExpenses(response.data || []);
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
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#fff5f4", minHeight: "100vh" }}>
      <h2 style={{ color: "#FF6F61", marginBottom: "25px", fontSize: "28px", textAlign: "center", fontWeight: "600" }}>Approved Expenses</h2>
      {error && <p style={{ color: "#d8000c", backgroundColor: "#ffd2d2", padding: "10px", borderRadius: "10px", marginBottom: "15px", textAlign: "center", fontWeight: "500" }}>{error}</p>}
      {expenses.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555", fontSize: "18px", marginTop: "20px" }}>No approved expenses found</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%", borderRadius: "15px", overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}>
          <thead style={{ backgroundColor: "#FF8F81", color: "#fff", textAlign: "left", fontSize: "16px" }}>
            <tr>
              <th style={{ padding: "12px 15px" }}>ID</th>
              <th style={{ padding: "12px 15px" }}>User Name</th>
              <th style={{ padding: "12px 15px" }}>Category</th>
              <th style={{ padding: "12px 15px" }}>Amount</th>
              <th style={{ padding: "12px 15px" }}>Date</th>
              <th style={{ padding: "12px 15px" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, index) => (
              <tr key={exp.id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#ffe9e4" }}>
                <td style={{ padding: "12px 15px" }}>{exp.id}</td>
                <td style={{ padding: "12px 15px" }}>{exp.user?.name || "N/A"}</td>
                <td style={{ padding: "12px 15px" }}>{exp.category}</td>
                <td style={{ padding: "12px 15px" }}>${exp.amount}</td>
                <td style={{ padding: "12px 15px" }}>{new Date(exp.date).toLocaleDateString()}</td>
                <td style={{ padding: "12px 15px" }}>{exp.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
