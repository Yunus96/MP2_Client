// src/components/CommentsSection.jsx
import "./CommentsSection.css";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    + " · "
    + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function CommentsSection({ comments, commentText, onTextChange, onSubmit }) {
  function handleKey(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onSubmit();
  }

  return (
    <div className="comments">

      {/* Header */}
      <div className="comments__header">
        <span className="comments__title">Comments &amp; Updates</span>
        <span className="comments__count">{comments.length} note{comments.length !== 1 ? "s" : ""}</span>
      </div>

      {/* List */}
      <div className="comments__list">
        {comments.length === 0 ? (
          <div className="comments__empty">No comments yet. Add the first update below.</div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment">
              <div className="comment__avatar">{c.avatar}</div>
              <div className="comment__body">
                <div className="comment__meta">
                  <span className="comment__author">{c.author}</span>
                  <span className="comment__date">{formatDate(c.date)}</span>
                </div>
                <div className="comment__text">{c.text}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add comment form */}
      <div className="comments__form">
        <div className="comments__form-row">
          <div className="comments__form-avatar">RK</div>
          <textarea
            className="comments__textarea"
            placeholder="Add a comment or update… (Ctrl+Enter to submit)"
            value={commentText}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={handleKey}
          />
        </div>
        <div className="comments__form-actions">
          <button
            className="btn btn--primary"
            onClick={onSubmit}
            disabled={!commentText.trim()}
          >
            ＋ Submit Comment
          </button>
        </div>
      </div>

    </div>
  );
}
