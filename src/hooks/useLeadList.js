// src/hooks/useLeadList.js
import { useState, useEffect, useMemo } from "react";
import { leadsApi } from "../api/leads";
import { agentsApi } from "../api/agents";
import { useToast } from "../context/ToastContext.jsx";

const PRIORITY_RANK = { High: 3, Medium: 2, Low: 1 };

export function useLeadList() {
  const { showToast } = useToast();

  const [leads, setLeads]               = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);

  // Agents fetched directly from GET /api/agents — not derived from leads
  const [agents, setAgents]             = useState([]);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAgent, setFilterAgent]   = useState("All");
  const [sortBy, setSortBy]             = useState("none");
  const [showAddModal, setShowAddModal] = useState(false);

  // ── Fetch leads on mount ─────────────────────────────────────
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
  }, []);

  // ── Fetch ALL agents from GET /api/agents ────────────────────
  // This gives the complete agent list, not just ones assigned to leads
  useEffect(() => {
    let cancelled = false;

    async function fetchAgents() {
      try {
        const data = await agentsApi.getAll();
        if (!cancelled) setAgents(data);
      } catch {
        // Non-critical — filter just won't be populated
      }
    }

    fetchAgents();
    return () => { cancelled = true; };
  }, []);

  // availableAgents comes from the agents API, not derived from leads
  const availableAgents = agents.map((a) => a.name);

  // Agent filter compares by name (what the dropdown shows)
  const filtered = useMemo(() => {
    let result = [...leads];

    if (filterStatus !== "All")
      result = result.filter((l) => l.status === filterStatus);

    if (filterAgent !== "All")
      result = result.filter((l) => l.salesAgent?.name === filterAgent);

    if (sortBy === "priority")
      result.sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority]);

    if (sortBy === "timeToClose")
      result.sort((a, b) => a.timeToClose - b.timeToClose);

    if (sortBy === "name")
      result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [leads, filterStatus, filterAgent, sortBy]);

  const availableStatuses = useMemo(() => {
    return [...new Set(leads.map((l) => l.status))];
  }, [leads]);

  function addLead(newLead) {
    setLeads((prev) => [newLead, ...prev]);
    setShowAddModal(false);
    showToast(`"${newLead.name}" added successfully`, "success");
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