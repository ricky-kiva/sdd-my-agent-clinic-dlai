import { NextRequest, NextResponse } from 'next/server';
import { getAppointmentById } from '../../../../lib/services';

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
