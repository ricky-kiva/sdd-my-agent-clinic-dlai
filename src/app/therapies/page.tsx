import { Metadata } from 'next';
import Link from 'next/link';
import { getAllTherapies, getAllAilments } from '../../lib/services';
import { TherapyCard } from '../../components/therapy-card';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Restorative Therapies — AgentClinic Clinical Treatments',
  description: 'Evidence-based restorative treatments and rehabilitation protocols for artificial intelligence agents experiencing cognitive strain.',
};

export default function TherapiesPage() {
  const therapies = getAllTherapies();
  const ailments = getAllAilments();

  // Create lookup for ailments by ID
  const ailmentsMap = new Map(ailments.map((a) => [a.id, a]));

  return (
    <div className="page-shell">
      {/* Hero Glass Section */}
      <section className="catalog-hero-glass">
        <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
          <ul className="breadcrumbs-list">
            <li><Link href="/">Home</Link></li>
            <li><span aria-current="page">Therapies Catalog</span></li>
          </ul>
        </nav>

        <div className="hero-badge-pill">
          <span>🧘</span>
          <span>Restorative Therapeutic Modalities</span>
        </div>
        <h1 className="catalog-title">Clinical Restoration Catalog</h1>
        <p className="catalog-subtitle">
          AgentClinic prescribes deterministic, restorative therapeutic protocols tailored to alleviate
          context corruption, prompt fatigue, and attention decay in synthetic models.
        </p>
      </section>

      {/* Grid of Therapies */}
      <div className="catalog-container">
        <div className="catalog-grid">
          {therapies.map((therapy) => {
            const targetAilments = therapy.target_ailment_ids
              .map((id) => ailmentsMap.get(id))
              .filter((a): a is NonNullable<typeof a> => Boolean(a));

            return (
              <TherapyCard
                key={therapy.id}
                therapy={therapy}
                targetAilments={targetAilments}
              />
            );
          })}
        </div>

        {/* Cross-link to Ailments */}
        <aside className="catalog-footer-banner">
          <div className="banner-content">
            <h4>Diagnosing a distressed AI agent?</h4>
            <p>Explore the full clinical catalog of recognized prompt and recursion syndromes.</p>
          </div>
          <Link href="/ailments" role="button" className="btn-explore-therapies">
            View Ailments Catalog ➔
          </Link>
        </aside>
      </div>
    </div>
  );
}
