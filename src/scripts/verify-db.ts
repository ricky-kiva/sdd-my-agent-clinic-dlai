import { getDb } from '../lib/db';
import { Appointment } from '../types';

export function verify(): boolean {
  console.log('🔍 Running Phase 1 Database & Smoke Verification...');
  const db = getDb();

  // 1. Verify schema tables exist
  const expectedTables = ['agents', 'ailments', 'therapies', 'appointments'];
  const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all() as { name: string }[];
  const tableNames = new Set(tables.map(t => t.name));

  for (const table of expectedTables) {
    if (!tableNames.has(table)) {
      throw new Error(`❌ Missing expected table: ${table}`);
    }
  }
  console.log('  ✓ Schema verified: agents, ailments, therapies, appointments present.');

  // 2. Verify foreign key pragma
  const fkResult = db.pragma('foreign_keys') as { foreign_keys: number }[];
  if (!fkResult || fkResult.length === 0 || fkResult[0].foreign_keys !== 1) {
    throw new Error('❌ SQLite foreign_keys constraint is not enabled.');
  }
  console.log('  ✓ Foreign key enforcement is active.');

  // 3. Verify seeded data counts
  const ailmentCount = (db.prepare('SELECT count(*) as count FROM ailments').get() as { count: number }).count;
  const therapyCount = (db.prepare('SELECT count(*) as count FROM therapies').get() as { count: number }).count;
  const agentCount = (db.prepare('SELECT count(*) as count FROM agents').get() as { count: number }).count;

  if (ailmentCount < 4) {
    throw new Error(`❌ Expected >= 4 ailments, found: ${ailmentCount}`);
  }
  if (therapyCount < 4) {
    throw new Error(`❌ Expected >= 4 therapies, found: ${therapyCount}`);
  }
  if (agentCount < 2) {
    throw new Error(`❌ Expected >= 2 agents, found: ${agentCount}`);
  }
  console.log(`  ✓ Seed data verified: ${ailmentCount} ailments, ${therapyCount} therapies, ${agentCount} agents.`);

  // 4. CRUD smoke test on appointments table
  const testId = `test-smoke-${Date.now()}`;
  const testAgentId = 'agent-codepilot-omega';
  const testTherapyId = 'therapy-token-flush';
  const scheduledTime = new Date().toISOString();

  // Insert
  db.prepare(`
    INSERT INTO appointments (id, agent_id, therapy_id, scheduled_time, status, clinical_notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(testId, testAgentId, testTherapyId, scheduledTime, 'SCHEDULED', 'Smoke test appointment record');

  // Query back
  const retrieved = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(testId) as Appointment | undefined;
  if (!retrieved || retrieved.agent_id !== testAgentId || retrieved.therapy_id !== testTherapyId) {
    throw new Error('❌ Smoke test appointment insert/query failed: data mismatch.');
  }

  // Delete test record
  db.prepare(`DELETE FROM appointments WHERE id = ?`).run(testId);
  const afterDelete = db.prepare(`SELECT * FROM appointments WHERE id = ?`).get(testId);
  if (afterDelete) {
    throw new Error('❌ Smoke test cleanup failed: record still exists.');
  }
  console.log('  ✓ Appointment CRUD smoke test passed.');

  console.log('✅ Phase 1 Verification Passed: All tables, types, and constraints verified.');
  return true;
}

if (require.main === module || !process.env.TEST_MODE) {
  try {
    verify();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
