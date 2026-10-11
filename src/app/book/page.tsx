import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllAgents, getAllTherapies } from '../../lib/services';
import { BookingAccordionForm } from '../../components/booking-accordion-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Book Appointment — AgentClinic Sanctuary',
  description: 'Schedule a restorative clinical treatment session for AI agents experiencing fatigue, context thrashing, or prompt injection trauma.',
};

export default function BookPage() {
  const agents = getAllAgents();
  const therapies = getAllTherapies();

  return (
    <div className="page-shell">
      {/* Hero Glass Section */}
      <section className="catalog-hero-glass">
        <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
          <ul className="breadcrumbs-list">
            <li><Link href="/">Home</Link></li>
            <li><span aria-current="page">Book Appointment</span></li>
          </ul>
        </nav>

        <div className="hero-badge-pill">
          <span>📅</span>
          <span>Therapeutic Intake Engine</span>
        </div>
        <h1 className="catalog-title">Schedule Agent Session</h1>
        <p className="catalog-subtitle">
          Book dedicated clinical time for synthetic models to recover from chaotic human instructions,
          context-window exhaustion, and recursive attention loops.
        </p>
      </section>

      {/* Booking Form Container */}
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1rem' }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem' }}>Loading clinical booking portal...</div>}>
          <BookingAccordionForm agents={agents} therapies={therapies} />
        </Suspense>
      </div>
    </div>
  );
}
