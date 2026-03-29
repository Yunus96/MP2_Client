// src/components/LeadList.jsx
import "./LeadList.css";
import "../LeadManagement.css";
import { useNavigate } from "react-router-dom";
import SectionTitle from "../SectionTitle";
import AddLeadModal from "../AddLeadModal/AddLeadModal";
import { useLeadList } from "../../hooks/useLeadList";
import { STATUSES } from "../../data/leads";

const STATUS_KEY   = {
  "New": "new", "Contacted": "contacted", "Qualified": "qualified",
  "Proposal Sent": "proposal", "Closed": "closed",
};
const PRIORITY_KEY = { High: "high", Medium: "medium", Low: "low" };

const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("");

function DaysChip({ days }) {
  const cls = days <= 15 ? "days-chip--urgent" : days <= 30 ? "days-chip--soon" : "";
  return <span className={`days-chip ${cls}`}>{days}d</span>;
}

export default function LeadList() {
  const navigate = useNavigate();
  const {
    leads, totalCount,
    isLoading, error,
    availableAgents,
    filterStatus, setFilterStatus,
    filterAgent,  setFilterAgent,
    sortBy,       setSortBy,
    showAddModal, setShowAddModal,
    addLead,
  } = useLeadList();

  function toggleSort(key) {
    setSortBy((prev) => (prev === key ? "none" : key));
  }

  // Count per status from currently filtered leads
  const statusCounts = {};
  leads.forEach((l) => {
    statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
  });

  return (
    <div className="lead-list">

      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <SectionTitle>Lead List</SectionTitle>
        {!isLoading && (
          <span style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 12 }}>
            {leads.length} of {totalCount} leads
          </span>
        )}
      </div>

      {/* Status summary pills — built from real API data */}
      <div className="lead-list__stats">
        {Object.entries({ New: "new", Contacted: "contacted", "Proposal Sent": "proposal", Qualified: "qualified", Closed: "closed" }).map(([label, key]) => (
          <span key={label} className="stats__pill">
            <span className={`stats__dot stats__dot--${key}`} />
            {statusCounts[label] ?? 0} {label}
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="lead-list__toolbar">

        {/* Filter: Status */}
        <div className="toolbar__group">
          <span className="toolbar__label">Status</span>
          <select
            className="toolbar__select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Filter: Agent — built from real API data (salesAgent.name) */}
        <div className="toolbar__group">
          <span className="toolbar__label">Agent</span>
          <select
            className="toolbar__select"
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
          >
            <option value="All">All Agents</option>
            {availableAgents.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>

        <div className="toolbar__divider" />

        {/* Sort */}
        <div className="toolbar__group">
          <span className="toolbar__label">Sort</span>
          {[
            { key: "priority",    label: "Priority"      },
            { key: "timeToClose", label: "Days to Close" }, // API field is timeToClose
            { key: "name",        label: "Name"          },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`sort-btn ${sortBy === key ? "sort-btn--active" : ""}`}
              onClick={() => toggleSort(key)}
            >
              <span className="sort-btn__icon">↕</span> {label}
            </button>
          ))}
        </div>

        <div className="toolbar__spacer" />
        <button className="btn btn--primary" onClick={() => setShowAddModal(true)}>
          + Add New Lead
        </button>
      </div>

      {/* Table */}
      <div className="lead-table">
        <div className="lead-table__head">
          <div className="lead-table__th">Lead</div>
          <div className="lead-table__th">Status</div>
          <div className="lead-table__th">Agent</div>
          <div className="lead-table__th">Priority</div>
          <div className="lead-table__th">Source</div>
          <div className="lead-table__th">Close</div>
        </div>

        <div className="lead-table__body">

          {/* Loading state */}
          {isLoading && (
            <div className="lead-table__state">
              <div className="lead-table__spinner" />
              Loading leads…
            </div>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <div className="lead-table__state lead-table__state--error">
              ⚠ Failed to load leads: {error}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && leads.length === 0 && (
            <div className="lead-table__empty">No leads match your filters.</div>
          )}

          {/* Rows */}
          {!isLoading && !error && leads.map((lead) => {
            const sk = STATUS_KEY[lead.status]     || "new";
            const pk = PRIORITY_KEY[lead.priority] || "low";
            return (
              <div
                key={lead.id}
                className="lead-row"
                onClick={() => navigate(`/leads/${lead.id}`)}
              >
                {/* Lead name — API: lead.name */}
                <div className="lead-row__identity">
                  <div className={`lead-row__avatar lead-row__avatar--${sk}`}>
                    {initials(lead.name)}
                  </div>
                  <div>
                    <div className="lead-row__name">{lead.name}</div>
                    {/* API has no company field — show source instead */}
                    <div className="lead-row__company">{lead.source}</div>
                  </div>
                </div>

                {/* Status — API: lead.status */}
                <div>
                  <span className={`row-badge row-badge--${sk}`}>{lead.status}</span>
                </div>

                {/* Agent — API: lead.salesAgent.name (nested object) */}
                <div className="lead-row__cell">
                  {lead.salesAgent?.name ?? "—"}
                </div>

                {/* Priority — API: lead.priority */}
                <div className={`priority-text--${pk}`}>{lead.priority}</div>

                {/* Source — API: lead.source */}
                <div className="lead-row__cell">{lead.source}</div>

                {/* Time to close — API: lead.timeToClose (was daysToClose in mock) */}
                <div className="lead-row__action">
                  <DaysChip days={lead.timeToClose} />
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {showAddModal && (
        <AddLeadModal onClose={() => setShowAddModal(false)} onAdd={addLead} />
      )}
    </div>
  );
}