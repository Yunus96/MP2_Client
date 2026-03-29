// src/hooks/useReports.js
// Fetches all leads once and derives the three chart datasets from the response.
import { useState, useEffect, useMemo } from "react";
import { leadsApi } from "../api/leads";

export function useReports() {
  const [leads, setLeads]       = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState(null);

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

  // ── Chart 1: Pipeline vs Closed (pie) ──────────────────────
  const pipelineData = useMemo(() => {
    const closed   = leads.filter((l) => l.status === "Closed").length;
    const pipeline = leads.length - closed;
    return [
      { name: "In Pipeline", value: pipeline },
      { name: "Closed",      value: closed   },
    ];
  }, [leads]);

  // ── Chart 2: Leads closed by sales agent (bar) ─────────────
  const byAgentData = useMemo(() => {
    const map = {};
    leads.forEach((l) => {
      const name = l.salesAgent?.name ?? "Unassigned";
      if (!map[name]) map[name] = { agent: name, total: 0, closed: 0 };
      map[name].total += 1;
      if (l.status === "Closed") map[name].closed += 1;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [leads]);

  // ── Chart 3: Status distribution (bar) ─────────────────────
  const statusData = useMemo(() => {
    const map = {};
    leads.forEach((l) => {
      map[l.status] = (map[l.status] || 0) + 1;
    });
    return Object.entries(map)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  return {
    leads,
    isLoading,
    error,
    pipelineData,
    byAgentData,
    statusData,
    totalLeads: leads.length,
  };
}