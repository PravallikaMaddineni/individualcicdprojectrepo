import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contextapi/AuthContext";

export default function SendRequest() {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { isSupervisorLoggedIn } = useAuth();

  // safe supervisor read: sessionStorage fallback to localStorage
  const supervisor =
    JSON.parse(sessionStorage.getItem("supervisor") || localStorage.getItem("supervisor") || "null");

  // Docker-friendly backend URL from .env
  const API_URL = import.meta.env.VITE_API_URL;

  // Redirect if supervisor is not logged in or supervisor data missing
  useEffect(() => {
    if (!isSupervisorLoggedIn || !supervisor) {
      navigate("/supervisorlogin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupervisorLoggedIn, supervisor]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Safety checks
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

  // Styles (unchanged)
  const styles = {
    container: {
      padding: "25px",
      maxWidth: "500px",
      margin: "40px auto",
      backgroundColor: "#f4f4f9",
      borderRadius: "12px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      textAlign: "center",
      marginBottom: "25px",
      color: "#333",
    },
    formGroup: {
      marginBottom: "20px",
      display: "flex",
      flexDirection: "column",
    },
    label: {
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#555",
    },
    input: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      outline: "none",
    },
    textarea: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
      minHeight: "100px",
      resize: "vertical",
      outline: "none",
    },
    button: {
      padding: "12px 15px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#4CAF50",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
      width: "100%",
      fontSize: "16px",
      transition: "background-color 0.3s",
    },
    success: {
      color: "green",
      textAlign: "center",
      marginBottom: "20px",
      fontWeight: "bold",
    },
  };

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
