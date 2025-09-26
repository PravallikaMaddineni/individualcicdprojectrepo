import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UpdateProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    mobile: '',
    status: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ✅ Backend URL from .env
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setFormData(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/users/update`, formData);
      if (response.status === 200) {
        setMessage(response.data);
        setError('');
        localStorage.setItem('user', JSON.stringify(formData));
        navigate('/user/profile'); // Redirect to profile after update
      }
    } catch (err) {
      setMessage('');
      if (err.response) setError(err.response.data);
      else setError('An unexpected error occurred.');
    }
  };

  // Inline styles (unchanged)
  const styles = {
    container: {
      maxWidth: "500px",
      margin: "40px auto",
      padding: "30px",
      borderRadius: "12px",
      backgroundColor: "#fff5f0",
      boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      textAlign: "center",
      fontSize: "26px",
      fontWeight: "bold",
      color: "#ff6f61",
      marginBottom: "20px",
      textDecoration: "underline",
    },
    formGroup: {
      marginBottom: "15px",
      display: "flex",
      flexDirection: "column",
    },
    label: {
      marginBottom: "5px",
      fontWeight: "bold",
      color: "#555",
    },
    input: {
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      fontSize: "14px",
    },
    button: {
      padding: "10px 15px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#ff6f61",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
      width: "100%",
      fontSize: "16px",
      marginTop: "10px",
    },
    message: {
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "green",
    },
    error: {
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "red",
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Update Profile</h3>

      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Full Name</label>
          <input type="text" id="name" value={formData.name} onChange={handleChange} style={styles.input} required />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input type="email" id="email" value={formData.email} onChange={handleChange} style={styles.input} required />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input type="password" id="password" value={formData.password} onChange={handleChange} style={styles.input} required />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Mobile No</label>
          <input type="number" id="mobile" value={formData.mobile} onChange={handleChange} style={styles.input} required />
        </div>

        <button type="submit" style={styles.button}>Update</button>
      </form>
    </div>
  );
}
