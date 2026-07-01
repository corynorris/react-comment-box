import type { Comment as CommentType } from "../api";
import { Comment } from "./Comment";

interface CommentListProps {
  comments: CommentType[];
  loading: boolean;
  error: string | null;
}

export function CommentList({ comments, loading, error }: CommentListProps) {
  if (loading && comments.length === 0) {
    return <div className="comment-list__status">Loading comments...</div>;
  }

  if (error) {
    return (
      <div className="comment-list__status comment-list__error">{error}</div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="comment-list__status">No comments yet. Be the first!</div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
}
