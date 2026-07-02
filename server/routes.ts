import { Router, Request, Response } from "express";
import { getPool } from "./db.js";

const router = Router();

interface Comment {
	id: number;
	name: string;
	text: string;
	created_at: string;
}

// GET /api/comments — return all comments, newest first
router.get("/api/comments", async (_req: Request, res: Response) => {
	try {
		const pool = getPool();
		const result = await pool.query<Comment>(
			"SELECT id, name, text, created_at FROM comments ORDER BY created_at DESC",
		);
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching comments:", err);
		res.status(500).json({ error: "Failed to fetch comments" });
	}
});

// POST /api/comments — validate and save a new comment
router.post("/api/comments", async (req: Request, res: Response) => {
	try {
		const { name, text } = req.body;

		// Validate
		if (!name || typeof name !== "string" || name.trim().length === 0) {
			return res.status(400).json({ error: "Name is required" });
		}
		if (name.trim().length > 255) {
			return res
				.status(400)
				.json({ error: "Name must be 255 characters or less" });
		}
		if (!text || typeof text !== "string" || text.trim().length === 0) {
			return res.status(400).json({ error: "Comment text is required" });
		}

		const pool = getPool();
		const result = await pool.query<Comment>(
			"INSERT INTO comments (name, text) VALUES ($1, $2) RETURNING id, name, text, created_at",
			[name.trim(), text.trim()],
		);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Error creating comment:", err);
		res.status(500).json({ error: "Failed to create comment" });
	}
});

export default router;
