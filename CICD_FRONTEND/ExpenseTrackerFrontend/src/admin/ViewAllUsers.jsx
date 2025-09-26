import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewAllUsers() {
  const [users, setUsers] = useState([]);

  // ✅ Read backend URL from .env
  const backendUrl = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users. Check backend URL and server status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/admin/users?id=${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
        All Users
      </h2>
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
              <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ffe0df")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <td style={{ padding: "12px" }}>{u.id}</td>
                <td style={{ padding: "12px" }}>{u.name}</td>
                <td style={{ padding: "12px" }}>{u.email}</td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button
                    onClick={() => handleDelete(u.id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#e53935", // red
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "0.3s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d32f2f")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e53935")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
