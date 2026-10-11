'use client';

import React from 'react';

const DEFAULT_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

interface SchedulePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableSlots: string[];
  selectedTimeSlot: string;
  onTimeSlotSelect: (slot: string) => void;
  allSlots?: string[];
}

export function SchedulePicker({
  selectedDate,
  onDateChange,
  availableSlots,
  selectedTimeSlot,
  onTimeSlotSelect,
  allSlots = DEFAULT_SLOTS,
}: SchedulePickerProps) {
  return (
    <div className="schedule-picker-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label htmlFor="booking-date" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
          Select Date
        </label>
        <input
          id="booking-date"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          style={{
            minHeight: '44px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: 'inherit',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '0.6rem 1rem',
            width: '100%',
            maxWidth: '320px',
          }}
        />
      </div>

      <div>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
          Available Clinical Slots ({selectedDate || 'Select a date'})
        </label>
        <div
          role="radiogroup"
          aria-label="Available Time Slots"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '0.65rem',
          }}
        >
          {allSlots.map((slot) => {
            const isAvailable = availableSlots.includes(slot);
            const isSelected = selectedTimeSlot === slot;

            return (
              <button
                key={slot}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={!isAvailable}
                onClick={() => isAvailable && onTimeSlotSelect(slot)}
                style={{
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.95rem',
                  fontWeight: isSelected ? 700 : 500,
                  borderRadius: '8px',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  border: isSelected
                    ? '2px solid var(--accent-cyan, #38bdf8)'
                    : isAvailable
                    ? '1px solid rgba(255, 255, 255, 0.15)'
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  backgroundColor: isSelected
                    ? 'rgba(56, 189, 248, 0.2)'
                    : isAvailable
                    ? 'rgba(255, 255, 255, 0.04)'
                    : 'rgba(0, 0, 0, 0.2)',
                  color: isSelected
                    ? 'var(--accent-cyan, #38bdf8)'
                    : isAvailable
                    ? 'inherit'
                    : 'rgba(255, 255, 255, 0.3)',
                  opacity: isAvailable ? 1 : 0.45,
                  textDecoration: isAvailable ? 'none' : 'line-through',
                }}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
