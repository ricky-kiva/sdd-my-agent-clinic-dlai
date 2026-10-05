import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { runMigrations } from './migrations';

let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (dbInstance) {
    return dbInstance;
  }

  const dbDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, 'clinic.db');
  const db = new Database(dbPath, { timeout: 10000 });

  // Enable WAL mode and foreign key constraints
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 10000');

  // Run structured migrations (schema creation, column migrations, junction tables)
  runMigrations(db);

  dbInstance = db;
  return dbInstance;
}

export const db = getDb;
