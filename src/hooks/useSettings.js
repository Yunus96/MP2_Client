// src/hooks/useSettings.js
import { useState, useEffect } from "react";
import { leadsApi }  from "../api/leads";
import { agentsApi } from "../api/agents";

export function useSettings() {
  const [leads, setLeads]       = useState([]);
  const [agents, setAgents]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState(null);

  // The item pending confirmation { type: "lead"|"agent", id, name }
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [deleteError, setDeleteError]     = useState(null);

  // ── Fetch both leads and agents in parallel ──────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        setIsLoading(true);
        setError(null);
        const [leadsData, agentsData] = await Promise.all([
          leadsApi.getAll(),
          agentsApi.getAll(),
        ]);
        if (!cancelled) {
          setLeads(leadsData);
          setAgents(agentsData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // ── Ask for confirmation before deleting ────────────────────
  function confirmDelete(type, id, name) {
    setDeleteError(null);
    setPendingDelete({ type, id, name });
  }

  function cancelDelete() {
    setPendingDelete(null);
    setDeleteError(null);
  }

  // ── Execute the delete ───────────────────────────────────────
  async function executeDelete() {
    if (!pendingDelete) return;
    const { type, id } = pendingDelete;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      if (type === "lead") {
        await leadsApi.delete(id);
        setLeads((prev) => prev.filter((l) => l.id !== id));
      } else {
        await agentsApi.delete(id);
        setAgents((prev) => prev.filter((a) => a.id !== id));
      }

      setPendingDelete(null);
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    leads,
    agents,
    isLoading,
    error,
    pendingDelete,
    isDeleting,
    deleteError,
    confirmDelete,
    cancelDelete,
    executeDelete,
  };
}