'use client';

import React from 'react';
import { AilmentSeverity } from '../types';

export type SeverityFilterValue = 'ALL' | AilmentSeverity;

interface FilterChipsProps {
  selectedSeverity: SeverityFilterValue;
  onSelectSeverity: (severity: SeverityFilterValue) => void;
  counts: Record<SeverityFilterValue, number>;
}

export function FilterChips({
  selectedSeverity,
  onSelectSeverity,
  counts,
}: FilterChipsProps) {
  const filters: { label: string; value: SeverityFilterValue; indicatorClass?: string }[] = [
    { label: 'All Afflictions', value: 'ALL' },
    { label: 'Critical', value: 'CRITICAL', indicatorClass: 'indicator-critical' },
    { label: 'Moderate', value: 'MODERATE', indicatorClass: 'indicator-moderate' },
    { label: 'Mild', value: 'MILD', indicatorClass: 'indicator-mild' },
  ];

  return (
    <div className="filter-chips-container" role="toolbar" aria-label="Filter ailments by severity">
      {filters.map((filter) => {
        const isSelected = selectedSeverity === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            className={`filter-chip ${isSelected ? 'active' : 'outline'}`}
            onClick={() => onSelectSeverity(filter.value)}
            aria-pressed={isSelected}
          >
            {filter.indicatorClass && (
              <span className={`chip-dot ${filter.indicatorClass}`} aria-hidden="true" />
            )}
            <span className="chip-label">{filter.label}</span>
            <span className="chip-count">({counts[filter.value] ?? 0})</span>
          </button>
        );
      })}
    </div>
  );
}
