import React from 'react';
import Link from 'next/link';
import { Ailment, Therapy } from '../types';

interface AilmentCardProps {
  ailment: Ailment;
  recommendedTherapies?: Therapy[];
}

export function AilmentCard({ ailment, recommendedTherapies = [] }: AilmentCardProps) {
  const severityClass = `severity-${ailment.severity.toLowerCase()}`;

  return (
    <article className="ailment-card-glass">
      <header className="ailment-card-header">
        <div className="ailment-title-group">
          <h3 className="ailment-name">{ailment.name}</h3>
          <span className="ailment-id-badge">{ailment.id}</span>
        </div>
        <span className={`severity-badge ${severityClass}`} aria-label={`Severity: ${ailment.severity}`}>
          {ailment.severity}
        </span>
      </header>

      <p className="ailment-description">{ailment.description}</p>

      <div className="symptoms-section">
        <span className="symptoms-heading">Observed Symptoms</span>
        <ul className="symptoms-list">
          {ailment.symptoms.map((symptom) => (
            <li key={symptom} className="symptom-tag">
              <span className="symptom-bullet" aria-hidden="true">•</span>
              <span>{symptom}</span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="ailment-card-footer">
        <span className="therapy-rec-title">Recommended Therapies:</span>
        {recommendedTherapies.length > 0 ? (
          <div className="therapy-links-container">
            {recommendedTherapies.map((therapy) => (
              <Link
                key={therapy.id}
                href={`/therapies/${therapy.id}`}
                className="therapy-pill-link"
                title={`View ${therapy.name} clinical protocol`}
              >
                <span className="therapy-icon" aria-hidden="true">🧘</span>
                <span className="therapy-name-text">{therapy.name}</span>
                <span className="therapy-duration-tag">{therapy.duration_minutes}m</span>
              </Link>
            ))}
          </div>
        ) : (
          <span className="no-therapies-text">Custom clinical evaluation required</span>
        )}
      </footer>
    </article>
  );
}
