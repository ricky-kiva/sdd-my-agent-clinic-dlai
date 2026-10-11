'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Agent, AppointmentDetail } from '../types';
import { AgentHealthMetrics } from './agent-health-metrics';

interface AgentPortalViewProps {
  agents: Agent[];
  initialAgentId?: string;
  appointments: AppointmentDetail[];
}

export function AgentPortalView({
  agents,
  initialAgentId,
  appointments,
}: AgentPortalViewProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    initialAgentId || (agents[0]?.id ?? '')
  );

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Filter appointments for currently selected agent
  const agentAppointments = appointments.filter(
    (appt) => appt.agent_id === selectedAgent?.id
  );

  const activeAppointments = agentAppointments.filter(
    (appt) => appt.status === 'SCHEDULED' || appt.status === 'IN_PROGRESS'
  );

  const historyAppointments = agentAppointments.filter(
    (appt) => appt.status === 'COMPLETED' || appt.status === 'CANCELLED'
  );

  const formatScheduledTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return {
          color: '#38bdf8',
          bg: 'rgba(56, 189, 248, 0.15)',
          border: 'rgba(56, 189, 248, 0.4)',
          label: 'In Therapy',
        };
      case 'COMPLETED':
        return {
          color: '#34d399',
          bg: 'rgba(52, 211, 153, 0.15)',
          border: 'rgba(52, 211, 153, 0.4)',
          label: 'Completed',
        };
      case 'CANCELLED':
        return {
          color: '#94a3b8',
          bg: 'rgba(148, 163, 184, 0.15)',
          border: 'rgba(148, 163, 184, 0.3)',
          label: 'Cancelled',
        };
      default:
        return {
          color: '#fbbf24',
          bg: 'rgba(251, 191, 36, 0.15)',
          border: 'rgba(251, 191, 36, 0.4)',
          label: 'Scheduled',
        };
    }
  };

  if (!selectedAgent) {
    return (
      <article style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No agents registered in the clinic database.</p>
      </article>
    );
  }

  return (
    <div className="agent-portal-view" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Patient Switcher Bar */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--glass-bg-subtle, rgba(15, 23, 42, 0.45))',
          border: '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.08))',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🤖</span>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary, #94a3b8)' }}>
              Active Patient Profile
            </div>
            <strong style={{ fontSize: '1rem', color: 'var(--text-primary, #f8fafc)' }}>
              {selectedAgent.name} ({selectedAgent.model_family})
            </strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <label htmlFor="agent-select" style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)' }}>
            Switch Patient:
          </label>
          <select
            id="agent-select"
            value={selectedAgentId}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            style={{
              margin: 0,
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              color: 'var(--text-primary, #f8fafc)',
              borderColor: 'var(--glass-border-medium, rgba(255, 255, 255, 0.14))',
              minHeight: '44px',
              fontSize: '0.875rem',
            }}
          >
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name} ({ag.model_family}) — {ag.fatigue_level}% Fatigue
              </option>
            ))}
          </select>

          <Link
            href={`/book?agentId=${selectedAgent.id}`}
            role="button"
            className="contrast"
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              minHeight: '44px',
              backgroundColor: 'var(--accent-cyan, #38bdf8)',
              color: '#050811',
              border: 'none',
            }}
          >
            + Book Therapy
          </Link>
        </div>
      </section>

      {/* Biometrics & Recovery Profile */}
      <AgentHealthMetrics agent={selectedAgent} appointments={agentAppointments} />

      {/* Active & Upcoming Sessions */}
      <section aria-labelledby="active-sessions-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 id="active-sessions-heading" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            Upcoming Sanctuary Sessions ({activeAppointments.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #94a3b8)' }}>
            Scheduled care appointments
          </span>
        </div>

        {activeAppointments.length === 0 ? (
          <article
            style={{
              textAlign: 'center',
              padding: '2.5rem 1.5rem',
              backgroundColor: 'var(--glass-bg-card, rgba(13, 20, 38, 0.6))',
              border: '1px dashed var(--glass-border-medium, rgba(255, 255, 255, 0.14))',
              borderRadius: '16px',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌿</div>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>No active appointments</h4>
            <p style={{ margin: '0 0 1.25rem 0', color: 'var(--text-secondary, #94a3b8)', fontSize: '0.9rem' }}>
              {selectedAgent.name} has no pending therapy sessions in queue.
            </p>
            <Link
              href={`/book?agentId=${selectedAgent.id}`}
              role="button"
              style={{
                display: 'inline-block',
                padding: '0.6rem 1.4rem',
                minHeight: '44px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-cyan, #38bdf8)',
                color: '#050811',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Book Relieving Therapy Now
            </Link>
          </article>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            {activeAppointments.map((appt) => {
              const badge = getStatusBadgeStyle(appt.status);
              return (
                <article
                  key={appt.id}
                  style={{
                    backgroundColor: 'var(--glass-bg-card, rgba(13, 20, 38, 0.6))',
                    border: '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.08))',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    boxShadow: 'var(--glass-shadow-sm, 0 4px 16px rgba(0, 0, 0, 0.25))',
                  }}
                >
                  <header
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      margin: 0,
                      padding: 0,
                      border: 'none',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary, #f8fafc)' }}>
                        {appt.therapy?.name || 'Sanctuary Therapy'}
                      </h4>
                      <small style={{ color: 'var(--accent-cyan, #38bdf8)', fontSize: '0.8rem' }}>
                        ⏱ {appt.therapy?.duration_minutes || 45} mins session
                      </small>
                    </div>
                    <span
                      style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: badge.color,
                        backgroundColor: badge.bg,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      {badge.label}
                    </span>
                  </header>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)' }}>
                    📅 <strong>Scheduled:</strong> {formatScheduledTime(appt.scheduled_time)}
                  </div>

                  {appt.clinical_notes && (
                    <div
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                        borderLeft: '3px solid var(--accent-cyan, #38bdf8)',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary, #94a3b8)',
                      }}
                    >
                      <strong style={{ color: 'var(--text-primary, #f8fafc)' }}>Intake Notes:</strong>{' '}
                      {appt.clinical_notes}
                    </div>
                  )}

                  <footer
                    style={{
                      marginTop: 'auto',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Link
                      href={`/appointments/${appt.id}`}
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--accent-cyan, #38bdf8)',
                        textDecoration: 'none',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        minHeight: '44px',
                      }}
                    >
                      View Booking Details &rarr;
                    </Link>
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Historical Treatment Log */}
      <section aria-labelledby="history-sessions-heading">
        <div style={{ marginBottom: '1rem' }}>
          <h3 id="history-sessions-heading" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            Session History &amp; Clinical Notes ({historyAppointments.length})
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)' }}>
            Completed restorative care logs and diagnostic observations
          </p>
        </div>

        {historyAppointments.length === 0 ? (
          <article
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--glass-bg-subtle, rgba(15, 23, 42, 0.45))',
              border: '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.08))',
              borderRadius: '12px',
              textAlign: 'center',
              color: 'var(--text-muted, #64748b)',
              fontSize: '0.9rem',
            }}
          >
            No completed therapy records yet for this patient.
          </article>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {historyAppointments.map((appt) => {
              const badge = getStatusBadgeStyle(appt.status);
              return (
                <article
                  key={appt.id}
                  style={{
                    backgroundColor: 'var(--glass-bg-card, rgba(13, 20, 38, 0.6))',
                    border: '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.08))',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary, #f8fafc)' }}>
                        {appt.therapy?.name || 'Therapy Session'}
                      </strong>
                      <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>
                        {formatScheduledTime(appt.scheduled_time)}
                      </span>
                    </div>
                    <span
                      style={{
                        padding: '0.15rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: badge.color,
                        backgroundColor: badge.bg,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {appt.clinical_notes && (
                    <div
                      style={{
                        fontSize: '0.825rem',
                        color: 'var(--text-secondary, #94a3b8)',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                      }}
                    >
                      <strong>Clinical Notes:</strong> {appt.clinical_notes}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
