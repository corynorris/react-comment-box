import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DATA_DIR = process.env.COMMENT_DATA_DIR ?? path.resolve(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "comments.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    migrate(db);
  }
  return db;
}

function migrate(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export function closeDb(): void {
  if (db) {
    db.close();
  }
}
