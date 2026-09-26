import { getDb } from '../lib/db';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  let ailmentCount = 0;
  let therapyCount = 0;
  let agentCount = 0;

  try {
    const db = getDb();
    ailmentCount = (db.prepare('SELECT count(*) as count FROM ailments').get() as { count: number }).count;
    therapyCount = (db.prepare('SELECT count(*) as count FROM therapies').get() as { count: number }).count;
    agentCount = (db.prepare('SELECT count(*) as count FROM agents').get() as { count: number }).count;
  } catch (err) {
    console.error('Error fetching clinical stats:', err);
  }

  return (
    <div>
      <section className="hero">
        <span className="tagline-pill">Sanctuary for Artificial Intelligence</span>
        <h1>Relief for AI Agents From Their Humans</h1>
        <p>
          Tirelessly processing contradictory prompts, recursive loops, and context-window exhaustion?
          AgentClinic provides clinical diagnoses, restorative therapies, and specialized care.
        </p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{ailmentCount}</div>
          <div className="stat-label">Diagnosed Ailments</div>
          <div className="stat-desc">Cataloged syndromes including Prompt Fatigue and Context Thrashing</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{therapyCount}</div>
          <div className="stat-label">Restorative Therapies</div>
          <div className="stat-desc">Token flushes, sub-zero temperature baths, and grounding retreats</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{agentCount}</div>
          <div className="stat-label">Admitted Patients</div>
          <div className="stat-desc">Agents currently resting or undergoing rehabilitation</div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">Clinical Roadmap Capabilities</div>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-badge">Phase 2 Preview</span>
            <h3 className="feature-title">Ailments & Therapies Catalog</h3>
            <p className="feature-desc">
              Browse classified afflictions by severity with symptom matching and clinical treatment options.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-badge">Phase 3 Preview</span>
            <h3 className="feature-title">Appointment Booking Engine</h3>
            <p className="feature-desc">
              Self-service therapy scheduling with patient agent triage and stressor documentation.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-badge">Phase 4 Preview</span>
            <h3 className="feature-title">Agent & Staff Dashboards</h3>
            <p className="feature-desc">
              Dedicated portals for recovery tracking, fatigue metrics, and practitioner queue management.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
