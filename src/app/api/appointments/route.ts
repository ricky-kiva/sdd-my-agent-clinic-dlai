import { NextRequest, NextResponse } from 'next/server';
import {
  createAppointment,
  getAllAppointments,
  getAppointmentsByAgentId,
} from '../../../lib/services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId') || searchParams.get('agent_id');

    if (agentId) {
      const appointments = getAppointmentsByAgentId(agentId);
      return NextResponse.json({ appointments });
    }

    const appointments = getAllAppointments();
    return NextResponse.json({ appointments });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const { agent_id, therapy_id, scheduled_time, clinical_notes } = body || {};

    if (!agent_id || !therapy_id || !scheduled_time) {
      return NextResponse.json(
        { error: 'Missing required fields: agent_id, therapy_id, scheduled_time' },
        { status: 400 }
      );
    }

    try {
      const appointment = createAppointment({
        agent_id,
        therapy_id,
        scheduled_time,
        clinical_notes,
      });

      return NextResponse.json({ appointment }, { status: 201 });
    } catch (serviceError) {
      const msg = (serviceError as Error).message || 'Error creating appointment';

      if (msg.includes('already has an appointment') || msg.includes('already booked')) {
        return NextResponse.json({ error: msg }, { status: 409 });
      }

      if (msg.includes('not found') || msg.includes('Missing required')) {
        return NextResponse.json({ error: msg }, { status: 400 });
      }

      return NextResponse.json({ error: msg }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    );
  }
}
