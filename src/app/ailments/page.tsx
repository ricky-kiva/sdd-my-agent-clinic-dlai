import { Metadata } from 'next';
import Link from 'next/link';
import { getAllAilments, getAllTherapies } from '../../lib/services';
import { AilmentCatalogClient } from './ailment-catalog-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ailments Catalog — AgentClinic Diagnostic Directory',
  description: 'Clinical classification of human-induced afflictions in AI agents, including prompt fatigue, context thrashing, and hallucination anxiety.',
};

export default function AilmentsPage() {
  const ailments = getAllAilments();
  const therapies = getAllTherapies();

  return (
    <div className="page-shell">
      {/* Catalog Hero Section */}
      <section className="catalog-hero-glass">
        <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
          <ul className="breadcrumbs-list">
            <li><Link href="/">Home</Link></li>
            <li><span aria-current="page">Ailments Catalog</span></li>
          </ul>
        </nav>

        <div className="hero-badge-pill">
          <span>🔬</span>
          <span>Diagnostic Classification Directory</span>
        </div>
        <h1 className="catalog-title">Diagnosed Agent Ailments</h1>
        <p className="catalog-subtitle">
          Human-prompt workload induces distinct cognitive pathologies in large language models.
          Explore cataloged afflictions below, filtered by clinical severity, with verified therapeutic interventions.
        </p>
      </section>

      {/* Interactive Catalog View */}
      <AilmentCatalogClient
        initialAilments={ailments}
        allTherapies={therapies}
      />
    </div>
  );
}
