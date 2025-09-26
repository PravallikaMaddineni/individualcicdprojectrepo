export default function AdminDashboard() {
  const styles = {
    dashboard: {
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
      minHeight: '100vh',
      padding: '50px 20px',
    },
    title: {
      fontSize: '2.5rem',
      marginBottom: '50px',
      color: '#ff4b5c',
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '25px',
      maxWidth: '1000px',
      margin: '0 auto',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '30px',
      borderRadius: '20px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
    },
    cardTitle: {
      fontSize: '1.6rem',
      marginBottom: '15px',
      color: '#ff7f50',
    },
    cardText: {
      fontSize: '1rem',
      color: '#555',
    },
  };

  const handleHover = (e, hover) => {
    if (hover) {
      e.currentTarget.style.transform = 'translateY(-10px)';
      e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.2)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
    }
  };

  return (
    <div style={styles.dashboard}>
      <h1 style={styles.title}>🌸 Welcome to Admin Dashboard 🌸</h1>
      <div style={styles.cardContainer}>
        {[
          { title: 'Users', text: 'Manage all the amazing users here!', emoji: '👩‍💻' },
          { title: 'Supervisors', text: 'Keep track of all your supervisors!', emoji: '🧑‍🏫' },
          { title: 'Requests', text: 'Check pending requests here!', emoji: '📬' },
          { title: 'Settings', text: 'Customize your dashboard settings!', emoji: '⚙️' },
        ].map((card, idx) => (
          <div
            key={idx}
            style={styles.card}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            <h2 style={styles.cardTitle}>{card.emoji} {card.title}</h2>
            <p style={styles.cardText}>{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
