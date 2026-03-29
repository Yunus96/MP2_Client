// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Header         from "./components/Header";
import Sidebar        from "./components/Sidebar";
import LeadsSection   from "./components/LeadsSection";
import StatusPanel    from "./components/StatusPanel";
import LeadManagement from "./components/LeadManagement";
import LeadList       from "./components/LeadList/LeadList";
import NotFound       from "./components/NotFound/NotFound";
import AgentList      from "./components/AgentList/AgentList";

function Placeholder({ label }) {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "var(--ink-muted)", fontSize: 13 }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
      <strong>{label}</strong> — coming soon.
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <Header />

      <div className="app__body">
        <Sidebar />

        <main className="app__main">
          <Routes>
            {/* Default → dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <>
                  <LeadsSection />
                  <StatusPanel />
                </>
              }
            />

            {/* Lead list */}
            <Route path="/leads" element={<LeadList />} />

            {/* Lead detail — id from URL */}
            <Route path="/leads/:leadId" element={<LeadManagement />} />

            {/* Other nav stubs */}
            <Route path="/sales"    element={<Placeholder label="Sales" />} />
            <Route path="/agents"   element={<AgentList />} />
            <Route path="/reports"  element={<Placeholder label="Reports" />} />
            <Route path="/settings" element={<Placeholder label="Settings" />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
