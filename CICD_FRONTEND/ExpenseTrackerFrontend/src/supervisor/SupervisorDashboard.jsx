import { useEffect, useState } from "react";
import axios from "axios";

export default function SupervisorDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const supervisor = JSON.parse(localStorage.getItem("supervisor"));
  const API_URL = import.meta.env.VITE_API_URL; // Using .env URL

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/supervisorRequests/supervisor/${supervisor.id}`
        );
        setRequests(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch requests", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [supervisor.id]);

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = requests.filter((r) => r.status === "APPROVED").length;
  const rejectedRequests = requests.filter((r) => r.status === "REJECTED").length;

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "900px",
      margin: "40px auto",
      fontFamily: "Arial, sans-serif",
    },
    welcome: {
      textAlign: "center",
      color: "#ff6f61",
      fontSize: "28px",
      fontWeight: "bold",
    },
    summaryContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "30px",
      flexWrap: "wrap",
      gap: "20px",
    },
    card: {
      flex: "1 1 200px",
      backgroundColor: "#fff5f0",
      borderRadius: "12px",
      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
      padding: "20px",
      textAlign: "center",
      cursor: "default",
      transition: "transform 0.2s",
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#ff7f50",
      marginBottom: "10px",
    },
    cardNumber: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#333",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.welcome}>Welcome, {supervisor.name}</h2>

      <div style={styles.summaryContainer}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Total Requests</div>
          <div style={styles.cardNumber}>{totalRequests}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Pending</div>
          <div style={styles.cardNumber}>{pendingRequests}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Approved</div>
          <div style={styles.cardNumber}>{approvedRequests}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Rejected</div>
          <div style={styles.cardNumber}>{rejectedRequests}</div>
        </div>
      </div>
    </div>
  );
}
