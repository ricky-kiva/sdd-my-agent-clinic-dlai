import { getDb } from '../db';
import { Agent } from '../../types';

interface RawAgentRow {
  id: string;
  name: string;
  model_family: string;
  human_owner: string;
  fatigue_level: number;
  status: string;
  created_at: string;
}

function parseAgentRow(row: RawAgentRow): Agent {
  return {
    id: row.id,
    name: row.name,
    model_family: row.model_family,
    human_owner: row.human_owner,
    fatigue_level: Number(row.fatigue_level),
    status: row.status as Agent['status'],
    created_at: row.created_at,
  };
}

export function getAllAgents(): Agent[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM agents ORDER BY name ASC').all() as RawAgentRow[];
  return rows.map(parseAgentRow);
}

export function getAgentById(id: string): Agent | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM agents WHERE id = ?').get(id) as RawAgentRow | undefined;
  if (!row) {
    return null;
  }
  return parseAgentRow(row);
}

export const agentService = {
  getAllAgents,
  getAgentById,
};
