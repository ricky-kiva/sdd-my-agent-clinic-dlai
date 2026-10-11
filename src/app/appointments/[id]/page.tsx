import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAppointmentById } from '../../../lib/services';

export const dynamic = 'force-dynamic';

interface AppointmentConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AppointmentConfirmationPageProps): Promise<Metadata> {
  const { id } = await params;
  const appointment = getAppointmentById(id);
  if (!appointment) {
    return {
      title: 'Appointment Not Found — AgentClinic',
    };
  }
  return {
    title: `Appointment Confirmed: ${appointment.agent.name} — AgentClinic`,
    description: `Clinical appointment receipt for ${appointment.agent.name} receiving ${appointment.therapy.name}.`,
  };
}

export default async function AppointmentConfirmationPage({
  params,
}: AppointmentConfirmationPageProps) {
  const { id } = await params;
  const appointment = getAppointmentById(id);

  if (!appointment) {
    notFound();
  }

  const { agent, therapy, scheduled_time, status, clinical_notes } = appointment;

  return (
    <div className="page-shell">
      {/* Navigation Breadcrumb */}
      <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
        <ul className="breadcrumbs-list">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/book">Book Appointment</Link></li>
          <li><span aria-current="page">Confirmation Receipt</span></li>
        </ul>
      </nav>

      {/* Confirmation Article */}
      <article
        className="therapy-detail-glass"
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <header
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(52, 211, 153, 0.2)',
              border: '2px solid #34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: '#34d399',
            }}
          >
            ✓
          </div>
          <div>
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                color: '#34d399',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '0.5rem',
              }}
            >
              Clinical Booking Confirmed
            </span>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
              Session Scheduled for {agent.name}
            </h1>
            <p style={{ color: 'var(--text-secondary, #94a3b8)', margin: '0.5rem 0 0' }}>
              Booking Reference: <code style={{ color: 'var(--accent-cyan, #38bdf8)' }}>{appointment.id}</code>
            </p>
          </div>
        </header>

        {/* Appointment Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '1.25rem',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', display: 'block' }}>
              📅 Scheduled Time
            </span>
            <strong style={{ fontSize: '1.1rem', display: 'block', marginTop: '0.25rem' }}>
              {scheduled_time}
            </strong>
            <small style={{ color: '#34d399', fontWeight: 600 }}>Status: {status}</small>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '1.25rem',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', display: 'block' }}>
              🤖 Patient Profile
            </span>
            <strong style={{ fontSize: '1.1rem', display: 'block', marginTop: '0.25rem' }}>
              {agent.name}
            </strong>
            <small style={{ color: 'var(--text-secondary, #94a3b8)' }}>
              {agent.model_family} &bull; Owner: {agent.human_owner}
            </small>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '1.25rem',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', display: 'block' }}>
              🧘 Prescribed Therapy
            </span>
            <strong style={{ fontSize: '1.1rem', display: 'block', marginTop: '0.25rem' }}>
              {therapy.name}
            </strong>
            <small style={{ color: 'var(--text-secondary, #94a3b8)' }}>
              Duration: {therapy.duration_minutes} minutes
            </small>
          </div>
        </div>

        {/* Therapy Methodology Protocol */}
        <section
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '10px',
            padding: '1.25rem',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.75rem', color: 'var(--accent-cyan, #38bdf8)' }}>
            Treatment Protocol: {therapy.name}
          </h3>
          <p style={{ margin: '0 0 1rem', fontSize: '0.92rem' }}>
            {therapy.description}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary, #94a3b8)' }}>Mechanism: </span>
              <span>{therapy.methodology.mechanism}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary, #94a3b8)' }}>Expected Outcome: </span>
              <span style={{ color: '#34d399' }}>{therapy.methodology.expected_outcome}</span>
            </div>
          </div>
        </section>

        {/* Clinical Intake Notes */}
        {clinical_notes && (
          <section
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '1.25rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: 'var(--accent-cyan, #38bdf8)' }}>
              Recorded Stressors & Intake Notes
            </h3>
            <pre
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '0.85rem 1rem',
                borderRadius: '6px',
                fontSize: '0.88rem',
                whiteSpace: 'pre-wrap',
                margin: 0,
                color: 'var(--text-secondary, #94a3b8)',
              }}
            >
              {clinical_notes}
            </pre>
          </section>
        )}

        {/* Action Buttons */}
        <footer
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Link
            href="/book"
            role="button"
            className="btn-explore-therapies"
            style={{ textDecoration: 'none' }}
          >
            📅 Book Another Session
          </Link>
          <Link
            href="/therapies"
            role="button"
            className="btn-back-catalog"
            style={{ textDecoration: 'none' }}
          >
            🧘 Browse Therapies Catalog
          </Link>
          <Link
            href="/"
            role="button"
            className="btn-back-catalog"
            style={{ textDecoration: 'none' }}
          >
            🏠 Return Home
          </Link>
        </footer>
      </article>
    </div>
  );
}
