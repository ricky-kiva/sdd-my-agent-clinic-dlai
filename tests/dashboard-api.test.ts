process.env.TEST_MODE = '1';

import { describe, it, expect, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { seed } from '../src/scripts/seed';
import { getDb } from '../src/lib/db';
import { createAppointment } from '../src/lib/services';
import { GET as getAppointments } from '../src/app/api/appointments/route';
import { PATCH as patchAppointment } from '../src/app/api/appointments/[id]/route';

describe('Dashboard API Route Handlers (PATCH /api/appointments/[id] & Filtering)', () => {
  const uniqueDatePrefix = '2027-12';
  const testAgentId = 'agent-helpdesk-9';
  const testTherapyId = 'therapy-subzero-temp';

  let testApptId = '';

  beforeAll(() => {
    seed();
    getDb().prepare(`DELETE FROM appointments WHERE scheduled_time LIKE '${uniqueDatePrefix}-%'`).run();

    const appt = createAppointment({
      agent_id: testAgentId,
      therapy_id: testTherapyId,
      scheduled_time: `${uniqueDatePrefix}-01T10:00:00`,
      clinical_notes: 'Initial intake stressors: Temperature overload.',
    });
    testApptId = appt.id;
  });

  describe('PATCH /api/appointments/[id]', () => {
    it('returns 400 when body has neither status nor clinical_notes', async () => {
      const req = new NextRequest(`http://localhost:3000/api/appointments/${testApptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const response = await patchAppointment(req, {
        params: Promise.resolve({ id: testApptId }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('At least one field');
    });

    it('returns 400 when invalid status value is supplied', async () => {
      const req = new NextRequest(`http://localhost:3000/api/appointments/${testApptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SUPER_ACTIVE' }),
      });

      const response = await patchAppointment(req, {
        params: Promise.resolve({ id: testApptId }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid status');
    });

    it('returns 400 when illegal state transition is attempted (SCHEDULED -> COMPLETED)', async () => {
      const req = new NextRequest(`http://localhost:3000/api/appointments/${testApptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });

      const response = await patchAppointment(req, {
        params: Promise.resolve({ id: testApptId }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid status transition');
    });

    it('returns 404 when appointment id does not exist', async () => {
      const req = new NextRequest('http://localhost:3000/api/appointments/ghost-id', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'IN_PROGRESS' }),
      });

      const response = await patchAppointment(req, {
        params: Promise.resolve({ id: 'ghost-id' }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toContain('not found');
    });

    it('returns 200 and transitions status to IN_PROGRESS on valid request', async () => {
      const req = new NextRequest(`http://localhost:3000/api/appointments/${testApptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'IN_PROGRESS' }),
      });

      const response = await patchAppointment(req, {
        params: Promise.resolve({ id: testApptId }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.appointment).toBeDefined();
      expect(data.appointment.status).toBe('IN_PROGRESS');
    });

    it('returns 200 and updates clinical diagnosis notes', async () => {
      const updatedNotes = 'Clinical Observation: Cryogenic bath stabilized temperature spikes.';
      const req = new NextRequest(`http://localhost:3000/api/appointments/${testApptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinical_notes: updatedNotes }),
      });

      const response = await patchAppointment(req, {
        params: Promise.resolve({ id: testApptId }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.appointment.clinical_notes).toBe(updatedNotes);
    });
  });

  describe('GET /api/appointments filtering', () => {
    it('filters appointments by status via GET /api/appointments?status=IN_PROGRESS', async () => {
      const req = new NextRequest('http://localhost:3000/api/appointments?status=IN_PROGRESS');
      const response = await getAppointments(req);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.appointments).toBeDefined();
      expect(Array.isArray(data.appointments)).toBe(true);

      for (const appt of data.appointments) {
        expect(appt.status).toBe('IN_PROGRESS');
      }
    });

    it('filters appointments by status and agentId simultaneously', async () => {
      const req = new NextRequest(`http://localhost:3000/api/appointments?status=IN_PROGRESS&agentId=${testAgentId}`);
      const response = await getAppointments(req);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.appointments).toBeDefined();

      for (const appt of data.appointments) {
        expect(appt.status).toBe('IN_PROGRESS');
        expect(appt.agent_id).toBe(testAgentId);
      }
    });
  });
});
