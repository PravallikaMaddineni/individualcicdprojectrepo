import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewAllSupervisors() {
  const [supervisors, setSupervisors] = useState([]);
  const [error, setError] = useState("");

  // ✅ Read backend URL from .env
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/supervisors`);
      setSupervisors(res.data);
    } catch (err) {
      console.error("Error fetching supervisors", err);
      setError("Failed to fetch supervisors. Check backend URL and server status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supervisor?")) return;
    try {
      await axios.delete(`${API_URL}/admin/supervisors/${id}`);
      setSupervisors(supervisors.filter((sup) => sup.id !== id));
    } catch (err) {
      alert("Failed to delete supervisor");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        backgroundColor: "#ffe5e3",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#FFB1AC", marginBottom: "30px" }}>
        All Supervisors
      </h2>

      {error && (
        <p
          style={{
            color: "#fff",
            background: "rgba(255, 0, 0, 0.6)",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          {error}
        </p>
      )}

      {supervisors.length > 0 ? (
        <div
          style={{
            overflowX: "auto",
            background: "#fff",
            borderRadius: "15px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            padding: "20px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#FFB1AC", color: "#fff" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Mobile</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Action</th> {/* new column */}
              </tr>
            </thead>
            <tbody>
              {supervisors.map((sup) => (
                <tr
                  key={sup.id}
                  style={{
                    borderBottom: "1px solid #ddd",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#ffe0df")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td style={{ padding: "12px" }}>{sup.id}</td>
                  <td style={{ padding: "12px" }}>{sup.name}</td>
                  <td style={{ padding: "12px" }}>{sup.email}</td>
                  <td style={{ padding: "12px" }}>{sup.mobile}</td>
                  <td style={{ padding: "12px" }}>{sup.status}</td>
                  <td style={{ padding: "12px" }}>
                    <button
                      style={{
                        backgroundColor: "#e53935", // red
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() => handleDelete(sup.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && (
          <p
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#888",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            No supervisors found.
          </p>
        )
      )}
    </div>
  );
}
