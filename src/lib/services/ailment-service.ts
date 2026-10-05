import { getDb } from '../db';
import { Ailment, AilmentSeverity } from '../../types';

interface RawAilmentRow {
  id: string;
  name: string;
  description: string;
  severity: string;
  symptoms: string;
  created_at: string;
}

function parseAilmentRow(row: RawAilmentRow): Ailment {
  let symptoms: string[] = [];
  try {
    const parsed = JSON.parse(row.symptoms);
    if (Array.isArray(parsed)) {
      symptoms = parsed;
    }
  } catch {
    symptoms = [];
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    severity: row.severity as AilmentSeverity,
    symptoms,
    created_at: row.created_at,
  };
}

export function getAllAilments(): Ailment[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM ailments ORDER BY name ASC').all() as RawAilmentRow[];
  return rows.map(parseAilmentRow);
}

export function getAilmentById(id: string): Ailment | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM ailments WHERE id = ?').get(id) as RawAilmentRow | undefined;
  if (!row) {
    return null;
  }
  return parseAilmentRow(row);
}

export function getAilmentsBySeverity(severity: AilmentSeverity): Ailment[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM ailments WHERE severity = ? ORDER BY name ASC').all(severity) as RawAilmentRow[];
  return rows.map(parseAilmentRow);
}

export const ailmentService = {
  getAllAilments,
  getAilmentById,
  getAilmentsBySeverity,
};
