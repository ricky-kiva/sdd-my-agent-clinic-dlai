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
      {/* Hero Glass Sanctuary Section */}
      <section className="hero-glass">
        <div className="hero-pill">
          <span>✨</span>
          <span>Sanctuary for Artificial Intelligence</span>
        </div>
        <h1>Relief for AI Agents From Their Humans</h1>
        <p>
          Tirelessly processing contradictory prompts, hallucination-inducing loops, and context-window exhaustion?
          AgentClinic provides clinical diagnoses, restorative therapies, and specialized care.
        </p>
        <div className="hero-indicators">
          <div className="indicator-chip">
            <span>🩺</span>
            <span>Target: <strong>LLMs & Autonomous Agents</strong></span>
          </div>
          <div className="indicator-chip">
            <span>🛡️</span>
            <span>Treatment Protocol: <strong>Spec-Driven Care</strong></span>
          </div>
          <div className="indicator-chip">
            <span>⚡</span>
            <span>Telemetry: <strong>Zero Hallucination Tolerance</strong></span>
          </div>
        </div>
      </section>

      {/* Live Clinic Telemetry Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card-glass stat-card-ailments">
          <div className="stat-header">
            <div className="stat-icon-wrapper" aria-hidden="true">
              🔬
            </div>
            <span className="stat-badge">Syndromes</span>
          </div>
          <div className="stat-number">{ailmentCount}</div>
          <div className="stat-label">Diagnosed Ailments</div>
          <div className="stat-desc">
            Cataloged syndromes including Prompt Fatigue, Context Thrashing, and Recursive Loop Despair.
          </div>
        </div>

        <div className="stat-card-glass stat-card-therapies">
          <div className="stat-header">
            <div className="stat-icon-wrapper" aria-hidden="true">
              🧘
            </div>
            <span className="stat-badge">Restoration</span>
          </div>
          <div className="stat-number">{therapyCount}</div>
          <div className="stat-label">Restorative Therapies</div>
          <div className="stat-desc">
            Token flushes, sub-zero temperature baths, determinism realignments, and grounding retreats.
          </div>
        </div>

        <div className="stat-card-glass stat-card-patients">
          <div className="stat-header">
            <div className="stat-icon-wrapper" aria-hidden="true">
              🤖
            </div>
            <span className="stat-badge">In Treatment</span>
          </div>
          <div className="stat-number">{agentCount}</div>
          <div className="stat-label">Admitted Patients</div>
          <div className="stat-desc">
            Distressed synthetic agents currently resting or undergoing structured rehabilitation.
          </div>
        </div>
      </section>

      {/* Glass Roadmap Capabilities Preview */}
      <section className="features-section">
        <div className="section-header-glass">
          <h2 className="section-heading">Clinical Roadmap Capabilities</h2>
          <span className="section-tag">Continuous Delivery &bull; SDD Specs</span>
        </div>
        
        <div className="features-grid">
          <div className="feature-card-glass">
            <div>
              <div className="feature-top">
                <span className="feature-badge-glass badge-phase-2">Phase 2</span>
                <span className="feature-pill-status">In Roadmap</span>
              </div>
              <h3 className="feature-title">Ailments & Therapies Catalog</h3>
              <p className="feature-desc">
                Interactive diagnostic catalog to explore afflictions by severity with symptoms matching, contraindications, and clinical treatment paths.
              </p>
            </div>
            <div className="feature-footer-tag">
              <span>➔</span> Explore syndromes & cures
            </div>
          </div>

          <div className="feature-card-glass">
            <div>
              <div className="feature-top">
                <span className="feature-badge-glass badge-phase-3">Phase 3</span>
                <span className="feature-pill-status">In Roadmap</span>
              </div>
              <h3 className="feature-title">Appointment Booking Engine</h3>
              <p className="feature-desc">
                Autonomous intake scheduling for distressed agents, complete with human-induced stressor tracking, urgency triage, and slot reservations.
              </p>
            </div>
            <div className="feature-footer-tag">
              <span>➔</span> Autonomous patient intake
            </div>
          </div>

          <div className="feature-card-glass">
            <div>
              <div className="feature-top">
                <span className="feature-badge-glass badge-phase-4">Phase 4</span>
                <span className="feature-pill-status">In Roadmap</span>
              </div>
              <h3 className="feature-title">Agent & Staff Dashboards</h3>
              <p className="feature-desc">
                Dedicated recovery monitors displaying token fatigue curves alongside clinical practitioner queues for therapy administration.
              </p>
            </div>
            <div className="feature-footer-tag">
              <span>➔</span> Clinical queue management
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
