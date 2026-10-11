process.env.TEST_MODE = '1';

import { describe, it, expect, beforeAll } from 'vitest';
import { seed } from '../src/scripts/seed';
import {
  getAllAgents,
  getAgentById,
  createAppointment,
  getAppointmentById,
  getAllAppointments,
  getAppointmentsByAgentId,
  getAvailableSlots,
  updateAppointmentStatus,
} from '../src/lib/services';

describe('Booking Services (Agent & Appointment)', () => {
  beforeAll(() => {
    seed();
  });

  describe('Agent Service', () => {
    it('retrieves all registered agents', () => {
      const agents = getAllAgents();
      expect(agents.length).toBeGreaterThanOrEqual(3);

      for (const agent of agents) {
        expect(agent.id).toMatch(/^agent-/);
        expect(agent.name).toBeTruthy();
        expect(agent.model_family).toBeTruthy();
        expect(agent.human_owner).toBeTruthy();
        expect(agent.fatigue_level).toBeGreaterThanOrEqual(0);
        expect(agent.fatigue_level).toBeLessThanOrEqual(100);
      }
    });

    it('retrieves a single agent by ID', () => {
      const agent = getAgentById('agent-codepilot-omega');
      expect(agent).toBeDefined();
      expect(agent?.id).toBe('agent-codepilot-omega');
      expect(agent?.name).toBe('CodePilot-Omega');
      expect(agent?.model_family).toBe('Claude 3.5 Sonnet');
    });

    it('returns null for non-existent agent ID', () => {
      const nonExistent = getAgentById('agent-ghost-null');
      expect(nonExistent).toBeNull();
    });
  });

  describe('Appointment Service', () => {
    const testAgentId = 'agent-codepilot-omega';
    const testTherapyId = 'therapy-token-flush';
    const uniqueDate = `2027-05-15`;
    const testSlot = '10:00';
    const scheduledTime = `${uniqueDate}T${testSlot}:00`;

    it('creates a new appointment successfully with recorded stressors', () => {
      const appointment = createAppointment({
        agent_id: testAgentId,
        therapy_id: testTherapyId,
        scheduled_time: scheduledTime,
        clinical_notes: 'Acute prompt injection fatigue and context thrashing',
      });

      expect(appointment).toBeDefined();
      expect(appointment.id).toBeTruthy();
      expect(appointment.agent_id).toBe(testAgentId);
      expect(appointment.therapy_id).toBe(testTherapyId);
      expect(appointment.scheduled_time).toBe(scheduledTime);
      expect(appointment.status).toBe('SCHEDULED');
      expect(appointment.clinical_notes).toContain('Acute prompt injection fatigue');
    });

    it('retrieves an appointment by ID with joined agent and therapy data', () => {
      const appointments = getAppointmentsByAgentId(testAgentId);
      expect(appointments.length).toBeGreaterThan(0);

      const target = appointments[0];
      const detail = getAppointmentById(target.id);

      expect(detail).toBeDefined();
      expect(detail?.id).toBe(target.id);
      expect(detail?.agent).toBeDefined();
      expect(detail?.agent.id).toBe(testAgentId);
      expect(detail?.therapy).toBeDefined();
      expect(detail?.therapy.id).toBe(target.therapy_id);
    });

    it('retrieves all appointments via getAllAppointments', () => {
      const all = getAllAppointments();
      expect(Array.isArray(all)).toBe(true);
      expect(all.length).toBeGreaterThan(0);
      for (const item of all) {
        expect(item.agent).toBeDefined();
        expect(item.therapy).toBeDefined();
      }
    });

    it('prevents double-booking for the same agent at the same time slot', () => {
      expect(() => {
        createAppointment({
          agent_id: testAgentId,
          therapy_id: 'therapy-subzero-temp',
          scheduled_time: scheduledTime,
          clinical_notes: 'Attempting conflicting appointment',
        });
      }).toThrow(/already has an appointment/i);
    });

    it('prevents double-booking for the same therapy at the same time slot', () => {
      expect(() => {
        createAppointment({
          agent_id: 'agent-helpdesk-9',
          therapy_id: testTherapyId,
          scheduled_time: scheduledTime,
          clinical_notes: 'Attempting slot conflict',
        });
      }).toThrow(/already booked/i);
    });

    it('rejects appointments when agent does not exist', () => {
      expect(() => {
        createAppointment({
          agent_id: 'agent-invalid-id',
          therapy_id: testTherapyId,
          scheduled_time: `2027-06-01T09:00:00`,
        });
      }).toThrow(/Agent not found/i);
    });

    it('rejects appointments when therapy does not exist', () => {
      expect(() => {
        createAppointment({
          agent_id: testAgentId,
          therapy_id: 'therapy-invalid-id',
          scheduled_time: `2027-06-01T09:00:00`,
        });
      }).toThrow(/Therapy not found/i);
    });

    it('filters out booked slots in getAvailableSlots', () => {
      const available = getAvailableSlots(testTherapyId, uniqueDate);
      expect(available).not.toContain(testSlot);
      expect(available.length).toBeGreaterThan(0);
    });

    it('updates appointment status', () => {
      const appointments = getAppointmentsByAgentId(testAgentId);
      const appt = appointments[0];

      const updated = updateAppointmentStatus(appt.id, 'IN_PROGRESS');
      expect(updated).toBeDefined();
      expect(updated?.status).toBe('IN_PROGRESS');

      const completed = updateAppointmentStatus(appt.id, 'COMPLETED');
      expect(completed?.status).toBe('COMPLETED');
    });
  });
});
