import { Agent } from './agent';
import { Therapy } from './therapy';

export type AppointmentStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  agent_id: string;
  therapy_id: string;
  scheduled_time: string;
  status: AppointmentStatus;
  clinical_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentDetail extends Appointment {
  agent: Agent;
  therapy: Therapy;
}

export type CreateAppointmentDTO = Omit<Appointment, 'created_at' | 'updated_at'>;

