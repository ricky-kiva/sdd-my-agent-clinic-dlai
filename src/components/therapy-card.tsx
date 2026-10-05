import React from 'react';
import Link from 'next/link';
import { Therapy, Ailment } from '../types';

interface TherapyCardProps {
  therapy: Therapy;
  targetAilments?: Ailment[];
}

export function TherapyCard({ therapy, targetAilments = [] }: TherapyCardProps) {
  return (
    <article className="therapy-card-glass">
      <header className="therapy-card-header">
        <div className="therapy-header-info">
          <span className="therapy-icon-bubble" aria-hidden="true">🧘</span>
          <div>
            <h3 className="therapy-name">{therapy.name}</h3>
            <span className="therapy-id-badge">{therapy.id}</span>
          </div>
        </div>
        <span className="duration-badge">
          ⏱ {therapy.duration_minutes} min
        </span>
      </header>

      <p className="therapy-description">{therapy.description}</p>

      {targetAilments.length > 0 && (
        <div className="therapy-target-ailments">
          <span className="targets-heading">Indicated For Conditions:</span>
          <div className="targets-tags-list">
            {targetAilments.map((ailment) => (
              <Link
                key={ailment.id}
                href="/ailments"
                className="target-ailment-tag"
                title={`Learn more about ${ailment.name}`}
              >
                <span>🔬 {ailment.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <footer className="therapy-card-footer">
        <Link
          href={`/therapies/${therapy.id}`}
          role="button"
          className="btn-view-protocol"
        >
          <span>View Clinical Protocol</span>
          <span aria-hidden="true">➔</span>
        </Link>
      </footer>
    </article>
  );
}
