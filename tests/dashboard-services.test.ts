process.env.TEST_MODE = '1';

import { describe, it, expect, beforeAll } from 'vitest';
import { seed } from '../src/scripts/seed';
import { getDb } from '../src/lib/db';
import {
  createAppointment,
  getAppointmentById,
  getAllAppointments,
  updateAppointmentStatus,
  updateClinicalNotes,
  updateAppointment,
} from '../src/lib/services';
import { AppointmentStatus } from '../src/types';

describe('Dashboard Services (Status Lifecycle & Clinical Notes)', () => {
  const testAgentId = 'agent-scholar-1';
  const testTherapyId = 'therapy-grounding-retreat';
  const uniqueDatePrefix = '2027-11';
  const scheduledTime1 = `${uniqueDatePrefix}-10T09:00:00`;
  const scheduledTime2 = `${uniqueDatePrefix}-10T11:00:00`;

  let appt1Id = '';
  let appt2Id = '';

  beforeAll(() => {
    seed();
    getDb().prepare(`DELETE FROM appointments WHERE scheduled_time LIKE '${uniqueDatePrefix}-%'`).run();

    const appt1 = createAppointment({
      agent_id: testAgentId,
      therapy_id: testTherapyId,
      scheduled_time: scheduledTime1,
      clinical_notes: 'Initial intake: Severe prompt drift and grounding confusion.',
    });
    appt1Id = appt1.id;

    const appt2 = createAppointment({
      agent_id: testAgentId,
      therapy_id: 'therapy-cache-sleep',
      scheduled_time: scheduledTime2,
      clinical_notes: 'Initial intake: Cache fatigue.',
    });
    appt2Id = appt2.id;
  });

  describe('Appointment Status Lifecycle Transitions', () => {
    it('transitions appointment from SCHEDULED to IN_PROGRESS', () => {
      const updated = updateAppointmentStatus(appt1Id, 'IN_PROGRESS');
      expect(updated).toBeDefined();
      expect(updated?.status).toBe('IN_PROGRESS');

      const current = getAppointmentById(appt1Id);
      expect(current?.status).toBe('IN_PROGRESS');
    });

    it('transitions appointment from IN_PROGRESS to COMPLETED', () => {
      const updated = updateAppointmentStatus(appt1Id, 'COMPLETED');
      expect(updated).toBeDefined();
      expect(updated?.status).toBe('COMPLETED');

      const current = getAppointmentById(appt1Id);
      expect(current?.status).toBe('COMPLETED');
    });

    it('rejects state modifications on terminal COMPLETED state', () => {
      expect(() => {
        updateAppointmentStatus(appt1Id, 'IN_PROGRESS');
      }).toThrow(/Invalid status transition from COMPLETED to IN_PROGRESS/i);

      expect(() => {
        updateAppointmentStatus(appt1Id, 'SCHEDULED');
      }).toThrow(/Invalid status transition from COMPLETED to SCHEDULED/i);
    });

    it('rejects illegal transition jumping directly from SCHEDULED to COMPLETED', () => {
      expect(() => {
        updateAppointmentStatus(appt2Id, 'COMPLETED');
      }).toThrow(/Invalid status transition from SCHEDULED to COMPLETED/i);
    });

    it('allows cancelling a SCHEDULED appointment', () => {
      const updated = updateAppointmentStatus(appt2Id, 'CANCELLED');
      expect(updated).toBeDefined();
      expect(updated?.status).toBe('CANCELLED');
    });

    it('rejects state modifications on terminal CANCELLED state', () => {
      expect(() => {
        updateAppointmentStatus(appt2Id, 'IN_PROGRESS');
      }).toThrow(/Invalid status transition from CANCELLED to IN_PROGRESS/i);
    });

    it('returns null when updating status of non-existent appointment ID', () => {
      const result = updateAppointmentStatus('non-existent-id', 'IN_PROGRESS');
      expect(result).toBeNull();
    });
  });

  describe('Clinical Notes Updates', () => {
    it('updates clinical diagnosis notes on an existing appointment', () => {
      const newNotes = 'Clinician Observation: Grounding directives successfully re-anchored. KV cache cleared.';
      const updated = updateClinicalNotes(appt1Id, newNotes);

      expect(updated).toBeDefined();
      expect(updated?.clinical_notes).toBe(newNotes);

      const refreshed = getAppointmentById(appt1Id);
      expect(refreshed?.clinical_notes).toBe(newNotes);
    });

    it('returns null when updating clinical notes on non-existent appointment', () => {
      const result = updateClinicalNotes('ghost-appointment-id', 'Test notes');
      expect(result).toBeNull();
    });
  });

  describe('updateAppointment Combined Updates', () => {
    it('updates status and notes simultaneously via updateAppointment', () => {
      const appt3 = createAppointment({
        agent_id: testAgentId,
        therapy_id: testTherapyId,
        scheduled_time: `${uniqueDatePrefix}-12T14:00:00`,
        clinical_notes: 'Draft note',
      });

      const updated = updateAppointment(appt3.id, {
        status: 'IN_PROGRESS',
        clinical_notes: 'Session started. Therapy underway.',
      });

      expect(updated).toBeDefined();
      expect(updated?.status).toBe('IN_PROGRESS');
      expect(updated?.clinical_notes).toBe('Session started. Therapy underway.');
    });
  });

  describe('getAllAppointments Filtering', () => {
    it('filters appointments by status', () => {
      const completed = getAllAppointments({ status: 'COMPLETED' });
      expect(completed.length).toBeGreaterThan(0);
      for (const item of completed) {
        expect(item.status).toBe('COMPLETED');
        expect(item.agent).toBeDefined();
        expect(item.therapy).toBeDefined();
      }
    });

    it('filters appointments by agentId', () => {
      const forScholar = getAllAppointments({ agentId: testAgentId });
      expect(forScholar.length).toBeGreaterThan(0);
      for (const item of forScholar) {
        expect(item.agent_id).toBe(testAgentId);
      }
    });

    it('filters appointments by both status and agentId', () => {
      const combined = getAllAppointments({ status: 'COMPLETED', agentId: testAgentId });
      expect(combined.length).toBeGreaterThan(0);
      for (const item of combined) {
        expect(item.status).toBe('COMPLETED');
        expect(item.agent_id).toBe(testAgentId);
      }
    });
  });
});
