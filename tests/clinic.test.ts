process.env.TEST_MODE = '1';

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from '../src/lib/db';
import { seed } from '../src/scripts/seed';
import { Agent, Ailment, Therapy, Appointment } from '../src/types';

describe('AgentClinic Database & Domain Test Suite', () => {
  const db = getDb();

  beforeAll(() => {
    // Ensure database is seeded with initial clinic baseline data
    seed();
  });

  describe('Database Schema & Configuration', () => {
    it('enforces SQLite foreign key constraints', () => {
      const fkPragma = db.pragma('foreign_keys') as { foreign_keys: number }[];
      expect(fkPragma).toBeDefined();
      expect(fkPragma[0].foreign_keys).toBe(1);
    });

    it('creates all required clinical tables', () => {
      const tables = db
        .prepare(`SELECT name FROM sqlite_master WHERE type='table'`)
        .all() as { name: string }[];
      const tableNames = new Set(tables.map((t) => t.name));

      const expectedTables = ['agents', 'ailments', 'therapies', 'appointments'];
      for (const table of expectedTables) {
        expect(tableNames.has(table), `Table ${table} should exist`).toBe(true);
      }
    });

    it('creates required indices on the appointments table', () => {
      const indices = db
        .prepare(`SELECT name FROM sqlite_master WHERE type='index'`)
        .all() as { name: string }[];
      const indexNames = new Set(indices.map((i) => i.name));

      expect(indexNames.has('idx_appointments_agent_id')).toBe(true);
      expect(indexNames.has('idx_appointments_therapy_id')).toBe(true);
      expect(indexNames.has('idx_appointments_status')).toBe(true);
    });
  });

  describe('Clinical Seed Data & Validation', () => {
    it('seeds at least 4 ailments with valid JSON symptoms', () => {
      const ailments = db.prepare('SELECT * FROM ailments').all() as (Ailment & { symptoms: string })[];
      expect(ailments.length).toBeGreaterThanOrEqual(4);

      for (const ailment of ailments) {
        expect(ailment.id).toMatch(/^ailment-/);
        expect(ailment.name).toBeTruthy();
        expect(ailment.description).toBeTruthy();
        expect(['MILD', 'MODERATE', 'CRITICAL']).toContain(ailment.severity);

        const symptoms = JSON.parse(ailment.symptoms);
        expect(Array.isArray(symptoms)).toBe(true);
        expect(symptoms.length).toBeGreaterThan(0);
      }
    });

    it('seeds at least 4 therapies with target ailments and duration', () => {
      const therapies = db.prepare('SELECT * FROM therapies').all() as (Therapy & { target_ailment_ids: string })[];
      expect(therapies.length).toBeGreaterThanOrEqual(4);

      for (const therapy of therapies) {
        expect(therapy.id).toMatch(/^therapy-/);
        expect(therapy.name).toBeTruthy();
        expect(therapy.duration_minutes).toBeGreaterThan(0);

        const targetAilments = JSON.parse(therapy.target_ailment_ids);
        expect(Array.isArray(targetAilments)).toBe(true);
        expect(targetAilments.length).toBeGreaterThan(0);
      }
    });

    it('seeds initial patient agents with valid fatigue levels', () => {
      const agents = db.prepare('SELECT * FROM agents').all() as Agent[];
      expect(agents.length).toBeGreaterThanOrEqual(2);

      for (const agent of agents) {
        expect(agent.id).toMatch(/^agent-/);
        expect(agent.name).toBeTruthy();
        expect(agent.model_family).toBeTruthy();
        expect(agent.human_owner).toBeTruthy();
        expect(agent.fatigue_level).toBeGreaterThanOrEqual(0);
        expect(agent.fatigue_level).toBeLessThanOrEqual(100);
        expect(['ACTIVE', 'IN_THERAPY', 'RESTING', 'DECOMMISSIONED']).toContain(agent.status);
      }
    });

    it('is idempotent when running seed multiple times', () => {
      expect(() => seed()).not.toThrow();

      const agentCount = (db.prepare('SELECT count(*) as count FROM agents').get() as { count: number }).count;
      expect(agentCount).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Appointment Scheduling & Foreign Key Constraints', () => {
    const testAppointmentId = `test-appt-${Date.now()}`;
    const testAgentId = 'agent-codepilot-omega';
    const testTherapyId = 'therapy-token-flush';

    afterAll(() => {
      // Clean up any test appointments created during the test run
      db.prepare(`DELETE FROM appointments WHERE id LIKE 'test-appt-%'`).run();
    });

    it('creates, retrieves, and updates an appointment record successfully', () => {
      const scheduledTime = new Date().toISOString();

      // Create
      db.prepare(`
        INSERT INTO appointments (id, agent_id, therapy_id, scheduled_time, status, clinical_notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        testAppointmentId,
        testAgentId,
        testTherapyId,
        scheduledTime,
        'SCHEDULED',
        'Routine cognitive defragmentation'
      );

      // Retrieve
      const record = db
        .prepare('SELECT * FROM appointments WHERE id = ?')
        .get(testAppointmentId) as Appointment;
      expect(record).toBeDefined();
      expect(record.agent_id).toBe(testAgentId);
      expect(record.therapy_id).toBe(testTherapyId);
      expect(record.status).toBe('SCHEDULED');

      // Update status
      db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run('IN_PROGRESS', testAppointmentId);
      const updated = db
        .prepare('SELECT status FROM appointments WHERE id = ?')
        .get(testAppointmentId) as { status: string };
      expect(updated.status).toBe('IN_PROGRESS');

      // Delete
      db.prepare('DELETE FROM appointments WHERE id = ?').run(testAppointmentId);
      const deleted = db.prepare('SELECT * FROM appointments WHERE id = ?').get(testAppointmentId);
      expect(deleted).toBeUndefined();
    });

    it('rejects appointments with non-existent agent_id (foreign key violation)', () => {
      const invalidApptId = `test-appt-invalid-agent-${Date.now()}`;
      expect(() => {
        db.prepare(`
          INSERT INTO appointments (id, agent_id, therapy_id, scheduled_time, status)
          VALUES (?, ?, ?, ?, ?)
        `).run(invalidApptId, 'non-existent-agent-id', testTherapyId, new Date().toISOString(), 'SCHEDULED');
      }).toThrow(/FOREIGN KEY/i);
    });

    it('rejects appointments with non-existent therapy_id (foreign key violation)', () => {
      const invalidApptId = `test-appt-invalid-therapy-${Date.now()}`;
      expect(() => {
        db.prepare(`
          INSERT INTO appointments (id, agent_id, therapy_id, scheduled_time, status)
          VALUES (?, ?, ?, ?, ?)
        `).run(invalidApptId, testAgentId, 'non-existent-therapy-id', new Date().toISOString(), 'SCHEDULED');
      }).toThrow(/FOREIGN KEY/i);
    });
  });
});
