import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

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
  const db = new Database(dbPath);

  // Enable WAL mode and foreign key constraints
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Initialize schema if not present
  const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  }

  // Ensure therapies table has methodology column
  try {
    const tableInfo = db.pragma('table_info(therapies)') as { name: string }[];
    if (tableInfo.length > 0 && !tableInfo.some((col) => col.name === 'methodology')) {
      db.exec(`ALTER TABLE therapies ADD COLUMN methodology TEXT NOT NULL DEFAULT '{}'`);
    }
  } catch (err) {
    console.error('Error ensuring therapies methodology column:', err);
  }

  dbInstance = db;
  return dbInstance;
}

export const db = getDb;
