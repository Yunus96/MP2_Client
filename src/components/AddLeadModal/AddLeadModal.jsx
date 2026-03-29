// src/components/AddLeadModal.jsx
// CSS is shared from LeadList.css (imported in LeadList.jsx)
import { useState } from "react";
import { SOURCES, STATUSES, PRIORITIES } from "../../data/leads";
import { leadsApi } from "../../api/leads";
import { useAgents } from "../../hooks/useAgents";

const EMPTY = {
  name:        "",
  source:      SOURCES[0],
  salesAgent:  "",      // will hold agent ID string
  status:      "New",
  priority:    "Medium",
  timeToClose: 30,
  tags:        [],      // array of strings — server expects this shape
};

export default function AddLeadModal({ onClose, onAdd }) {
  const [form, setForm]       = useState(EMPTY);
  const [tagInput, setTagInput] = useState("");   // controlled input for adding tags
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState(null);

  // Fetch agents from GET /api/agents
  const { agents, isLoading: agentsLoading, error: agentsError } = useAgents();

  // Set salesAgent default once agents load
  // (avoids empty string being sent if user never touches the dropdown)
  const selectedAgent = form.salesAgent || agents[0]?.id || "";

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // ── Tag helpers ─────────────────────────────────────────────
  function addTag() {
    const tag = tagInput.trim();
    if (!tag || form.tags.includes(tag)) return;
    set("tags", [...form.tags, tag]);
    setTagInput("");
  }

  function removeTag(tag) {
    set("tags", form.tags.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e) {
    // Allow pressing Enter or comma to add a tag
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  }

  // ── Submit — POST /api/leads ─────────────────────────────────
  async function handleSubmit() {
    if (!form.name.trim()) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Build exact request body the server expects
      const body = {
        name:        form.name.trim(),
        source:      form.source,
        salesAgent:  selectedAgent,   // ID string e.g. "69bcd370d2de00d37df1b7b1"
        status:      form.status,
        tags:        form.tags,       // array of strings e.g. ["High Value", "Follow-up"]
        timeToClose: form.timeToClose,
        priority:    form.priority,
      };

      const created = await leadsApi.create(body);

      // Pass the server response back up so LeadList can prepend it
      onAdd(created);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">

        <div className="modal__header">
          <span className="modal__title">Add New Lead</span>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">

          {/* Name + Source */}
          <div className="modal__row">
            <div className="form-field">
              <label className="form-label">Lead Name *</label>
              <input
                className="form-input"
                placeholder="e.g. Acme Corp"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Lead Source</label>
              <select
                className="form-select"
                value={form.source}
                onChange={(e) => set("source", e.target.value)}
              >
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Sales Agent — populated from GET /api/agents */}
          <div className="modal__row">
            <div className="form-field form-field--full">
              <label className="form-label">Sales Agent</label>

              {agentsLoading && (
                <div className="form-input form-input--loading">Loading agents…</div>
              )}

              {agentsError && (
                <div className="form-input form-input--error">
                  Failed to load agents: {agentsError}
                </div>
              )}

              {!agentsLoading && !agentsError && (
                <select
                  className="form-select"
                  value={selectedAgent}
                  onChange={(e) => set("salesAgent", e.target.value)}
                >
                  {agents.map((agent) => (
                    // agent.id is sent in the POST body; agent.name is shown to user
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Status + Priority */}
          <div className="modal__row">
            <div className="form-field">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Time to Close */}
          <div className="modal__row">
            <div className="form-field">
              <label className="form-label">Time to Close (days)</label>
              <input
                className="form-input"
                type="number"
                placeholder="30"
                min={1}
                value={form.timeToClose}
                onChange={(e) => set("timeToClose", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Tags — sends as array to server */}
          <div className="modal__row">
            <div className="form-field form-field--full">
              <label className="form-label">Tags</label>

              {/* Tag pills */}
              {form.tags.length > 0 && (
                <div className="tag-list">
                  {form.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                      <button
                        className="tag-pill__remove"
                        onClick={() => removeTag(tag)}
                        type="button"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Tag input */}
              <div className="tag-input-row">
                <input
                  className="form-input"
                  placeholder="Type a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal__footer">
          {submitError && (
            <span className="modal__error">⚠ {submitError}</span>
          )}
          <button className="btn btn--ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!form.name.trim() || isSubmitting || agentsLoading}
          >
            {isSubmitting ? (
              <><span className="btn__spinner" /> Adding…</>
            ) : (
              "Add Lead"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}