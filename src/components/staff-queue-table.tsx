'use client';

import React, { useState } from 'react';
import { AppointmentDetail, AppointmentStatus } from '../types';
import { ClinicalNotesEditor } from './clinical-notes-editor';

interface StaffQueueTableProps {
  initialAppointments: AppointmentDetail[];
}

type FilterStatus = 'ALL' | AppointmentStatus;

export function StaffQueueTable({ initialAppointments }: StaffQueueTableProps) {
  const [appointments, setAppointments] = useState<AppointmentDetail[]>(initialAppointments);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedApptId, setSelectedApptId] = useState<string | null>(
    initialAppointments[0]?.id || null
  );

  const handleAppointmentUpdated = (updated: AppointmentDetail) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === updated.id ? updated : appt))
    );
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus =
      statusFilter === 'ALL' ? true : appt.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : appt.agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appt.agent.human_owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appt.therapy.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedAppointment = appointments.find((a) => a.id === selectedApptId) || null;

  const countForStatus = (status: FilterStatus) => {
    if (status === 'ALL') return appointments.length;
    return appointments.filter((a) => a.status === status).length;
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return {
          color: '#38bdf8',
          bg: 'rgba(56, 189, 248, 0.15)',
          border: 'rgba(56, 189, 248, 0.4)',
          label: 'In Progress',
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

  const formatScheduledTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="staff-queue-table-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Controls Bar */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--glass-bg-subtle, rgba(15, 23, 42, 0.45))',
          borderRadius: '12px',
          border: '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.08))',
        }}
      >
        {/* Status Filter Chips */}
        <div
          role="group"
          aria-label="Filter queue by appointment status"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
        >
          {(['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as FilterStatus[]).map((st) => {
            const isSelected = statusFilter === st;
            const count = countForStatus(st);
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  backgroundColor: isSelected ? 'var(--accent-cyan, #38bdf8)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#050811' : 'var(--text-secondary, #94a3b8)',
                  border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                }}
              >
                {st === 'ALL' ? 'All Queue' : st.replace('_', ' ')}
                <span
                  style={{
                    backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div style={{ flex: '1 1 240px', maxWidth: '340px' }}>
          <input
            type="search"
            placeholder="Search patient, owner, therapy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              margin: 0,
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(10, 15, 29, 0.8)',
              color: 'var(--text-primary, #f8fafc)',
              borderColor: 'var(--glass-border-medium, rgba(255, 255, 255, 0.14))',
              fontSize: '0.875rem',
              minHeight: '44px',
            }}
          />
        </div>
      </section>

      {/* Main Grid: Queue on Left/Top, Active Clinical Editor on Right/Bottom */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: selectedAppointment ? 'minmax(0, 1.4fr) minmax(320px, 1fr)' : '1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Queue Items */}
        <section aria-label="Triage Queue">
          {filteredAppointments.length === 0 ? (
            <article
              style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                backgroundColor: 'var(--glass-bg-card, rgba(13, 20, 38, 0.6))',
                borderRadius: '16px',
                border: '1px dashed var(--glass-border-medium, rgba(255, 255, 255, 0.14))',
              }}
            >
              <p style={{ margin: 0, color: 'var(--text-secondary, #94a3b8)' }}>
                No appointments matching the current filter.
              </p>
            </article>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredAppointments.map((appt) => {
                const isSelected = selectedApptId === appt.id;
                const badge = getStatusBadgeStyle(appt.status);

                return (
                  <article
                    key={appt.id}
                    onClick={() => setSelectedApptId(appt.id)}
                    style={{
                      margin: 0,
                      padding: '1rem 1.25rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      backgroundColor: isSelected
                        ? 'rgba(56, 189, 248, 0.08)'
                        : 'var(--glass-bg-card, rgba(13, 20, 38, 0.6))',
                      border: isSelected
                        ? '2px solid var(--accent-cyan, #38bdf8)'
                        : '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.08))',
                      boxShadow: isSelected
                        ? '0 0 20px rgba(56, 189, 248, 0.18)'
                        : 'var(--glass-shadow-sm, 0 4px 16px rgba(0, 0, 0, 0.25))',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      transition: 'all 0.2s ease',
                      minHeight: '44px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ fontSize: '1rem', color: 'var(--text-primary, #f8fafc)' }}>
                          {appt.agent.name}
                        </strong>
                        <small style={{ color: 'var(--text-secondary, #94a3b8)' }}>
                          ({appt.agent.model_family})
                        </small>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>
                        Therapy: <span style={{ color: 'var(--accent-cyan, #38bdf8)' }}>{appt.therapy.name}</span> &bull; Owner: {appt.agent.human_owner}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary, #94a3b8)' }}>
                        <div>{formatScheduledTime(appt.scheduled_time)}</div>
                        <div style={{ fontSize: '0.75rem', color: appt.agent.fatigue_level >= 75 ? '#fb7185' : '#34d399' }}>
                          {appt.agent.fatigue_level}% Fatigue
                        </div>
                      </div>

                      <span
                        style={{
                          padding: '0.25rem 0.65rem',
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

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApptId(appt.id);
                        }}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          backgroundColor: isSelected ? 'var(--accent-cyan, #38bdf8)' : 'rgba(255, 255, 255, 0.08)',
                          color: isSelected ? '#050811' : 'var(--text-primary, #f8fafc)',
                          border: 'none',
                          cursor: 'pointer',
                          minHeight: '44px',
                        }}
                      >
                        {isSelected ? 'Active Panel' : 'Triage &rarr;'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Selected Clinical Notes & Action Panel */}
        {selectedAppointment && (
          <aside aria-label="Clinical Treatment Panel" style={{ position: 'sticky', top: '1rem' }}>
            <ClinicalNotesEditor
              appointment={selectedAppointment}
              onUpdate={handleAppointmentUpdated}
              onClose={() => setSelectedApptId(null)}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
