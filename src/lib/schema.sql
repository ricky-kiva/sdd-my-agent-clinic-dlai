PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  model_family TEXT NOT NULL,
  human_owner TEXT NOT NULL,
  fatigue_level INTEGER NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ailments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'MODERATE',
  symptoms TEXT NOT NULL, -- JSON array of string symptoms
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS therapies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  target_ailment_ids TEXT NOT NULL, -- JSON array of ailment IDs
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  therapy_id TEXT NOT NULL REFERENCES therapies(id) ON DELETE RESTRICT,
  scheduled_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SCHEDULED',
  clinical_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_appointments_agent_id ON appointments(agent_id);
CREATE INDEX IF NOT EXISTS idx_appointments_therapy_id ON appointments(therapy_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
