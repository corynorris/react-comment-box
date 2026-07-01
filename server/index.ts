import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import { closeDb } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.argv.includes("--dev");

// Parse JSON bodies
app.use(express.json());

// API routes
app.use(routes);

if (isDev) {
  // In dev, Vite handles the frontend separately
  console.log(`Server running in dev mode on http://localhost:${PORT}`);
} else {
  // In production, serve the built frontend
  const distPath = path.resolve(__dirname, "..");
  app.use(express.static(distPath));

  // SPA fallback — serve index.html for all non-API routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const server = app.listen(PORT, () => {
  if (!isDev) {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});

// Clean shutdown
process.on("SIGTERM", () => {
  closeDb();
  server.close();
});
process.on("SIGINT", () => {
  closeDb();
  server.close();
});
