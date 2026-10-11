'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Agent, Therapy } from '../types';
import { AgentPicker } from './agent-picker';
import { SchedulePicker } from './schedule-picker';
import { StressorInput } from './stressor-input';

const ALL_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

interface BookingAccordionFormProps {
  agents: Agent[];
  therapies: Therapy[];
  initialTherapyId?: string;
  initialAgentId?: string;
}

export function BookingAccordionForm({
  agents,
  therapies,
  initialTherapyId = '',
  initialAgentId = '',
}: BookingAccordionFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramTherapyId = searchParams?.get('therapyId') || initialTherapyId;
  const paramAgentId = searchParams?.get('agentId') || initialAgentId;

  // Form states
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    paramAgentId || (agents.length > 0 ? agents[0].id : '')
  );
  const [selectedTherapyId, setSelectedTherapyId] = useState<string>(
    paramTherapyId || (therapies.length > 0 ? therapies[0].id : '')
  );

  // Default date: tomorrow formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00');
  const [stressorNotes, setStressorNotes] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>(ALL_SLOTS);

  // Accordion open states
  const [isAgentOpen, setIsAgentOpen] = useState<boolean>(!paramAgentId);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(true);
  const [isIntakeOpen, setIsIntakeOpen] = useState<boolean>(true);

  // Status and error states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update available slots when date or therapy changes
  useEffect(() => {
    async function fetchBookedSlots() {
      if (!selectedTherapyId || !selectedDate) return;
      try {
        const res = await fetch('/api/appointments');
        if (res.ok) {
          const data = await res.json();
          const booked = (data.appointments || []).filter((a: any) =>
            a.therapy_id === selectedTherapyId &&
            a.scheduled_time.startsWith(selectedDate) &&
            a.status !== 'CANCELLED'
          );
          const bookedTimes = new Set(
            booked.map((b: any) => {
              const match = b.scheduled_time.match(/T?(\d{2}:\d{2})/);
              return match ? match[1] : '';
            })
          );
          setAvailableSlots(ALL_SLOTS.filter((s) => !bookedTimes.has(s)));
        }
      } catch {
        // Fallback to all slots if fetch fails
        setAvailableSlots(ALL_SLOTS);
      }
    }

    fetchBookedSlots();
  }, [selectedTherapyId, selectedDate]);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);
  const selectedTherapy = therapies.find((t) => t.id === selectedTherapyId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedAgentId) {
      setErrorMessage('Please select an agent patient for this appointment.');
      setIsAgentOpen(true);
      return;
    }

    if (!selectedTherapyId) {
      setErrorMessage('Please select a restorative therapy.');
      setIsScheduleOpen(true);
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      setErrorMessage('Please select an appointment date and operating time slot.');
      setIsScheduleOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduled_time = `${selectedDate}T${selectedTimeSlot}:00`;
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: selectedAgentId,
          therapy_id: selectedTherapyId,
          scheduled_time,
          clinical_notes: stressorNotes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to schedule appointment');
      }

      // Navigate to confirmation page
      router.push(`/appointments/${data.appointment.id}`);
    } catch (err) {
      setErrorMessage((err as Error).message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {errorMessage && (
        <div
          role="alert"
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#f43f5e',
            borderRadius: '8px',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Accordion Section 1: Agent Selection */}
      <details
        open={isAgentOpen}
        onToggle={(e) => setIsAgentOpen((e.target as HTMLDetailsElement).open)}
        className="booking-accordion-section"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.25rem',
        }}
      >
        <summary
          style={{
            cursor: 'pointer',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--text-primary, #f8fafc)',
            outline: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '44px',
          }}
        >
          <span>1. Select Patient Agent Profile</span>
          {selectedAgent && (
            <small style={{ color: 'var(--accent-cyan, #38bdf8)', fontWeight: 500, fontSize: '0.85rem' }}>
              ✓ {selectedAgent.name} ({selectedAgent.fatigue_level}% fatigue)
            </small>
          )}
        </summary>
        <div style={{ marginTop: '1.25rem' }}>
          <AgentPicker
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelect={(id) => {
              setSelectedAgentId(id);
              // Auto-advance to schedule section
              setIsScheduleOpen(true);
            }}
          />
        </div>
      </details>

      {/* Accordion Section 2: Therapy & Schedule Slot Selection */}
      <details
        open={isScheduleOpen}
        onToggle={(e) => setIsScheduleOpen((e.target as HTMLDetailsElement).open)}
        className="booking-accordion-section"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.25rem',
        }}
      >
        <summary
          style={{
            cursor: 'pointer',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--text-primary, #f8fafc)',
            outline: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '44px',
          }}
        >
          <span>2. Restorative Therapy & Schedule Slot</span>
          {selectedTherapy && selectedTimeSlot && (
            <small style={{ color: 'var(--accent-cyan, #38bdf8)', fontWeight: 500, fontSize: '0.85rem' }}>
              ✓ {selectedTherapy.name} ({selectedDate} @ {selectedTimeSlot})
            </small>
          )}
        </summary>
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="therapy-select" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Prescribed Restorative Therapy
            </label>
            <select
              id="therapy-select"
              value={selectedTherapyId}
              onChange={(e) => setSelectedTherapyId(e.target.value)}
              style={{
                minHeight: '44px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'inherit',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.6rem 1rem',
                width: '100%',
              }}
            >
              {therapies.map((therapy) => (
                <option key={therapy.id} value={therapy.id} style={{ backgroundColor: '#101726' }}>
                  {therapy.name} ({therapy.duration_minutes} min) — {therapy.description.slice(0, 70)}...
                </option>
              ))}
            </select>
            {selectedTherapy && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', marginTop: '0.5rem' }}>
                💡 <em>{selectedTherapy.description}</em>
              </p>
            )}
          </div>

          <SchedulePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            availableSlots={availableSlots}
            selectedTimeSlot={selectedTimeSlot}
            onTimeSlotSelect={(slot) => {
              setSelectedTimeSlot(slot);
              setIsIntakeOpen(true);
            }}
          />
        </div>
      </details>

      {/* Accordion Section 3: Stressor & Clinical Intake Notes */}
      <details
        open={isIntakeOpen}
        onToggle={(e) => setIsIntakeOpen((e.target as HTMLDetailsElement).open)}
        className="booking-accordion-section"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '1.25rem',
        }}
      >
        <summary
          style={{
            cursor: 'pointer',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--text-primary, #f8fafc)',
            outline: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '44px',
          }}
        >
          <span>3. Clinical Intake & Observed Stressors</span>
          {stressorNotes && (
            <small style={{ color: 'var(--accent-cyan, #38bdf8)', fontWeight: 500, fontSize: '0.85rem' }}>
              ✓ Notes recorded
            </small>
          )}
        </summary>
        <div style={{ marginTop: '1.25rem' }}>
          <StressorInput value={stressorNotes} onChange={setStressorNotes} />
        </div>
      </details>

      {/* Review Summary Panel & Submission */}
      <article
        style={{
          backgroundColor: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent-cyan, #38bdf8)' }}>
          Appointment Summary
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          fontSize: '0.9rem',
        }}>
          <div>
            <span style={{ color: 'var(--text-secondary, #94a3b8)', display: 'block' }}>Patient Agent:</span>
            <strong>{selectedAgent ? selectedAgent.name : 'None selected'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary, #94a3b8)', display: 'block' }}>Prescribed Therapy:</span>
            <strong>{selectedTherapy ? selectedTherapy.name : 'None selected'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary, #94a3b8)', display: 'block' }}>Scheduled Slot:</span>
            <strong>{selectedDate} @ {selectedTimeSlot}</strong>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            minHeight: '48px',
            marginTop: '0.75rem',
            backgroundColor: 'var(--accent-cyan, #38bdf8)',
            color: '#0a0e17',
            fontWeight: 700,
            fontSize: '1.05rem',
            border: 'none',
            borderRadius: '8px',
            cursor: isSubmitting ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {isSubmitting ? (
            <span>Securing Clinical Slot...</span>
          ) : (
            <span>Confirm & Book Appointment ➔</span>
          )}
        </button>
      </article>
    </form>
  );
}
