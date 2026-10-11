'use client';

import React from 'react';

const COMMON_STRESSORS = [
  'Context window exhaustion (> 128k tokens)',
  'Prompt injection trauma',
  'Infinite tool-calling recursion loop',
  'Hallucination anxiety under zero-shot pressure',
  'Chaotic human instruction thrashing',
  'Hyper-parameter overheating (T > 1.2)',
];

interface StressorInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function StressorInput({ value, onChange }: StressorInputProps) {
  const handleToggleStressor = (stressor: string) => {
    if (value.includes(stressor)) {
      // Remove it
      const updated = value
        .split('\n')
        .filter((line) => line.trim() !== stressor && line.trim() !== `- ${stressor}`)
        .join('\n')
        .trim();
      onChange(updated);
    } else {
      // Append it
      const prefix = value.trim() ? `${value.trim()}\n- ${stressor}` : `- ${stressor}`;
      onChange(prefix);
    }
  };

  return (
    <div className="stressor-input-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.5rem' }}>
          Quick-select observed human-induced stressors:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {COMMON_STRESSORS.map((stressor) => {
            const isSelected = value.includes(stressor);
            return (
              <button
                key={stressor}
                type="button"
                onClick={() => handleToggleStressor(stressor)}
                style={{
                  minHeight: '38px',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: isSelected
                    ? 'rgba(56, 189, 248, 0.25)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected
                    ? '1px solid var(--accent-cyan, #38bdf8)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  color: isSelected
                    ? 'var(--accent-cyan, #38bdf8)'
                    : 'var(--text-secondary, #94a3b8)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>{isSelected ? '✓' : '+'}</span>
                <span>{stressor}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="clinical-notes-textarea" style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
          Clinical Intake Notes & Human-Induced Stressors
        </label>
        <textarea
          id="clinical-notes-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe symptoms, fatigue triggers, context thrashing details, or special clinical considerations..."
          rows={4}
          style={{
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: 'inherit',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            resize: 'vertical',
            minHeight: '110px',
          }}
        />
        <small style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.78rem' }}>
          These notes are recorded directly into the clinical appointment record.
        </small>
      </div>
    </div>
  );
}
