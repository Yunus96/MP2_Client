// Fetches leads from the real API on mount.
// Handles loading, error, and client-side filtering.

import { useState, useEffect, useMemo } from "react";
import { leadsApi } from "../api/leads";

export function useLeads() {
  const [leads, setLeads]       = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  // Fetch on mount — fires when LeadsSection first renders
  useEffect(() => {
    let cancelled = false; // prevent state update if component unmounts mid-fetch

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

    // Cleanup — if user navigates away before fetch completes
    return () => { cancelled = true; };
  }, []); // [] = run once on mount

  // Client-side filter applied on top of fetched data
  const filteredLeads = useMemo(() => {
    if (activeFilter === "All") return leads;
    return leads.filter((l) => l.status === activeFilter);
  }, [leads, activeFilter]);

  // Derive unique statuses from real API data for dynamic filter buttons
  const availableStatuses = useMemo(() => {
    const set = new Set(leads.map((l) => l.status));
    return ["All", ...Array.from(set)];
  }, [leads]);

  return {
    leads: filteredLeads,
    isLoading,
    error,
    activeFilter,
    setActiveFilter,
    availableStatuses,
  };
}