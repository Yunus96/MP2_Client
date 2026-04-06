// src/components/AddAgentModal.jsx
// CSS imported via AgentList.css (loaded in AgentList.jsx)
import { useState } from "react";
import { agentsApi } from "../../api/agents";
import { useToast }  from "../../context/ToastContext";


const EMPTY = { name: "", email: "" };

export default function AddAgentModal({ onClose, onAdd }) {
  const { showToast } = useToast();
  const [form, setForm]               = useState(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState(null);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.email.trim()) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const body = {
        name:  form.name.trim(),
        email: form.email.trim(),
      };

      const created = await agentsApi.create(body);
      onAdd(created);
      showToast(`Agent added successfully`, "success");
    } catch (err) {
      setSubmitError(err.message);
      showToast(`Failed to add agent`, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isValid = form.name.trim() && form.email.trim();

  return (
    <div
      className="agent-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="agent-modal">

        <div className="agent-modal__header">
          <span className="agent-modal__title">Add New Agent</span>
          <button className="agent-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="agent-modal__body">
          <div className="form-field">
            <label className="form-label">Full Name *</label>
            <input
              className="form-input"
              placeholder="e.g. Arjun Patel"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Email *</label>
            <input
              className="form-input"
              type="email"
              placeholder="e.g. arjun@company.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
        </div>

        <div className="agent-modal__footer">
          {submitError && (
            <span className="agent-modal__error">⚠ {submitError}</span>
          )}
          <button
            className="btn btn--ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting
              ? <><span className="btn__spinner" /> Adding…</>
              : "Add Agent"
            }
          </button>
        </div>

      </div>
    </div>
  );
}