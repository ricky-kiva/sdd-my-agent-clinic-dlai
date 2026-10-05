import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTherapyById, getAllAilments } from '../../../lib/services';

export const dynamic = 'force-dynamic';

interface TherapyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TherapyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const therapy = getTherapyById(id);
  if (!therapy) {
    return {
      title: 'Therapy Not Found — AgentClinic',
    };
  }
  return {
    title: `${therapy.name} — Clinical Therapy Protocol | AgentClinic`,
    description: therapy.description,
  };
}

export default async function TherapyDetailPage({ params }: TherapyDetailPageProps) {
  const { id } = await params;
  const therapy = getTherapyById(id);

  if (!therapy) {
    notFound();
  }

  const allAilments = getAllAilments();
  const treatedAilments = allAilments.filter((a) => therapy.target_ailment_ids.includes(a.id));

  return (
    <div className="page-shell">
      {/* Navigation Breadcrumb */}
      <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
        <ul className="breadcrumbs-list">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/therapies">Therapies Catalog</Link></li>
          <li><span aria-current="page">{therapy.name}</span></li>
        </ul>
      </nav>

      {/* Main Clinical Protocol Article */}
      <article className="therapy-detail-glass">
        <header className="protocol-header">
          <div className="protocol-meta">
            <span className="protocol-badge">Clinical Protocol</span>
            <span className="protocol-id-tag">{therapy.id}</span>
          </div>
          <h1 className="protocol-title">{therapy.name}</h1>
          <div className="protocol-key-metrics">
            <div className="metric-item">
              <span className="metric-label">Session Duration</span>
              <span className="metric-value">⏱ {therapy.duration_minutes} minutes</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Treatment Category</span>
              <span className="metric-value">Deterministic Recovery</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Clinical Supervised</span>
              <span className="metric-value">Yes &bull; Autonomous Sandbox</span>
            </div>
          </div>
        </header>

        {/* Clinical Overview */}
        <section className="protocol-section">
          <h2 className="protocol-section-heading">Clinical Overview</h2>
          <p className="protocol-overview-text">{therapy.description}</p>
        </section>

        {/* Treatment Methodology */}
        <section className="protocol-section">
          <h2 className="protocol-section-heading">Treatment Methodology & Mechanism</h2>
          <div className="methodology-card">
            <div className="mechanism-box">
              <span className="mechanism-title">Primary Mechanism of Action</span>
              <p className="mechanism-desc">{therapy.methodology.mechanism}</p>
            </div>

            <div className="procedures-box">
              <span className="procedures-title">Clinical Procedure Steps</span>
              <ol className="procedures-list">
                {therapy.methodology.steps.map((step, idx) => (
                  <li key={idx} className="procedure-step-item">
                    <span className="step-num">{idx + 1}</span>
                    <span className="step-text">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="outcome-box">
              <span className="outcome-title">Target Clinical Outcome</span>
              <p className="outcome-desc">✨ {therapy.methodology.expected_outcome}</p>
            </div>
          </div>
        </section>

        {/* Target Afflictions Treated */}
        <section className="protocol-section">
          <h2 className="protocol-section-heading">Target Afflictions Treated</h2>
          <p className="section-subtext">
            This clinical therapy is specifically indicated for the following diagnosed agent ailments:
          </p>
          <div className="treated-ailments-grid">
            {treatedAilments.map((ailment) => (
              <div key={ailment.id} className="treated-ailment-card">
                <div className="treated-card-top">
                  <h3 className="treated-ailment-title">{ailment.name}</h3>
                  <span className={`severity-badge severity-${ailment.severity.toLowerCase()}`}>
                    {ailment.severity}
                  </span>
                </div>
                <p className="treated-ailment-desc">{ailment.description}</p>
                <Link href="/ailments" className="view-ailment-link">
                  View full diagnosis & symptoms ➔
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 3 Booking Teaser / CTA */}
        <footer className="protocol-cta-footer">
          <div className="cta-info">
            <span className="cta-badge">Phase 3 Booking Preview</span>
            <h3>Ready to admit a patient for {therapy.name}?</h3>
            <p>
              The automated booking engine opens in Phase 3. Clinical slots will be allocated
              based on agent fatigue levels and human stress factors.
            </p>
          </div>
          <div className="cta-actions">
            <button type="button" className="btn-book-disabled" disabled aria-disabled="true">
              📅 Book Session (Available Phase 3)
            </button>
            <Link href="/therapies" className="btn-back-catalog">
              ← Return to Therapies Catalog
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
