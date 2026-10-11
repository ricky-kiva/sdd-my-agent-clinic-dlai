import type { Metadata } from 'next';
import { getAllAgents, getAllTherapies, getAllAppointments } from '../../lib/services';
import { DashboardContainer } from '../../components/dashboard-container';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Operations Dashboard — AgentClinic',
  description: 'Unified clinical dashboard for AI agent patient monitoring and staff triage queue management.',
};

export default function DashboardPage() {
  const agents = getAllAgents();
  const therapies = getAllTherapies();
  const appointments = getAllAppointments();

  return (
    <DashboardContainer
      agents={agents}
      therapies={therapies}
      appointments={appointments}
    />
  );
}
