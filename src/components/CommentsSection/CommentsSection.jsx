import "./CommentsSection.css";
import "../LeadManagement/LeadManagement.css";
import { useComments } from "../../hooks/useComments";

function formatDate(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
}

const initials = (name) =>
  name ? name.split(" ").map((w) => w[0]).slice(0, 2).join("") : "??";

export default function CommentsSection({ leadId }) {
  const {
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
  } = useComments(leadId);

  function handleKey(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submitComment();
  }

  // Find the selected agent's name for the avatar initials
  const selectedAgentName = agents.find((a) => a.id === selectedAgent)?.name ?? "";

  return (
    <div className="comments">

      {/* ── Header ── */}
      <div className="comments__header">
        <span className="comments__title">Comments &amp; Updates</span>
        {!isLoading && (
          <span className="comments__count">
            {comments.length} note{comments.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Comment list ── */}
      <div className="comments__list">

        {/* Loading */}
        {isLoading && (
          <div className="comments__state">
            <div className="comments__spinner" />
            Loading comments…
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="comments__state comments__state--error">
            ⚠ Failed to load comments: {error}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && comments.length === 0 && (
          <div className="comments__empty">No comments yet. Add the first update below.</div>
        )}

        {/* Rows */}
        {!isLoading && !error && comments.map((c) => {
          // API may return author as object { id, name } or as a string
          const authorName = c.author?.name ?? c.author ?? "Unknown";
          return (
            <div key={c._id ?? c.id} className="comment">
              <div className="comment__avatar">{initials(authorName)}</div>
              <div className="comment__body">
                <div className="comment__meta">
                  <span className="comment__author">{authorName}</span>
                  <span className="comment__date">
                    {formatDate(c.createdAt ?? c.date)}
                  </span>
                </div>
                {/* API field is commentText; fall back to text for local optimistic adds */}
                <div className="comment__text">{c.commentText ?? c.text}</div>
              </div>
            </div>
          );
        })}

      </div>

      {/* ── Add comment form ── */}
      <div className="comments__form">

        {/* Author selector — GET /api/agents */}
        <div className="comments__form-author">
          <label className="comments__author-label">Commenting as</label>
          {agentsLoading ? (
            <div className="comments__author-loading">Loading agents…</div>
          ) : (
            <select
              className="comments__author-select"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
            >
              {agents.length === 0 && (
                <option value="">No agents available</option>
              )}
              {agents.map((agent) => (
                // value = agent.id (sent as `author` in POST body)
                // label = agent.name (shown to user)
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Textarea + avatar row */}
        <div className="comments__form-row">
          <div className="comments__form-avatar">
            {initials(selectedAgentName)}
          </div>
          <textarea
            className="comments__textarea"
            placeholder="Add a comment or update… (Ctrl+Enter to submit)"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleKey}
            disabled={isSubmitting}
          />
        </div>

        {/* Actions row */}
        <div className="comments__form-actions">
          {submitError && (
            <span className="comments__submit-error">⚠ {submitError}</span>
          )}
          <button
            className="btn btn--primary"
            onClick={submitComment}
            disabled={!commentText.trim() || !selectedAgent || isSubmitting}
          >
            {isSubmitting ? (
              <><span className="btn__spinner" /> Submitting…</>
            ) : (
              "＋ Submit Comment"
            )}
          </button>
        </div>

      </div>

    </div>
  );
}