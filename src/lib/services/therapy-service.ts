import { getDb } from '../db';
import { Therapy, TherapyMethodology } from '../../types';

interface RawTherapyRow {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  target_ailment_ids: string;
  methodology?: string;
  created_at: string;
}

function getRelationalTargetAilmentMap(db: ReturnType<typeof getDb>): Map<string, string[]> {
  try {
    const rows = db.prepare('SELECT therapy_id, ailment_id FROM therapy_target_ailments ORDER BY ailment_id ASC').all() as {
      therapy_id: string;
      ailment_id: string;
    }[];
    const map = new Map<string, string[]>();
    for (const r of rows) {
      const list = map.get(r.therapy_id) || [];
      list.push(r.ailment_id);
      map.set(r.therapy_id, list);
    }
    return map;
  } catch {
    return new Map();
  }
}

function parseTherapyRow(row: RawTherapyRow, relationalTargets?: string[]): Therapy {
  let targetAilmentIds: string[] = [];

  // Prioritize relational junction table targets (which enforce foreign key integrity and CASCADE)
  if (relationalTargets !== undefined) {
    targetAilmentIds = relationalTargets;
  } else {
    try {
      const parsed = JSON.parse(row.target_ailment_ids);
      if (Array.isArray(parsed)) {
        targetAilmentIds = parsed;
      }
    } catch {
      targetAilmentIds = [];
    }
  }

  let methodology: TherapyMethodology = {
    mechanism: 'Targeted restorative clinical therapy.',
    steps: ['Clinical evaluation', 'Therapeutic administration', 'Discharge verification'],
    expected_outcome: 'Reduced cognitive fatigue and restored deterministic stability.',
  };

  if (row.methodology) {
    try {
      const parsedMethodology = JSON.parse(row.methodology);
      if (parsedMethodology && typeof parsedMethodology === 'object') {
        const sanitizedSteps = Array.isArray(parsedMethodology.steps)
          ? parsedMethodology.steps.filter((s: unknown): s is string => typeof s === 'string' && s.trim().length > 0)
          : methodology.steps;

        methodology = {
          mechanism: parsedMethodology.mechanism || methodology.mechanism,
          steps: sanitizedSteps.length > 0 ? sanitizedSteps : methodology.steps,
          expected_outcome: parsedMethodology.expected_outcome || methodology.expected_outcome,
        };
      }
    } catch {
      // Fallback to default
    }
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    duration_minutes: row.duration_minutes,
    target_ailment_ids: targetAilmentIds,
    methodology,
    created_at: row.created_at,
  };
}

export function getAllTherapies(): Therapy[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM therapies ORDER BY name ASC').all() as RawTherapyRow[];
  const map = getRelationalTargetAilmentMap(db);
  return rows.map((r) => parseTherapyRow(r, map.get(r.id)));
}

export function getTherapyById(id: string): Therapy | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM therapies WHERE id = ?').get(id) as RawTherapyRow | undefined;
  if (!row) {
    return null;
  }
  const map = getRelationalTargetAilmentMap(db);
  return parseTherapyRow(row, map.get(row.id));
}

export function getTherapiesForAilment(ailmentId: string): Therapy[] {
  const db = getDb();
  try {
    const rows = db.prepare(`
      SELECT t.* FROM therapies t
      JOIN therapy_target_ailments tta ON tta.therapy_id = t.id
      WHERE tta.ailment_id = ?
      ORDER BY t.name ASC
    `).all(ailmentId) as RawTherapyRow[];

    if (rows.length > 0) {
      const map = getRelationalTargetAilmentMap(db);
      return rows.map((r) => parseTherapyRow(r, map.get(r.id)));
    }
  } catch {
    // Fallback if junction table query fails
  }

  const allTherapies = getAllTherapies();
  return allTherapies.filter((t) => t.target_ailment_ids.includes(ailmentId));
}

export const therapyService = {
  getAllTherapies,
  getTherapyById,
  getTherapiesForAilment,
};
