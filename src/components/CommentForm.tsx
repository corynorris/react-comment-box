import { useState, type FormEvent } from "react";

interface CommentFormProps {
  onSubmit: (name: string, text: string) => Promise<void>;
  disabled: boolean;
}

export function CommentForm({ onSubmit, disabled }: CommentFormProps) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName || !trimmedText || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(trimmedName, trimmedText);
      setName("");
      setText("");
    } catch {
      // Error handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="comment-name">Name</label>
        <input
          id="comment-name"
          type="text"
          className="form-control"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled || submitting}
          maxLength={255}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="comment-text">Comment</label>
        <textarea
          id="comment-text"
          className="form-control"
          placeholder="Say something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled || submitting}
          rows={3}
          required
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={disabled || submitting || !name.trim() || !text.trim()}
      >
        {submitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
