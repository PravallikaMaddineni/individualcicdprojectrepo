import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewSentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const supervisor =
    JSON.parse(sessionStorage.getItem("supervisor") || localStorage.getItem("supervisor") || "null");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!supervisor?.id) {
      setError("Supervisor not logged in. Please login again.");
      setLoading(false);
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

  const styles = { /* keep your existing styles */ };

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
