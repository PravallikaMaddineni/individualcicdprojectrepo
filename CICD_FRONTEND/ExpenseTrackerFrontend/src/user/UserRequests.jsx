import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      fetchRequests(user.id);
    } else {
      setError("User not logged in.");
      navigate("/userlogin"); // redirect if not logged in
    }
  }, [navigate]);

  const fetchRequests = async (userId) => {
    try {
      const response = await axios.get(
        `${API_URL}/supervisorRequests/user/${userId}`
      );
      setRequests(response.data || []);
      setError("");
    } catch {
      setError("Failed to fetch requests");
    }
  };

  const updateStatus = async (requestId, status) => {
    try {
      await axios.put(
        `${API_URL}/supervisorRequests/updateStatus/${requestId}`,
        null,
        { params: { status } }
      );
      alert(`Request ${status.toLowerCase()}!`);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      fetchRequests(storedUser.id); // refresh list
    } catch {
      alert("Failed to update request");
    }
  };

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "20px",
      backgroundColor: "#fff5f0",
      borderRadius: "12px",
      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      textAlign: "center",
      color: "#ff6f61",
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "bold",
      textDecoration: "underline",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "center",
    },
    th: {
      backgroundColor: "#ff6f61",
      color: "white",
      padding: "10px",
      borderRadius: "6px 6px 0 0",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
    },
    statusApproved: {
      color: "white",
      backgroundColor: "green",
      borderRadius: "6px",
      padding: "5px 10px",
      fontWeight: "bold",
    },
    statusRejected: {
      color: "white",
      backgroundColor: "red",
      borderRadius: "6px",
      padding: "5px 10px",
      fontWeight: "bold",
    },
    statusPending: {
      color: "white",
      backgroundColor: "orange",
      borderRadius: "6px",
      padding: "5px 10px",
      fontWeight: "bold",
    },
    actionBtn: {
      padding: "5px 10px",
      margin: "0 5px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
    },
    acceptBtn: { backgroundColor: "#4CAF50", color: "white" },
    rejectBtn: { backgroundColor: "#f44336", color: "white" },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Supervisor Requests</h3>
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

      {requests.length === 0 ? (
        <p style={{ textAlign: "center" }}>No requests found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Request ID</th>
              <th style={styles.th}>Supervisor Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Mobile</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td style={styles.td}>{req.id}</td>
                <td style={styles.td}>{req.supervisor.name}</td>
                <td style={styles.td}>{req.supervisor.email}</td>
                <td style={styles.td}>{req.supervisor.mobile}</td>
                <td style={styles.td}>
                  <span
                    style={
                      req.status === "APPROVED"
                        ? styles.statusApproved
                        : req.status === "REJECTED"
                        ? styles.statusRejected
                        : styles.statusPending
                    }
                  >
                    {req.status}
                  </span>
                </td>
                <td style={styles.td}>
                  {req.status === "PENDING" && (
                    <>
                      <button
                        style={{ ...styles.actionBtn, ...styles.acceptBtn }}
                        onClick={() => updateStatus(req.id, "APPROVED")}
                      >
                        Accept
                      </button>
                      <button
                        style={{ ...styles.actionBtn, ...styles.rejectBtn }}
                        onClick={() => updateStatus(req.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
