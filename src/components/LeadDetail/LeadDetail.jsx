import "../LeadManagement/LeadManagement.css";
import { SOURCES, STATUSES, PRIORITIES } from "../../data/leads";

// ── Helpers ─────────────────────────────────────────────────
const initials = (name) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("");

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

const STATUS_KEY = {
  "New":           "new",
  "Contacted":     "contacted",
  "Qualified":     "qualified",
  "Proposal Sent": "proposal",
  "Closed":        "closed",
};

const PRIORITY_DOT = { High: "●●●", Medium: "●●○", Low: "●○○" };

// ── Component ────────────────────────────────────────────────
export default function LeadDetail({
  lead, isEditing, editDraft,
  isSaving, saveError,
  onEdit, onCancel, onSave, onUpdateDraft,
}) {
  // When editing, read from the draft; otherwise from the real lead
  const data = isEditing ? editDraft : lead;

  return (
    <div className="lead-detail">

      {/* ── Header ── */}
      <div className="lead-detail__header">
        <div className="lead-detail__identity">
          <div className="lead-detail__avatar">{initials(lead.name)}</div>
          <div>
            <div className="lead-detail__name">{lead.name}</div>
            {/* salesAgent is a nested object { id, name } */}
            <div className="lead-detail__company">
              {lead.salesAgent?.name ?? "Unassigned"}
            </div>
          </div>
        </div>
        <span className={`detail-badge detail-badge--${STATUS_KEY[lead.status] || "new"}`}>
          {lead.status}
        </span>
      </div>

      {/* ── Fields grid ── */}
      <div className="lead-detail__fields">

        {/* salesAgent.name — nested, read-only until agents API is available */}
        <div className="lead-detail__field">
          <div className="lead-detail__label">Sales Agent</div>
          <div className="lead-detail__value">
            {data.salesAgent?.name ?? "Unassigned"}
          </div>
        </div>

        {/* source */}
        <div className="lead-detail__field">
          <div className="lead-detail__label">Lead Source</div>
          {isEditing ? (
            <select
              className="lead-detail__select"
              value={editDraft.source}
              onChange={(e) => onUpdateDraft("source", e.target.value)}
            >
              {SOURCES.map((s) => <option key={s}>{s}</option>)}
            </select>
          ) : (
            <div className="lead-detail__value">{data.source}</div>
          )}
        </div>

        {/* status */}
        <div className="lead-detail__field">
          <div className="lead-detail__label">Status</div>
          {isEditing ? (
            <select
              className="lead-detail__select"
              value={editDraft.status}
              onChange={(e) => onUpdateDraft("status", e.target.value)}
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          ) : (
            <span className={`detail-badge detail-badge--${STATUS_KEY[data.status] || "new"}`}>
              {data.status}
            </span>
          )}
        </div>

        {/* priority */}
        <div className="lead-detail__field">
          <div className="lead-detail__label">Priority</div>
          {isEditing ? (
            <select
              className="lead-detail__select"
              value={editDraft.priority}
              onChange={(e) => onUpdateDraft("priority", e.target.value)}
            >
              {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
            </select>
          ) : (
            <div className={`priority-badge priority-badge--${data.priority?.toLowerCase()}`}>
              <span>{PRIORITY_DOT[data.priority]}</span>
              {data.priority}
            </div>
          )}
        </div>

        {/* timeToClose */}
        <div className="lead-detail__field">
          <div className="lead-detail__label">Time to Close</div>
          {isEditing ? (
            <input
              type="number"
              className="lead-detail__input-sm"
              value={editDraft.timeToClose}
              min={1}
              onChange={(e) => onUpdateDraft("timeToClose", Number(e.target.value))}
            />
          ) : (
            <div className="lead-detail__value">{data.timeToClose} days</div>
          )}
        </div>

        {/* tags — array of strings */}
        <div className="lead-detail__field">
          <div className="lead-detail__label">Tags</div>
          <div className="lead-detail__tags">
            {data.tags?.length > 0
              ? data.tags.map((tag) => (
                  <span key={tag} className="detail-tag">{tag}</span>
                ))
              : <span className="lead-detail__value lead-detail__value--muted">—</span>
            }
          </div>
        </div>

        {/* createdAt — read-only timestamp from API */}
        <div className="lead-detail__field">
          <div className="lead-detail__label">Created</div>
          <div className="lead-detail__value">
            {lead.createdAt ? formatDate(lead.createdAt) : "—"}
          </div>
        </div>

        {/* updatedAt — read-only timestamp from API */}
        <div className="lead-detail__field">
          <div className="lead-detail__label">Last Updated</div>
          <div className="lead-detail__value">
            {lead.updatedAt ? formatDate(lead.updatedAt) : "—"}
          </div>
        </div>

        {/* id — read-only, useful for debugging / referencing 
        <div className="lead-detail__field">
          <div className="lead-detail__label">Lead ID</div>
          <div className="lead-detail__value lead-detail__value--mono">
            {lead.id}
          </div>
        </div>*/}

      </div>

      {/* ── Footer actions ── */}
      <div className="lead-detail__footer">
        {isEditing ? (
          <>
            {/* Inline save error */}
            {saveError && (
              <span className="lead-detail__save-error">⚠ {saveError}</span>
            )}
            <button className="btn btn--ghost" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
            <button className="btn btn--save" onClick={onSave} disabled={isSaving}>
              {isSaving ? (
                <><span className="btn__spinner" /> Saving…</>
              ) : (
                "✓ Save Changes"
              )}
            </button>
          </>
        ) : (
          <button className="btn btn--primary" onClick={onEdit}>✎ Edit Lead Details</button>
        )}
      </div>

    </div>
  );
}