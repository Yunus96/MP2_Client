// src/components/StatusPanel.jsx
import "./StatusPanel.css";
import SectionTitle from "./SectionTitle";
import { STATUS_SUMMARY } from "../data/leads";

const STATUS_META = {
  New:       { icon: "🔥", key: "new"       },
  Contacted: { icon: "📞", key: "contacted" },
  Qualified: { icon: "✅", key: "qualified" },
};

export default function StatusPanel() {
  return (
    <section>
      <SectionTitle>Lead Status</SectionTitle>

      <div className="status-panel__grid">
        {STATUS_SUMMARY.map((s) => {
          const meta = STATUS_META[s.status];
          return (
            <div key={s.status} className="status-card">
              <div className={`status-card__icon-wrap status-card__icon-wrap--${meta.key}`}>
                {meta.icon}
              </div>
              <div>
                <div className="status-card__count">{s.count}</div>
                <div className="status-card__label">{s.status}</div>
              </div>
              <div className={`status-card__trend status-card__trend--${s.up ? "up" : "down"}`}>
                {s.up ? "↑" : "↓"} {s.trend}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
