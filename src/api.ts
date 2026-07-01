export interface Comment {
  id: number;
  name: string;
  text: string;
  created_at: string;
}

const BASE_URL = `${import.meta.env.BASE_URL}api/comments`;

export async function fetchComments(): Promise<Comment[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch comments: ${res.status}`);
  }
  return res.json();
}

export async function createComment(
  name: string,
  text: string,
): Promise<Comment> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, text }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `Failed to create comment: ${res.status}`);
  }
  return res.json();
}
