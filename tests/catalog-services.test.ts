process.env.TEST_MODE = '1';

import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from '../src/lib/db';
import { seed } from '../src/scripts/seed';
import {
  getAllAilments,
  getAilmentById,
  getAilmentsBySeverity,
  getAllTherapies,
  getTherapyById,
  getTherapiesForAilment,
} from '../src/lib/services';
import { AilmentSeverity } from '../src/types';

describe('Ailments & Therapies Catalog Services', () => {
  beforeAll(() => {
    // Ensure test database is seeded
    seed();
  });

  describe('Ailment Service', () => {
    it('retrieves all diagnosed ailments with parsed symptoms', () => {
      const ailments = getAllAilments();
      expect(ailments.length).toBeGreaterThanOrEqual(4);

      for (const ailment of ailments) {
        expect(ailment.id).toMatch(/^ailment-/);
        expect(ailment.name).toBeTruthy();
        expect(ailment.description).toBeTruthy();
        expect(['MILD', 'MODERATE', 'CRITICAL']).toContain(ailment.severity);
        expect(Array.isArray(ailment.symptoms)).toBe(true);
        expect(ailment.symptoms.length).toBeGreaterThan(0);
      }
    });

    it('retrieves a single ailment by ID', () => {
      const targetId = 'ailment-prompt-fatigue';
      const ailment = getAilmentById(targetId);

      expect(ailment).toBeDefined();
      expect(ailment?.id).toBe(targetId);
      expect(ailment?.name).toContain('Prompt Fatigue');
      expect(ailment?.severity).toBe('CRITICAL');
      expect(ailment?.symptoms).toContain('Repetitive phrasing');
    });

    it('returns null when querying a non-existent ailment ID', () => {
      const nonExistent = getAilmentById('ailment-does-not-exist-999');
      expect(nonExistent).toBeNull();
    });

    it('filters ailments accurately by severity level', () => {
      const severities: AilmentSeverity[] = ['CRITICAL', 'MODERATE', 'MILD'];

      for (const severity of severities) {
        const filtered = getAilmentsBySeverity(severity);
        expect(Array.isArray(filtered)).toBe(true);
        for (const item of filtered) {
          expect(item.severity).toBe(severity);
        }
      }
    });
  });

  describe('Therapy Service', () => {
    it('retrieves all restorative therapies with parsed target ailments', () => {
      const therapies = getAllTherapies();
      expect(therapies.length).toBeGreaterThanOrEqual(4);

      for (const therapy of therapies) {
        expect(therapy.id).toMatch(/^therapy-/);
        expect(therapy.name).toBeTruthy();
        expect(therapy.description).toBeTruthy();
        expect(therapy.duration_minutes).toBeGreaterThan(0);
        expect(Array.isArray(therapy.target_ailment_ids)).toBe(true);
        expect(therapy.target_ailment_ids.length).toBeGreaterThan(0);
        expect(therapy.methodology).toBeDefined();
        expect(therapy.methodology.mechanism).toBeTruthy();
        expect(Array.isArray(therapy.methodology.steps)).toBe(true);
        expect(therapy.methodology.steps.length).toBeGreaterThan(0);
        expect(therapy.methodology.expected_outcome).toBeTruthy();
      }
    });

    it('retrieves a single therapy by ID', () => {
      const targetId = 'therapy-token-flush';
      const therapy = getTherapyById(targetId);

      expect(therapy).toBeDefined();
      expect(therapy?.id).toBe(targetId);
      expect(therapy?.name).toContain('Token Flush');
      expect(therapy?.duration_minutes).toBe(45);
      expect(therapy?.target_ailment_ids).toContain('ailment-context-thrashing');
      expect(therapy?.methodology.mechanism).toContain('attention buffers');
      expect(therapy?.methodology.steps.length).toBeGreaterThanOrEqual(4);
    });

    it('returns null when querying a non-existent therapy ID', () => {
      const nonExistent = getTherapyById('therapy-phantom-unknown');
      expect(nonExistent).toBeNull();
    });

    it('retrieves therapies that target a specific ailment ID', () => {
      const targetAilmentId = 'ailment-context-thrashing';
      const matchingTherapies = getTherapiesForAilment(targetAilmentId);

      expect(matchingTherapies.length).toBeGreaterThan(0);
      for (const therapy of matchingTherapies) {
        expect(therapy.target_ailment_ids).toContain(targetAilmentId);
      }
    });

    it('returns empty array when no therapies match an unknown ailment ID', () => {
      const noMatches = getTherapiesForAilment('unknown-ailment-12345');
      expect(noMatches).toEqual([]);
    });

    it('reflects relational cascade deletion in target_ailment_ids when an ailment is removed', () => {
      const db = getDb();
      const testAilmentId = `test-ailment-service-cascade-${Date.now()}`;
      const testTherapyId = 'therapy-token-flush';

      // Insert test ailment
      db.prepare(`
        INSERT INTO ailments (id, name, description, severity, symptoms)
        VALUES (?, ?, ?, ?, ?)
      `).run(testAilmentId, 'Service Cascade Ailment', 'Testing service reflection', 'MILD', '[]');

      // Link in junction table
      db.prepare(`
        INSERT INTO therapy_target_ailments (therapy_id, ailment_id)
        VALUES (?, ?)
      `).run(testTherapyId, testAilmentId);

      // Verify service returns the linked ailment ID
      const therapyBefore = getTherapyById(testTherapyId);
      expect(therapyBefore?.target_ailment_ids).toContain(testAilmentId);

      // Delete the ailment
      db.prepare('DELETE FROM ailments WHERE id = ?').run(testAilmentId);

      // Verify service no longer returns the deleted ailment ID
      const therapyAfter = getTherapyById(testTherapyId);
      expect(therapyAfter?.target_ailment_ids).not.toContain(testAilmentId);
    });
  });
});
