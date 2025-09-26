import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/userlogin"); // redirect if not logged in
    }
  }, [navigate]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "26px", color: "#333", marginBottom: "20px" }}>
        User Profile
      </h2>

      <div
        style={{
          backgroundColor: "#FFB1AC",
          border: "1px solid black",
          borderRadius: "10px",
          padding: "20px",
          width: "350px",
        }}
      >
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Mobile No:</strong> {user.mobile}
        </p>
        <p>
          <strong>Status:</strong> {user.status}
        </p>

        <button
          onClick={() => navigate("/updateprofile")}
          style={{
            marginTop: "15px",
            padding: "8px 15px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
