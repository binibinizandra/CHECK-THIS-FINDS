"use client";
import { useState, useTransition } from "react";
import { postComment, removeComment } from "@/lib/comments/actions";
import type { CommentRecord } from "@/lib/comments/store";

const URL_RE = /(https?:\/\/[^\s]+)/g;

function renderWithLinks(text: string) {
  return text.split(URL_RE).map((part, i) =>
    URL_RE.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="pd-comment-link">
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function ProductComments({
  productId,
  initialComments,
  isAdmin,
}: {
  productId: string;
  initialComments: CommentRecord[];
  isAdmin: boolean;
}) {
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handlePost() {
    if (!draft.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await postComment(productId, draft);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setComments((prev) => [...prev, result.comment]);
      setDraft("");
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await removeComment(id, productId);
      setComments((prev) => prev.filter((c) => c.id !== id));
    });
  }

  return (
    <section className="pd-comments">
      <div className="pd-col-title">Notes &amp; links</div>

      {comments.length === 0 && <div className="pd-comment-empty">No notes yet.</div>}

      <div className="pd-comment-list">
        {comments.map((c) => (
          <div className="pd-comment-item" key={c.id}>
            <div className="pd-comment-body">{renderWithLinks(c.body)}</div>
            {isAdmin && (
              <button type="button" className="pd-comment-delete" onClick={() => handleDelete(c.id)} disabled={pending}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <div className="pd-comment-form">
          <textarea
            className="pd-comment-input"
            rows={2}
            placeholder="Paste a TikTok link or note here..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="button" className="pd-btn-store pd-comment-submit" onClick={handlePost} disabled={pending || !draft.trim()}>
            {pending ? "Posting..." : "Post"}
          </button>
          {error && <div className="pd-comment-error">{error}</div>}
        </div>
      )}
    </section>
  );
}
