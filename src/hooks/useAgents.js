// src/hooks/useAgents.js
import { useState, useEffect } from "react";
import { agentsApi } from "../api/agents";

export function useAgents() {
  const [agents, setAgents]       = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAgents() {
      try {
        setIsLoading(true);
        const data = await agentsApi.getAll();
        if (!cancelled) setAgents(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAgents();
    return () => { cancelled = true; };
  }, []);

  return { agents, isLoading, error };
}