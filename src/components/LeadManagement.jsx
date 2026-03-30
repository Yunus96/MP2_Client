// src/components/LeadManagement.jsx
import { useParams, useNavigate } from "react-router-dom";
import "./LeadManagement.css";
import LeadDetail      from "./LeadDetail";
import CommentsSection from "./CommentsSection";
import SectionTitle    from "./SectionTitle";
import { useLeadDetail } from "../hooks/useLeadDetail";

export default function LeadManagement() {
  const { leadId } = useParams();  // string ID from URL e.g. "69bcd6af0817723289fc9ecd"
  const navigate   = useNavigate();

  const {
    lead,
    isLoading,
    error,
    isEditing,
    editDraft,
    isSaving,
    saveError,
    startEdit,
    cancelEdit,
    savEdit,
    updateDraft,
  } = useLeadDetail(leadId); // pass string directly — no Number() conversion

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="lead-mgmt-state">
        <div className="lead-mgmt-state__spinner" />
        <span>Loading lead…</span>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="lead-mgmt-state lead-mgmt-state--error">
        <span>⚠ {error}</span>
        <button className="btn btn--ghost" onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  /* ── Not found (API returned nothing) ── */
  if (!lead) {
    return (
      <div className="lead-mgmt-state">
        <span>Lead not found.</span>
        <button className="btn btn--ghost" onClick={() => navigate("/leads")}>← Back to Leads</button>
      </div>
    );
  }

  /* ── Loaded ── */
  return (
    <div className="lead-mgmt">

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn btn--ghost" onClick={() => navigate(-1)}>← Back</button>
        <SectionTitle>{lead.name} — Lead Details</SectionTitle>
      </div>

      <LeadDetail
        lead={lead}
        isEditing={isEditing}
        editDraft={editDraft}
        isSaving={isSaving}
        saveError={saveError}
        onEdit={startEdit}
        onCancel={cancelEdit}
        onSave={savEdit}
        onUpdateDraft={updateDraft}
      />

      {/* CommentsSection is self-contained — it fetches its own data using leadId */}
      <CommentsSection leadId={leadId} />

    </div>
  );
}