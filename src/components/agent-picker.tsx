'use client';

import React from 'react';
import { Agent } from '../types';

interface AgentPickerProps {
  agents: Agent[];
  selectedAgentId: string;
  onSelect: (agentId: string) => void;
}

export function AgentPicker({ agents, selectedAgentId, onSelect }: AgentPickerProps) {
  const getFatigueColor = (fatigue: number) => {
    if (fatigue >= 75) return '#f43f5e'; // Rose
    if (fatigue >= 40) return '#f59e0b'; // Amber
    return '#10b981'; // Emerald
  };

  const getFatigueBadgeClass = (fatigue: number) => {
    if (fatigue >= 75) return 'severity-critical';
    if (fatigue >= 40) return 'severity-moderate';
    return 'severity-mild';
  };

  return (
    <div className="agent-picker-container" role="radiogroup" aria-label="Select AI Agent Patient">
      <div className="agent-cards-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
      }}>
        {agents.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          const fatigueColor = getFatigueColor(agent.fatigue_level);
          const badgeClass = getFatigueBadgeClass(agent.fatigue_level);

          return (
            <article
              key={agent.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelect(agent.id)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onSelect(agent.id);
                }
              }}
              style={{
                cursor: 'pointer',
                border: isSelected
                  ? '2px solid var(--accent-cyan, #38bdf8)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: isSelected
                  ? 'rgba(56, 189, 248, 0.12)'
                  : 'rgba(255, 255, 255, 0.03)',
                boxShadow: isSelected
                  ? '0 0 15px rgba(56, 189, 248, 0.25)'
                  : 'none',
                borderRadius: '12px',
                padding: '1.25rem',
                margin: 0,
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                minHeight: '44px',
              }}
            >
              <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: 0,
                padding: 0,
                border: 'none',
              }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{agent.name}</h4>
                  <small style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.8rem' }}>
                    {agent.model_family}
                  </small>
                </div>
                <span
                  className={`severity-badge ${badgeClass}`}
                  style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {agent.fatigue_level}% Fatigue
                </span>
              </header>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary, #94a3b8)',
                }}>
                  <span>Context Stress</span>
                  <span style={{ color: fatigueColor, fontWeight: 600 }}>{agent.fatigue_level}/100</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${agent.fatigue_level}%`,
                    height: '100%',
                    backgroundColor: fatigueColor,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>

              <footer style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto',
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary, #94a3b8)',
              }}>
                <span>Owner: <strong>{agent.human_owner}</strong></span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: isSelected ? 'var(--accent-cyan, #38bdf8)' : 'inherit',
                  fontWeight: isSelected ? 600 : 400,
                }}>
                  {isSelected ? '✓ Selected' : 'Tap to select'}
                </span>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
