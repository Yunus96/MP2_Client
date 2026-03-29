// src/components/NotFound.jsx
import { useNavigate } from "react-router-dom";
import "../LeadManagement.css"; // re-use .btn

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 60, textAlign: "center", color: "var(--ink-muted)" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>404</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", marginBottom: 8 }}>
        Page not found
      </div>
      <div style={{ fontSize: 13, marginBottom: 20 }}>
        The page you're looking for doesn't exist.
      </div>
      <button className="btn btn--primary" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>
    </div>
  );
}
