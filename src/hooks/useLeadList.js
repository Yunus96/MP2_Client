// src/hooks/useLeadList.js
import { useState, useEffect, useMemo } from "react";
import { leadsApi } from "../api/leads";

const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 };

export function useLeadList() {
  const [leads, setLeads]               = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAgent, setFilterAgent]   = useState("All");
  const [sortBy, setSortBy]             = useState("none");
  const [showAddModal, setShowAddModal] = useState(false);

  // ── Fetch all leads on mount ─────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchLeads() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await leadsApi.getAll();

        if (!cancelled) setLeads(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchLeads();
    return () => { cancelled = true; };
  }, []); // [] = run once when LeadList mounts

  // ── Derive unique agent names from real API data ─────────────
  const availableAgents = useMemo(() => {
    const names = leads.map((l) => l.salesAgent?.name).filter(Boolean);
    return [...new Set(names)];
  }, [leads]);

  // ── Derive unique statuses from real API data ────────────────
  const availableStatuses = useMemo(() => {
    return [...new Set(leads.map((l) => l.status))];
  }, [leads]);

  // ── Filter + sort (client-side, on top of fetched data) ──────
  const filtered = useMemo(() => {
    let result = [...leads];

    if (filterStatus !== "All")
      result = result.filter((l) => l.status === filterStatus);

    // Agent filter uses salesAgent.name (nested object from API)
    if (filterAgent !== "All")
      result = result.filter((l) => l.salesAgent?.name === filterAgent);

    if (sortBy === "priority")
      result.sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]);

    // timeToClose is the API field (was daysToClose in mock data)
    if (sortBy === "timeToClose")
      result.sort((a, b) => a.timeToClose - b.timeToClose);

    if (sortBy === "name")
      result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [leads, filterStatus, filterAgent, sortBy]);

  function addLead(newLead) {
    // Optimistically prepend — real apps would POST then invalidate
    setLeads((prev) => [newLead, ...prev]);
    setShowAddModal(false);
  }

  return {
    leads: filtered,
    totalCount: leads.length,
    isLoading,
    error,
    availableAgents,
    availableStatuses,
    filterStatus, setFilterStatus,
    filterAgent,  setFilterAgent,
    sortBy,       setSortBy,
    showAddModal, setShowAddModal,
    addLead,
  };
}