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
  methodology TEXT NOT NULL DEFAULT '{}', -- JSON object containing mechanism, steps, expected_outcome
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

-- Relational junction table enforcing foreign key constraints between therapies and ailments
CREATE TABLE IF NOT EXISTS therapy_target_ailments (
  therapy_id TEXT NOT NULL REFERENCES therapies(id) ON DELETE CASCADE,
  ailment_id TEXT NOT NULL REFERENCES ailments(id) ON DELETE CASCADE,
  PRIMARY KEY (therapy_id, ailment_id)
);

CREATE INDEX IF NOT EXISTS idx_therapy_target_ailments_ailment_id ON therapy_target_ailments(ailment_id);
CREATE INDEX IF NOT EXISTS idx_therapy_target_ailments_therapy_id ON therapy_target_ailments(therapy_id);

-- Lightweight database migrations tracking table
CREATE TABLE IF NOT EXISTS _migrations (
  id TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

