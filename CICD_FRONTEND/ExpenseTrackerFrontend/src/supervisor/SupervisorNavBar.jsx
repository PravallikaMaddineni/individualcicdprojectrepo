import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contextapi/AuthContext";
import SupervisorDashboard from "./SupervisorDashboard";
import SendRequest from "./SendRequest";
import ViewSentRequests from "./ViewSentRequests";
import ViewApprovedRequests from "./ViewApprovedRequests";
import SupervisorLogin from "./SupervisorLogin";
import SupervisorRegistration from "./SupervisorRegistration";
import "./SupervisorDashBoard.css";

export default function SupervisorNavBar() {
  const { setIsSupervisorLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsSupervisorLoggedIn(false);
    // clear both storages so nothing lingers
    localStorage.removeItem("supervisor");
    localStorage.removeItem("supervisorId");
    sessionStorage.removeItem("supervisor");
    sessionStorage.removeItem("supervisorId");
    navigate("/supervisorlogin");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">Supervisor Panel</div>
        <ul className="nav-links">
          <li><Link to="/supervisor/dashboard">Dashboard</Link></li>
          <li className="dropdown">
            <span>Requests ▾</span>
            <ul className="dropdown-menu">
              <li><Link to="/supervisor/sendrequest">Send Request</Link></li>
              <li><Link to="/supervisor/viewsentrequests">View Sent Requests</Link></li>
              <li><Link to="/supervisor/viewapprovedrequests">View Approved Requests</Link></li>
            </ul>
          </li>
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />
        <Route path="/supervisor/sendrequest" element={<SendRequest />} />
        <Route path="/supervisor/viewsentrequests" element={<ViewSentRequests />} />
        <Route path="/supervisor/viewapprovedrequests" element={<ViewApprovedRequests />} />
        <Route path="/supervisorlogin" element={<SupervisorLogin />} />
        <Route path="/supervisorregister" element={<SupervisorRegistration />} />
      </Routes>
    </div>
  );
}
