import { useState, useEffect } from "react";
import { fetchComments, createComment, type Comment } from "./api";
import { CommentList } from "./components/CommentList";
import { CommentForm } from "./components/CommentForm";

const POLL_INTERVAL = 3000;

export default function App() {
	const [comments, setComments] = useState<Comment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Initial load + polling
	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				const data = await fetchComments();
				if (!cancelled) {
					setComments(data);
					setError(null);
				}
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : "Failed to load comments",
					);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		load();
		const interval = setInterval(load, POLL_INTERVAL);
		return () => {
			cancelled = true;
			clearInterval(interval);
		};
	}, []);

	const handleSubmit = async (name: string, text: string) => {
		// Optimistic update
		const optimisticId = -Date.now();
		const optimistic: Comment = {
			id: optimisticId,
			name,
			text,
			created_at: new Date().toISOString(),
		};
		setComments((prev) => [optimistic, ...prev]);

		try {
			const saved = await createComment(name, text);
			// Replace optimistic with real
			setComments((prev) =>
				prev.map((c) => (c.id === optimisticId ? saved : c)),
			);
		} catch (err) {
			// Revert on failure
			setComments((prev) => prev.filter((c) => c.id !== optimisticId));
			throw err;
		}
	};

	return (
		<div className="comment-box">
			<h1>Comments</h1>
			<CommentList comments={comments} loading={loading} error={error} />
			<CommentForm onSubmit={handleSubmit} disabled={loading} />
		</div>
	);
}
