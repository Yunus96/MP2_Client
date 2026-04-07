// src/components/LeadsSection.jsx
import "./LeadsSection.css";
import { useNavigate } from "react-router-dom";
import LeadCard     from "../LeadCard/LeadCard";
import SectionTitle from "../SectionTitle/SectionTitle";
import { useLeads } from "../../hooks/useLeads";

export default function LeadsSection() {
  const navigate = useNavigate();
  const {
    leads,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    availableStatuses,
  } = useLeads();

  return (
    <div className="leads-section">

      {/* Lead Cards */}
      <section>
        <SectionTitle>Recent Leads</SectionTitle>

        {/* Loading state */}
        {isLoading && (
          <div className="leads-section__state">
            <div className="leads-section__spinner" />
            <span>Loading leads…</span>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="leads-section__state leads-section__state--error">
            <span>⚠ Failed to load leads: {error}</span>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && leads.length === 0 && (
          <div className="leads-section__empty">
            No leads found for "{activeFilter}"
          </div>
        )}

        {/* Lead cards grid */}
        {!isLoading && !error && leads.length > 0 && (
          <div className="leads-section__grid">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => navigate(`/leads/${lead.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick Filters — built from real API statuses */}
      <section>
        <SectionTitle>Quick Filters</SectionTitle>
        <div className="filters-row">
          <span className="filters-row__label">Filter:</span>

          {availableStatuses.map((f) => (
            <button
              key={f}
              className={`filter-btn ${activeFilter === f ? "filter-btn--active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}

          <div className="filters-row__spacer" />

          <button className="add-lead-btn" onClick={() => navigate("/leads")}>
            + Add New Lead
          </button>
        </div>
      </section>

    </div>
  );
}