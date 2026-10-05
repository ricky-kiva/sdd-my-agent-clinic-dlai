import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export interface Migration {
  id: string;
  run: (db: Database.Database) => void;
}

export const migrations: Migration[] = [
  {
    id: '001_initial_schema',
    run: (db: Database.Database) => {
      const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schemaSql);
      }
    },
  },
  {
    id: '002_therapy_methodology',
    run: (db: Database.Database) => {
      const tableInfo = db.pragma('table_info(therapies)') as { name: string }[];
      if (tableInfo.length > 0 && !tableInfo.some((col) => col.name === 'methodology')) {
        db.exec(`ALTER TABLE therapies ADD COLUMN methodology TEXT NOT NULL DEFAULT '{}'`);
      }
    },
  },
  {
    id: '003_therapy_target_ailments_relational',
    run: (db: Database.Database) => {
      // 1. Create relational junction table with foreign keys
      db.exec(`
        CREATE TABLE IF NOT EXISTS therapy_target_ailments (
          therapy_id TEXT NOT NULL REFERENCES therapies(id) ON DELETE CASCADE,
          ailment_id TEXT NOT NULL REFERENCES ailments(id) ON DELETE CASCADE,
          PRIMARY KEY (therapy_id, ailment_id)
        );
        CREATE INDEX IF NOT EXISTS idx_therapy_target_ailments_ailment_id ON therapy_target_ailments(ailment_id);
        CREATE INDEX IF NOT EXISTS idx_therapy_target_ailments_therapy_id ON therapy_target_ailments(therapy_id);
      `);

      // 2. Backfill relational table from existing JSON target_ailment_ids where both therapy and ailment exist
      try {
        const therapies = db.prepare('SELECT id, target_ailment_ids FROM therapies').all() as {
          id: string;
          target_ailment_ids: string;
        }[];

        const insertJunction = db.prepare(`
          INSERT OR IGNORE INTO therapy_target_ailments (therapy_id, ailment_id)
          SELECT ?, ?
          WHERE EXISTS (SELECT 1 FROM ailments WHERE id = ?)
        `);

        for (const t of therapies) {
          try {
            const ids = JSON.parse(t.target_ailment_ids);
            if (Array.isArray(ids)) {
              for (const ailmentId of ids) {
                insertJunction.run(t.id, ailmentId, ailmentId);
              }
            }
          } catch {
            // Ignore malformed JSON during backfill
          }
        }
      } catch {
        // Table might not exist or be empty yet
      }
    },
  },
];

/**
 * Executes all pending database migrations in a serialized transaction.
 */
export function runMigrations(db: Database.Database): void {
  // Ensure migrations tracking table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const appliedRows = db.prepare('SELECT id FROM _migrations').all() as { id: string }[];
  const appliedSet = new Set(appliedRows.map((r) => r.id));

  for (const migration of migrations) {
    if (!appliedSet.has(migration.id)) {
      migration.run(db);
      db.prepare('INSERT OR IGNORE INTO _migrations (id) VALUES (?)').run(migration.id);
      appliedSet.add(migration.id);
    }
  }
}
