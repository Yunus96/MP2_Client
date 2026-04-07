// src/components/LeadCard.jsx
import "./LeadCard.css";

// Maps API status strings to CSS modifier keys
const STATUS_KEY = {
  "New":           "new",
  "Contacted":     "contacted",
  "Qualified":     "qualified",
  "Proposal Sent": "proposal",
  "Closed":        "closed",
};

const initials = (name) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("");

const PRIORITY_ICON = { High: "🔴", Medium: "🟡", Low: "🟢" };

export default function LeadCard({ lead, onClick }) {
  const key = STATUS_KEY[lead.status] || "new";

  return (
    <div className={`lead-card lead-card--${key}`} onClick={onClick}>

      {/* Header: avatar + status chip */}
      <div className="lead-card__header">
        <div className={`lead-card__avatar lead-card__avatar--${key}`}>
          {initials(lead.name)}
        </div>
        <span className={`lead-card__chip lead-card__chip--${key}`}>
          {lead.status}
        </span>
      </div>

      {/* Lead name — maps from API `name` field */}
      <div className="lead-card__name">{lead.name}</div>

      {/* Sales agent — API returns salesAgent.name (nested object) */}
      <div className="lead-card__company">
        {lead.salesAgent?.name ?? "Unassigned"}
      </div>

      {/* Source + priority */}
      <div className="lead-card__contact">
        <div>📥 {lead.source}</div>
        <div>{PRIORITY_ICON[lead.priority]} {lead.priority} priority</div>
      </div>

      {/* Tags */}
      {lead.tags?.length > 0 && (
        <div className="lead-card__tags">
          {lead.tags.map((tag) => (
            <span key={tag} className="lead-card__tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Footer: time to close — API field is `timeToClose` (days) */}
      <div className="lead-card__value-row">
        <span className="lead-card__value">
          🕐 {lead.timeToClose}d to close
        </span>
        <div className="lead-card__progress-track">
          <div
            className={`lead-card__progress-fill lead-card__progress-fill--${key}`}
            style={{ width: `${Math.min(100, (30 / (lead.timeToClose || 30)) * 100)}%` }}
          />
        </div>
      </div>

    </div>
  );
}