process.env.TEST_MODE = '1';

import { describe, it, expect, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { seed } from '../src/scripts/seed';
import { GET as getAgents } from '../src/app/api/agents/route';
import {
  GET as getAppointments,
  POST as postAppointments,
} from '../src/app/api/appointments/route';
import { GET as getAppointmentByIdRoute } from '../src/app/api/appointments/[id]/route';

describe('Booking API Route Handlers', () => {
  beforeAll(() => {
    seed();
  });

  describe('GET /api/agents', () => {
    it('returns 200 and list of registered agents', async () => {
      const response = await getAgents();
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.agents).toBeDefined();
      expect(Array.isArray(data.agents)).toBe(true);
      expect(data.agents.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('POST & GET /api/appointments', () => {
    const apiTestDate = '2027-08-20';
    const apiTestSlot = '14:00';
    const apiScheduledTime = `${apiTestDate}T${apiTestSlot}:00`;
    let createdApptId = '';

    it('returns 400 when required fields are missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: 'agent-codepilot-omega',
          // missing therapy_id and scheduled_time
        }),
      });

      const response = await postAppointments(req);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toContain('Missing required fields');
    });

    it('returns 201 and creates a new appointment on valid payload', async () => {
      const req = new NextRequest('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: 'agent-helpdesk-9',
          therapy_id: 'therapy-subzero-temp',
          scheduled_time: apiScheduledTime,
          clinical_notes: 'Excessive tool-calling temperature spikes',
        }),
      });

      const response = await postAppointments(req);
      expect(response.status).toBe(201);

      const data = await response.json();
      expect(data.appointment).toBeDefined();
      expect(data.appointment.agent_id).toBe('agent-helpdesk-9');
      expect(data.appointment.therapy_id).toBe('therapy-subzero-temp');
      expect(data.appointment.scheduled_time).toBe(apiScheduledTime);
      createdApptId = data.appointment.id;
    });

    it('returns 409 Conflict when attempting double-booking', async () => {
      const req = new NextRequest('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: 'agent-helpdesk-9',
          therapy_id: 'therapy-token-flush',
          scheduled_time: apiScheduledTime,
        }),
      });

      const response = await postAppointments(req);
      expect(response.status).toBe(409);

      const data = await response.json();
      expect(data.error).toContain('already has an appointment');
    });

    it('returns 200 and list of appointments on GET /api/appointments', async () => {
      const req = new NextRequest('http://localhost:3000/api/appointments');
      const response = await getAppointments(req);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.appointments).toBeDefined();
      expect(Array.isArray(data.appointments)).toBe(true);
      expect(data.appointments.length).toBeGreaterThan(0);
    });

    it('filters appointments by agentId parameter on GET /api/appointments?agentId=...', async () => {
      const req = new NextRequest('http://localhost:3000/api/appointments?agentId=agent-helpdesk-9');
      const response = await getAppointments(req);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.appointments).toBeDefined();
      for (const appt of data.appointments) {
        expect(appt.agent_id).toBe('agent-helpdesk-9');
      }
    });

    it('returns 200 on GET /api/appointments/[id] for existing appointment', async () => {
      expect(createdApptId).toBeTruthy();
      const req = new NextRequest(`http://localhost:3000/api/appointments/${createdApptId}`);
      const response = await getAppointmentByIdRoute(req, {
        params: Promise.resolve({ id: createdApptId }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.appointment).toBeDefined();
      expect(data.appointment.id).toBe(createdApptId);
      expect(data.appointment.agent).toBeDefined();
      expect(data.appointment.therapy).toBeDefined();
    });

    it('returns 404 on GET /api/appointments/[id] for non-existent ID', async () => {
      const req = new NextRequest('http://localhost:3000/api/appointments/ghost-id');
      const response = await getAppointmentByIdRoute(req, {
        params: Promise.resolve({ id: 'ghost-id' }),
      });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toContain('not found');
    });
  });
});
