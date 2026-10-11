import { NextRequest, NextResponse } from 'next/server';
import { getAppointmentById, updateAppointment } from '../../../../lib/services';
import { AppointmentStatus } from '../../../../types';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(context.params);
    const appointment = getAppointmentById(id);

    if (!appointment) {
      return NextResponse.json(
        { error: `Appointment not found with id: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(context.params);

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const { status } = body || {};
    const clinicalNotes = body?.clinical_notes ?? body?.clinicalNotes;

    if (status === undefined && clinicalNotes === undefined) {
      return NextResponse.json(
        { error: 'At least one field (status or clinical_notes) must be provided' },
        { status: 400 }
      );
    }

    // Validate status format if provided
    if (status !== undefined) {
      const validStatuses: AppointmentStatus[] = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status: ${status}. Must be one of ${validStatuses.join(', ')}` },
          { status: 400 }
        );
      }
    }

    const existing = getAppointmentById(id);
    if (!existing) {
      return NextResponse.json(
        { error: `Appointment not found with id: ${id}` },
        { status: 404 }
      );
    }

    try {
      const updated = updateAppointment(id, {
        status,
        clinical_notes: clinicalNotes,
      });

      return NextResponse.json({ appointment: updated }, { status: 200 });
    } catch (serviceError) {
      return NextResponse.json(
        { error: (serviceError as Error).message || 'Status transition error' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    );
  }
}

