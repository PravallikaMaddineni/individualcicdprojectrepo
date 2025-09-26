import { useState } from "react";
import axios from "axios";

export default function SendRequest() {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  // storage-safe supervisor
  const supervisor =
    JSON.parse(sessionStorage.getItem("supervisor") || localStorage.getItem("supervisor") || "null");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supervisor) {
      alert("Supervisor info not found. Please log in again.");
      return;
    }
    if (!userId) {
      alert("User ID is required.");
      return;
    }

    try {
      await axios.post(`${API_URL}/supervisorRequests/send`, {
        user: { id: parseInt(userId) },
        supervisor: { id: supervisor.id },
        status: "PENDING",
      });
      setSuccess("Request sent successfully!");
      setUserId("");
      setMessage("");
    } catch (err) {
      console.error("Failed to send request", err);
      alert("Failed to send request. Check your backend or network.");
    }
  };

  const styles = { /* keep your existing inline styles */ };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Send Request</h2>
      {success && <p style={styles.success}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>User ID:</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.textarea}
          />
        </div>
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
        >
          Send Request
        </button>
      </form>
    </div>
  );
}
