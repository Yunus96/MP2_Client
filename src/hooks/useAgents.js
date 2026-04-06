// src/hooks/useAgents.js
import { useState, useEffect } from "react";
import { agentsApi } from "../api/agents";
import { useToast }  from "../context/ToastContext";

export function useAgents() {
  const { showToast } = useToast();
  const [agents, setAgents]       = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

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

  // Called by AddAgentModal after successful POST
  function addAgent(newAgent) {
    setAgents((prev) => [newAgent, ...prev]);
    setShowAddModal(false);
    showToast("Agent added successfully", "success");
  }

  return { agents, isLoading, error, showAddModal, setShowAddModal, addAgent };
}