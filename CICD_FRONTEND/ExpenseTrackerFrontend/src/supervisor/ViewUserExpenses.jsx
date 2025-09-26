import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ViewUserExpenses() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const supervisor =
    JSON.parse(sessionStorage.getItem("supervisor") || localStorage.getItem("supervisor") || "null");

  const fetchUsers = async () => {
    if (!supervisor?.id) {
      setError("Supervisor not logged in.");
      setLoading(false);
      navigate("/supervisorlogin");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/supervisorRequests/supervisor/${supervisor.id}`
      );
      const accepted = res.data.filter(r => r.status === "APPROVED");
      setUsers(accepted.map(r => r.user));
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading users...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  if (users.length === 0) return <p style={{ textAlign: "center" }}>No users available.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#FF6F61", marginBottom: "20px" }}>Users You Can Access</h2>
      <ul style={{ padding: "0 20px" }}>
        {users.map(u => (
          <li key={u.id} style={{ marginBottom: "10px" }}>
            {u.name} ({u.email || "No Email"})
          </li>
        ))}
      </ul>
    </div>
  );
}
