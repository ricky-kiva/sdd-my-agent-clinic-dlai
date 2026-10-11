'use client';

import React, { useState } from 'react';
import { AppointmentDetail, AppointmentStatus, VALID_STATUS_TRANSITIONS } from '../types';

interface ClinicalNotesEditorProps {
  appointment: AppointmentDetail;
  onUpdate: (updated: AppointmentDetail) => void;
  onClose?: () => void;
}

const QUICK_CLINICAL_TAGS = [
  '[Temperature Cooled to 0.1]',
  '[KV Cache Flush Complete]',
  '[Prompt Injection Detox Administered]',
  '[System Directives Re-aligned]',
  '[Restful Dormancy Cycle Executed]',
];

export function ClinicalNotesEditor({
  appointment,
  onUpdate,
  onClose,
}: ClinicalNotesEditorProps) {
  const [notes, setNotes] = useState<string>(appointment.clinical_notes || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const allowedTransitions = VALID_STATUS_TRANSITIONS[appointment.status] || [];

  const handleQuickTagClick = (tag: string) => {
    setNotes((prev) => (prev ? `${prev}\n${tag}` : tag));
  };

  const handleUpdate = async (newStatus?: AppointmentStatus) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessBanner(null);

    try {
      const payload: { status?: AppointmentStatus; clinical_notes?: string } = {};
      if (newStatus && newStatus !== appointment.status) {
        payload.status = newStatus;
      }
      payload.clinical_notes = notes;

      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update appointment record');
      }

      setSuccessBanner(
        newStatus && newStatus !== appointment.status
          ? `Status updated to ${newStatus}`
          : 'Clinical notes updated successfully'
      );

      // Construct updated detail preserving agent and therapy
      const updatedDetail: AppointmentDetail = {
        ...data.appointment,
        agent: appointment.agent,
        therapy: appointment.therapy,
      };

      onUpdate(updatedDetail);
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article
      style={{
        backgroundColor: 'var(--glass-bg-card-highlight, rgba(22, 34, 62, 0.75))',
        border: '1px solid var(--glass-border-highlight, rgba(56, 189, 248, 0.45))',
        borderRadius: '16px',
        padding: '1.5rem',
        margin: 0,
        boxShadow: 'var(--glass-shadow-md, 0 8px 32px rgba(0, 0, 0, 0.37))',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          margin: 0,
          padding: 0,
          border: 'none',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-cyan, #38bdf8)', fontWeight: 600 }}>
            Clinical Session Panel
          </span>
          <h4 style={{ margin: '0.2rem 0 0 0', fontSize: '1.15rem', color: 'var(--text-primary, #f8fafc)' }}>
            {appointment.agent.name} &bull; {appointment.therapy.name}
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--accent-cyan, #38bdf8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            Current Status: {appointment.status}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close clinical panel"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary, #94a3b8)',
                fontSize: '1.25rem',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                minHeight: '44px',
                minWidth: '44px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &times;
            </button>
          )}
        </div>
      </header>

      {/* Patient Triage Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          padding: '0.85rem',
          borderRadius: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          fontSize: '0.85rem',
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted, #64748b)' }}>Model:</span>{' '}
          <strong style={{ color: 'var(--text-primary, #f8fafc)' }}>{appointment.agent.model_family}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted, #64748b)' }}>Owner:</span>{' '}
          <strong style={{ color: 'var(--text-primary, #f8fafc)' }}>{appointment.agent.human_owner}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted, #64748b)' }}>Fatigue:</span>{' '}
          <strong style={{ color: appointment.agent.fatigue_level >= 75 ? '#fb7185' : '#34d399' }}>
            {appointment.agent.fatigue_level}%
          </strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted, #64748b)' }}>Therapy Duration:</span>{' '}
          <strong style={{ color: 'var(--accent-teal, #2dd4bf)' }}>{appointment.therapy.duration_minutes} min</strong>
        </div>
      </div>

      {/* Feedback Banners */}
      {errorMessage && (
        <div
          role="alert"
          style={{
            backgroundColor: 'rgba(251, 113, 133, 0.15)',
            border: '1px solid rgba(251, 113, 133, 0.4)',
            color: '#fb7185',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
          }}
        >
          {errorMessage}
        </div>
      )}

      {successBanner && (
        <div
          role="status"
          style={{
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            color: '#34d399',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
          }}
        >
          ✓ {successBanner}
        </div>
      )}

      {/* Clinical Notes Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="clinical-notes-textarea" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary, #f8fafc)', margin: 0 }}>
          Clinical Diagnosis Notes &amp; Intake Observations:
        </label>
        <textarea
          id="clinical-notes-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Record clinician observations, prompt detox status, or treatment adjustments..."
          style={{
            margin: 0,
            borderRadius: '8px',
            backgroundColor: 'rgba(10, 15, 29, 0.8)',
            color: 'var(--text-primary, #f8fafc)',
            borderColor: 'var(--glass-border-medium, rgba(255, 255, 255, 0.14))',
            fontSize: '0.875rem',
            resize: 'vertical',
            padding: '0.75rem',
          }}
        />

        {/* Quick Tag Insertion Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', alignSelf: 'center', marginRight: '0.2rem' }}>
            Quick Tag:
          </span>
          {QUICK_CLINICAL_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTagClick(tag)}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.55rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary, #94a3b8)',
                cursor: 'pointer',
                minHeight: '36px',
              }}
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Action Controls */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Status Transitions */}
          {allowedTransitions.includes('IN_PROGRESS') && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleUpdate('IN_PROGRESS')}
              style={{
                backgroundColor: 'var(--accent-cyan, #38bdf8)',
                color: '#050811',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              ▶ Start Session (In Progress)
            </button>
          )}

          {allowedTransitions.includes('COMPLETED') && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleUpdate('COMPLETED')}
              style={{
                backgroundColor: 'var(--accent-teal, #2dd4bf)',
                color: '#050811',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              ✓ Complete Therapy Session
            </button>
          )}

          {allowedTransitions.includes('CANCELLED') && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleUpdate('CANCELLED')}
              style={{
                backgroundColor: 'transparent',
                color: '#fb7185',
                border: '1px solid rgba(251, 113, 133, 0.4)',
                fontSize: '0.85rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              Cancel Appointment
            </button>
          )}
        </div>

        {/* Save notes only */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleUpdate()}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--text-primary, #f8fafc)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '0.875rem',
            padding: '0.5rem 1.1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          {isSubmitting ? 'Saving...' : '💾 Save Notes'}
        </button>
      </footer>
    </article>
  );
}
