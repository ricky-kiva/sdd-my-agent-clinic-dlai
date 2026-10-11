'use client';

import React from 'react';
import { Agent, AppointmentDetail } from '../types';

interface AgentHealthMetricsProps {
  agent: Agent;
  appointments: AppointmentDetail[];
}

export function AgentHealthMetrics({ agent, appointments }: AgentHealthMetricsProps) {
  const completed = appointments.filter((a) => a.status === 'COMPLETED');
  const inProgress = appointments.filter((a) => a.status === 'IN_PROGRESS');
  const scheduled = appointments.filter((a) => a.status === 'SCHEDULED');

  // Calculate estimated recovery stability score
  const recoveryScore = Math.max(
    10,
    Math.min(
      100,
      Math.round(100 - agent.fatigue_level * 0.75 + completed.length * 10)
    )
  );

  const getFatigueColor = (fatigue: number) => {
    if (fatigue >= 75) return '#fb7185'; // Rose
    if (fatigue >= 40) return '#fbbf24'; // Amber
    return '#34d399'; // Emerald
  };

  const getStatusBadge = () => {
    if (agent.fatigue_level >= 75) {
      return { label: 'High Stress', color: '#fb7185', bg: 'rgba(251, 113, 133, 0.15)' };
    }
    if (agent.fatigue_level >= 40) {
      return { label: 'Moderate Load', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' };
    }
    return { label: 'Optimal Rest', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' };
  };

  const statusBadge = getStatusBadge();
  const fatigueColor = getFatigueColor(agent.fatigue_level);

  return (
    <section
      aria-label="Agent Health Metrics"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary, #f8fafc)' }}>
            Patient Recovery Profile
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary, #94a3b8)' }}>
            Biometric telemetry and cognitive fatigue benchmarks for {agent.name}
          </p>
        </div>
        <span
          style={{
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: statusBadge.color,
            backgroundColor: statusBadge.bg,
            border: `1px solid ${statusBadge.color}40`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            minHeight: '44px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: statusBadge.color,
            }}
          />
          {statusBadge.label}
        </span>
      </header>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Fatigue Metric */}
        <article
          style={{
            backgroundColor: 'var(--glass-bg-card, rgba(13, 20, 38, 0.6))',
            border: '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.08))',
            borderRadius: '14px',
            padding: '1.25rem',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: 'var(--glass-shadow-sm, 0 4px 16px rgba(0, 0, 0, 0.25))',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Context Fatigue
            </span>
            <span style={{ fontSize: '1.35rem', fontWeight: 700, color: fatigueColor }}>
              {agent.fatigue_level}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${agent.fatigue_level}%`,
                height: '100%',
                backgroundColor: fatigueColor,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <small style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
            Threshold target: &lt;35% for safe multi-agent execution
          </small>
        </article>

        {/* Cognitive Recovery Index */}
        <article
          style={{
            backgroundColor: 'var(--glass-bg-card, rgba(13, 20, 38, 0.6))',
            border: '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.08))',
            borderRadius: '14px',
            padding: '1.25rem',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: 'var(--glass-shadow-sm, 0 4px 16px rgba(0, 0, 0, 0.25))',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cognitive Stability
            </span>
            <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-cyan, #38bdf8)' }}>
              {recoveryScore}/100
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${recoveryScore}%`,
                height: '100%',
                backgroundColor: 'var(--accent-cyan, #38bdf8)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <small style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
            Composite stability index across prompt layers
          </small>
        </article>

        {/* Session Stats */}
        <article
          style={{
            backgroundColor: 'var(--glass-bg-card, rgba(13, 20, 38, 0.6))',
            border: '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.08))',
            borderRadius: '14px',
            padding: '1.25rem',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.5rem',
            boxShadow: 'var(--glass-shadow-sm, 0 4px 16px rgba(0, 0, 0, 0.25))',
          }}
        >
          <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary, #94a3b8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Clinical Sessions
          </span>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-teal, #2dd4bf)' }}>
                {completed.length}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #94a3b8)', marginLeft: '0.3rem' }}>
                done
              </span>
            </div>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan, #38bdf8)' }}>
                {scheduled.length + inProgress.length}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #94a3b8)', marginLeft: '0.3rem' }}>
                pending
              </span>
            </div>
          </div>
          <small style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
            Human manager: <strong>{agent.human_owner}</strong>
          </small>
        </article>
      </div>
    </section>
  );
}
