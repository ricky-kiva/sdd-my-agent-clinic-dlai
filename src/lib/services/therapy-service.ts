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

function parseTherapyRow(row: RawTherapyRow): Therapy {
  let targetAilmentIds: string[] = [];
  try {
    const parsed = JSON.parse(row.target_ailment_ids);
    if (Array.isArray(parsed)) {
      targetAilmentIds = parsed;
    }
  } catch {
    targetAilmentIds = [];
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
        methodology = {
          mechanism: parsedMethodology.mechanism || methodology.mechanism,
          steps: Array.isArray(parsedMethodology.steps) ? parsedMethodology.steps : methodology.steps,
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
  return rows.map(parseTherapyRow);
}

export function getTherapyById(id: string): Therapy | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM therapies WHERE id = ?').get(id) as RawTherapyRow | undefined;
  if (!row) {
    return null;
  }
  return parseTherapyRow(row);
}

export function getTherapiesForAilment(ailmentId: string): Therapy[] {
  const allTherapies = getAllTherapies();
  return allTherapies.filter((t) => t.target_ailment_ids.includes(ailmentId));
}

export const therapyService = {
  getAllTherapies,
  getTherapyById,
  getTherapiesForAilment,
};
