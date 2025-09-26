import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ViewSentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const supervisor =
    JSON.parse(sessionStorage.getItem("supervisor") || localStorage.getItem("supervisor") || "null");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!supervisor?.id) {
      setError("Supervisor not logged in. Please login again.");
      setLoading(false);
      navigate("/supervisorlogin");
      return;
    }
    fetchSentRequests();
  }, []);

  const fetchSentRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/supervisorRequests/supervisor/${supervisor.id}`);
      setRequests(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch sent requests", err);
      setRequests([]);
      setError("Failed to load sent requests.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "800px",
      margin: "40px auto",
      backgroundColor: "#fff5f0",
      borderRadius: "12px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
      color: "#ff6f61",
      fontSize: "24px",
      fontWeight: "bold",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      backgroundColor: "#ff7f50",
      color: "#fff",
      padding: "12px",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ffd1c1",
    },
    tbodyRow: {
      transition: "background 0.3s",
    },
    noRequests: {
      textAlign: "center",
      color: "#ff6f61",
      fontWeight: "bold",
      marginTop: "20px",
    },
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading sent requests...</p>;
  if (error) return <p style={styles.noRequests}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sent Requests</h2>
      {requests.length === 0 ? (
        <p style={styles.noRequests}>No sent requests.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr
                key={req.id}
                style={{
                  ...styles.tbodyRow,
                  backgroundColor: index % 2 === 0 ? "#fff" : "#ffe9e4",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffe3df")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#fff" : "#ffe9e4")
                }
              >
                <td style={styles.td}>{req.id}</td>
                <td style={styles.td}>{req.user?.id || "N/A"}</td>
                <td style={styles.td}>{req.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
