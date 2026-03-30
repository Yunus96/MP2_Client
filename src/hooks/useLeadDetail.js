// src/hooks/useLeadDetail.js
import { useState, useEffect } from "react";
import { leadsApi } from "../api/leads";

export function useLeadDetail(leadId) {
  const [lead, setLead]             = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState(null);
  const [isEditing, setIsEditing]   = useState(false);
  const [editDraft, setEditDraft]   = useState(null);
  const [isSaving, setIsSaving]     = useState(false);
  const [saveError, setSaveError]   = useState(null);

  // ── Fetch lead on mount (or when leadId changes) ────────────
  useEffect(() => {
    if (!leadId) return;
    let cancelled = false;

    async function fetchLead() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await leadsApi.getById(leadId);
        if (!cancelled) setLead(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchLead();
    return () => { cancelled = true; };
  }, [leadId]);

  // ── Edit ────────────────────────────────────────────────────
  function startEdit() {
    setSaveError(null);
    setEditDraft({ ...lead });
    setIsEditing(true);
  }

  function cancelEdit() {
    setEditDraft(null);
    setIsEditing(false);
    setSaveError(null);
  }

  function updateDraft(field, value) {
    setEditDraft((prev) => ({ ...prev, [field]: value }));
  }

  // ── Save — PUT /api/leads/:id ───────────────────────────────
  async function savEdit() {
    try {
      setIsSaving(true);
      setSaveError(null);

      // Build the exact request body the API expects.
      // salesAgent must be sent as the ID string, not the nested object.
      const body = {
        name:         editDraft.name,
        source:       editDraft.source,
        salesAgent:   editDraft.salesAgent?.id ?? editDraft.salesAgent,
        status:       editDraft.status,
        timeToClose:  editDraft.timeToClose,
        priority:     editDraft.priority,
      };

      const updated = await leadsApi.update(lead.id, body);

      // Update local state with what the server returned
      setLead(updated);
      setIsEditing(false);
      setEditDraft(null);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  // ── Comments are now handled by useComments hook in CommentsSection ──

  return {
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
  };
}