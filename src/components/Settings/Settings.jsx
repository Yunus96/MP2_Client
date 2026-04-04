// src/components/Settings.jsx
import "./Settings.css";
import "../LeadManagement.css"; // re-use .btn, .btn__spinner
import SectionTitle from "../SectionTitle";
import { useSettings } from "../../hooks/useSettings";

// ── Helpers ──────────────────────────────────────────────────
const initials = (name) =>
  name?.split(" ").map((w) => w[0]).slice(0, 2).join("") ?? "?";

const STATUS_KEY = {
  "New": "new", "Contacted": "contacted", "Qualified": "qualified",
  "Proposal Sent": "proposal", "Closed": "closed",
};

// ── Confirm delete modal ─────────────────────────────────────
function ConfirmModal({ pending, isDeleting, deleteError, onConfirm, onCancel }) {
  const typeLabel = pending.type === "lead" ? "lead" : "agent";

  return (
    <div className="confirm-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="confirm-modal">

        <div className="confirm-modal__header">
          <div className="confirm-modal__icon">🗑</div>
          <span className="confirm-modal__title">Delete {typeLabel}</span>
        </div>

        <div className="confirm-modal__body">
          Are you sure you want to delete{" "}
          <span className="confirm-modal__name">"{pending.name}"</span>?
          <div className="confirm-modal__warning">
            ⚠ This action cannot be undone.
          </div>
        </div>

        <div className="confirm-modal__footer">
          {deleteError && (
            <span className="confirm-modal__error">⚠ {deleteError}</span>
          )}
          <button className="btn btn--ghost" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting
              ? <><span className="btn__spinner" /> Deleting…</>
              : `Delete ${typeLabel}`
            }
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────
export default function Settings() {
  const {
    leads, agents,
    isLoading, error,
    pendingDelete,
    isDeleting,
    deleteError,
    confirmDelete,
    cancelDelete,
    executeDelete,
  } = useSettings();

  return (
    <div className="settings">
      <SectionTitle>Settings</SectionTitle>

      {/* Loading */}
      {isLoading && (
        <div className="settings__state">
          <div className="settings__spinner" />
          Loading data…
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="settings__state settings__state--error">
          ⚠ Failed to load: {error}
        </div>
      )}

      {!isLoading && !error && (
        <>

          {/* ── Delete Leads ── */}
          <div className="settings-section">
            <div className="settings-section__header">
              <span className="settings-section__title">Manage Leads</span>
              <span className="settings-section__count">
                {leads.length} lead{leads.length !== 1 ? "s" : ""}
              </span>
            </div>

            {leads.length === 0 ? (
              <div className="settings__state">No leads found.</div>
            ) : (
              leads.map((lead) => {
                const sk = STATUS_KEY[lead.status] || "new";
                return (
                  <div key={lead.id} className="settings-row">
                    <div className="settings-row__avatar settings-row__avatar--lead">
                      {initials(lead.name)}
                    </div>
                    <div className="settings-row__info">
                      <div className="settings-row__name">{lead.name}</div>
                      <div className="settings-row__sub">
                        {lead.salesAgent?.name ?? "Unassigned"} · {lead.source}
                      </div>
                    </div>
                    {/*<span className={`settings-row__badge settings-row__badge--${sk}`}>
                      {lead.status}
                    </span>*/}
                    <button
                      className="settings-row__delete"
                      onClick={() => confirmDelete("lead", lead.id, lead.name)}
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Delete Agents ── */}
          <div className="settings-section">
            <div className="settings-section__header">
              <span className="settings-section__title">Manage Agents</span>
              <span className="settings-section__count">
                {agents.length} agent{agents.length !== 1 ? "s" : ""}
              </span>
            </div>

            {agents.length === 0 ? (
              <div className="settings__state">No agents found.</div>
            ) : (
              agents.map((agent) => (
                <div key={agent.id} className="settings-row">
                  <div className="settings-row__avatar settings-row__avatar--agent">
                    {initials(agent.name)}
                  </div>
                  <div className="settings-row__info">
                    <div className="settings-row__name">{agent.name}</div>
                    <div className="settings-row__sub">{agent.email ?? "—"}</div>
                  </div>
                  <button
                    className="settings-row__delete"
                    onClick={() => confirmDelete("agent", agent.id, agent.name)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

        </>
      )}

      {/* Confirm delete modal */}
      {pendingDelete && (
        <ConfirmModal
          pending={pendingDelete}
          isDeleting={isDeleting}
          deleteError={deleteError}
          onConfirm={executeDelete}
          onCancel={cancelDelete}
        />
      )}

    </div>
  );
}