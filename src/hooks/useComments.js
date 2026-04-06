import { useState, useEffect } from "react";
import { leadsApi } from "../api/leads";
import { agentsApi } from "../api/agents";
import { useToast }  from "../context/ToastContext";

export function useComments(leadId) {
  const { showToast } = useToast();
  const [comments, setComments]       = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState(null);

  const [agents, setAgents]           = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(""); // agent ID string
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitError, setSubmitError]     = useState(null);

  // ── Fetch comments on mount ──────────────────────────────────
  useEffect(() => {
    if (!leadId) return;
    let cancelled = false;

    async function fetchComments() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await leadsApi.getComments(leadId);
        if (!cancelled) setComments(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchComments();
    return () => { cancelled = true; };
  }, [leadId]);

  // ── Fetch agents for the author dropdown ────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchAgents() {
      try {
        setAgentsLoading(true);
        const data = await agentsApi.getAll();
        if (!cancelled) {
          setAgents(data);
          // Default to first agent once loaded
          if (data.length > 0) setSelectedAgent(data[0].id);
        }
      } catch {
        // Non-critical — just leave dropdown empty
      } finally {
        if (!cancelled) setAgentsLoading(false);
      }
    }

    fetchAgents();
    return () => { cancelled = true; };
  }, []);

  // ── Submit comment — POST /leads/:leadId/comments ───────────
  async function submitComment() {
    const text = commentText.trim();
    if (!text || !selectedAgent) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Exact body shape the server expects
      const body = {
        commentText: text,
        author:      selectedAgent, // agent ID string e.g. "69bcd370d2de00d37df1b7b1"
      };

      const newComment = await leadsApi.addComment(leadId, body);

      // Append server response to local list
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
      showToast("Comment submitted successfully", "success");
    } catch (err) {
      setSubmitError(err.message);
      showToast("Error submitting comment", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    comments,
    isLoading,
    error,
    agents,
    agentsLoading,
    selectedAgent,
    setSelectedAgent,
    commentText,
    setCommentText,
    isSubmitting,
    submitError,
    submitComment,
  };
}