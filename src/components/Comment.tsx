import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { Comment as CommentType } from "../api";

function renderMarkdown(text: string): string {
  const raw = marked.parse(text, { async: false }) as string;
  return DOMPurify.sanitize(raw);
}

export function Comment({ name, text }: CommentType) {
  const html = useMemo(() => renderMarkdown(text), [text]);

  return (
    <div className="comment">
      <h2 className="comment-author">{name}</h2>
      <div
        className="comment-text"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
