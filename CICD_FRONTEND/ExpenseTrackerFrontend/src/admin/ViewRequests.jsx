import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config"; // uses your config.js

export default function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  // Fetch all supervisor requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${config.url}/admin/requests`);
      setRequests(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching requests", err);
      setError("Failed to fetch requests. Check backend URL or server.");
    }
  };

  // Delete a request
  const deleteRequest = async (id) => {
    try {
      await axios.delete(`${config.url}/admin/requests`, { params: { id } });
      fetchRequests(); // refresh list
    } catch (err) {
      console.error("Failed to delete request", err);
      setError("Failed to delete request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Inline CSS with #FFB1AC
  const styles = {
    container: { padding: "20px", fontFamily: "Arial, sans-serif" },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    th: {
      backgroundColor: "#FFB1AC",
      color: "white",
      padding: "12px",
      textAlign: "left"
    },
    td: { padding: "10px", borderBottom: "1px solid #ddd" },
    button: {
      padding: "6px 12px",
      backgroundColor: "#FFB1AC",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "0.3s"
    },
    error: { color: "red", marginTop: "10px" },
    heading: { fontSize: "24px", color: "#FFB1AC" }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Supervisor Requests</h2>

      {error && <p style={styles.error}>{error}</p>}

      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Supervisor Name</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td style={styles.td}>{req.id}</td>
                <td style={styles.td}>{req.supervisor?.name || "N/A"}</td>
                <td style={styles.td}>{req.status}</td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#e89b9b")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#FFB1AC")}
                    onClick={() => deleteRequest(req.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
