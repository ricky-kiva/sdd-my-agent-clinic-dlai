import crypto from 'crypto';
import { getDb } from '../db';
import {
  Appointment,
  AppointmentDetail,
  AppointmentStatus,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  VALID_STATUS_TRANSITIONS,
} from '../../types';
import { agentService } from './agent-service';
import { therapyService } from './therapy-service';

export const STANDARD_CLINIC_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

interface RawAppointmentRow {
  id: string;
  agent_id: string;
  therapy_id: string;
  scheduled_time: string;
  status: string;
  clinical_notes: string | null;
  created_at: string;
  updated_at: string;
}

function parseAppointmentRow(row: RawAppointmentRow): Appointment {
  return {
    id: row.id,
    agent_id: row.agent_id,
    therapy_id: row.therapy_id,
    scheduled_time: row.scheduled_time,
    status: row.status as AppointmentStatus,
    clinical_notes: row.clinical_notes || undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function createAppointment(dto: Partial<CreateAppointmentDTO> & { agent_id: string; therapy_id: string; scheduled_time: string }): Appointment {
  if (!dto.agent_id || !dto.therapy_id || !dto.scheduled_time) {
    throw new Error('Missing required fields: agent_id, therapy_id, scheduled_time');
  }

  const agent = agentService.getAgentById(dto.agent_id);
  if (!agent) {
    throw new Error(`Agent not found with id: ${dto.agent_id}`);
  }

  const therapy = therapyService.getTherapyById(dto.therapy_id);
  if (!therapy) {
    throw new Error(`Therapy not found with id: ${dto.therapy_id}`);
  }

  const db = getDb();

  // Enforce double-booking conflict prevention for agent
  const agentConflict = db.prepare(`
    SELECT id FROM appointments
    WHERE agent_id = ? AND scheduled_time = ? AND status != 'CANCELLED'
  `).get(dto.agent_id, dto.scheduled_time);

  if (agentConflict) {
    throw new Error('Agent already has an appointment scheduled at this time');
  }

  // Enforce double-booking conflict prevention for therapy slot
  const therapyConflict = db.prepare(`
    SELECT id FROM appointments
    WHERE therapy_id = ? AND scheduled_time = ? AND status != 'CANCELLED'
  `).get(dto.therapy_id, dto.scheduled_time);

  if (therapyConflict) {
    throw new Error('Therapy session slot is already booked');
  }

  const id = dto.id || crypto.randomUUID();
  const status: AppointmentStatus = dto.status || 'SCHEDULED';
  const now = new Date().toISOString();
  const clinicalNotes = dto.clinical_notes || null;

  db.prepare(`
    INSERT INTO appointments (id, agent_id, therapy_id, scheduled_time, status, clinical_notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    dto.agent_id,
    dto.therapy_id,
    dto.scheduled_time,
    status,
    clinicalNotes,
    now,
    now
  );

  return {
    id,
    agent_id: dto.agent_id,
    therapy_id: dto.therapy_id,
    scheduled_time: dto.scheduled_time,
    status,
    clinical_notes: clinicalNotes || undefined,
    created_at: now,
    updated_at: now,
  };
}

export function getAppointmentById(id: string): AppointmentDetail | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as RawAppointmentRow | undefined;
  if (!row) {
    return null;
  }

  const appt = parseAppointmentRow(row);
  const agent = agentService.getAgentById(appt.agent_id);
  const therapy = therapyService.getTherapyById(appt.therapy_id);

  if (!agent || !therapy) {
    return null;
  }

  return {
    ...appt,
    agent,
    therapy,
  };
}

export function getAllAppointments(filter?: { status?: AppointmentStatus; agentId?: string }): AppointmentDetail[] {
  const db = getDb();
  let query = 'SELECT * FROM appointments';
  const conditions: string[] = [];
  const params: any[] = [];

  if (filter?.status) {
    conditions.push('status = ?');
    params.push(filter.status);
  }
  if (filter?.agentId) {
    conditions.push('agent_id = ?');
    params.push(filter.agentId);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY scheduled_time ASC';

  const rows = db.prepare(query).all(...params) as RawAppointmentRow[];
  const appointments: AppointmentDetail[] = [];

  for (const row of rows) {
    const appt = parseAppointmentRow(row);
    const agent = agentService.getAgentById(appt.agent_id);
    const therapy = therapyService.getTherapyById(appt.therapy_id);
    if (agent && therapy) {
      appointments.push({
        ...appt,
        agent,
        therapy,
      });
    }
  }

  return appointments;
}

export function getAppointmentsByAgentId(agentId: string): Appointment[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM appointments WHERE agent_id = ? ORDER BY scheduled_time ASC').all(agentId) as RawAppointmentRow[];
  return rows.map(parseAppointmentRow);
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus): Appointment | null {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as RawAppointmentRow | undefined;
  if (!existing) {
    return null;
  }

  const currentStatus = existing.status as AppointmentStatus;
  if (currentStatus !== status) {
    const allowed = VALID_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(status)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${status}`);
    }
  }

  const now = new Date().toISOString();
  db.prepare('UPDATE appointments SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);

  const row = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as RawAppointmentRow | undefined;
  return row ? parseAppointmentRow(row) : null;
}

export function updateClinicalNotes(id: string, clinicalNotes: string): Appointment | null {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as RawAppointmentRow | undefined;
  if (!existing) {
    return null;
  }

  const now = new Date().toISOString();
  db.prepare('UPDATE appointments SET clinical_notes = ?, updated_at = ? WHERE id = ?').run(clinicalNotes, now, id);

  const row = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as RawAppointmentRow | undefined;
  return row ? parseAppointmentRow(row) : null;
}

export function updateAppointment(id: string, dto: UpdateAppointmentDTO): Appointment | null {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as RawAppointmentRow | undefined;
  if (!existing) {
    return null;
  }

  let newStatus = existing.status as AppointmentStatus;
  if (dto.status !== undefined && dto.status !== newStatus) {
    const allowed = VALID_STATUS_TRANSITIONS[newStatus] || [];
    if (!allowed.includes(dto.status)) {
      throw new Error(`Invalid status transition from ${newStatus} to ${dto.status}`);
    }
    newStatus = dto.status;
  }

  const newNotes = dto.clinical_notes !== undefined ? dto.clinical_notes : existing.clinical_notes;
  const now = new Date().toISOString();

  db.prepare('UPDATE appointments SET status = ?, clinical_notes = ?, updated_at = ? WHERE id = ?').run(
    newStatus,
    newNotes,
    now,
    id
  );

  const row = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id) as RawAppointmentRow | undefined;
  return row ? parseAppointmentRow(row) : null;
}

export function getAvailableSlots(therapyId: string, date: string): string[] {
  const db = getDb();
  const booked = db.prepare(`
    SELECT scheduled_time FROM appointments
    WHERE therapy_id = ?
      AND status != 'CANCELLED'
      AND scheduled_time LIKE ?
  `).all(therapyId, `${date}%`) as { scheduled_time: string }[];

  const bookedSlots = new Set<string>();
  for (const item of booked) {
    // Extract HH:mm part from format like '2026-10-15T09:00' or '2026-10-15 09:00'
    const match = item.scheduled_time.match(/T?(\d{2}:\d{2})/);
    if (match && match[1]) {
      bookedSlots.add(match[1]);
    }
  }

  return STANDARD_CLINIC_SLOTS.filter(slot => !bookedSlots.has(slot));
}

export const appointmentService = {
  createAppointment,
  getAppointmentById,
  getAllAppointments,
  getAppointmentsByAgentId,
  updateAppointmentStatus,
  updateClinicalNotes,
  updateAppointment,
  getAvailableSlots,
};

