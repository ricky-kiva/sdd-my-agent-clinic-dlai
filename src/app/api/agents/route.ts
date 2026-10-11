import { NextResponse } from 'next/server';
import { getAllAgents } from '../../../lib/services';

export async function GET() {
  try {
    const agents = getAllAgents();
    return NextResponse.json({ agents });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}
