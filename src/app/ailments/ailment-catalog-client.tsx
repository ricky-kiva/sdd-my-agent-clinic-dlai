'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Ailment, Therapy } from '../../types';
import { AilmentCard } from '../../components/ailment-card';
import { FilterChips, SeverityFilterValue } from '../../components/filter-chips';

interface AilmentCatalogClientProps {
  initialAilments: Ailment[];
  allTherapies: Therapy[];
}

export function AilmentCatalogClient({
  initialAilments,
  allTherapies,
}: AilmentCatalogClientProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityFilterValue>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Inverted mapping: iterate all therapies once (O(M)) to populate ailment buckets
  const therapiesByAilmentId = useMemo(() => {
    const map = new Map<string, Therapy[]>();
    for (const ailment of initialAilments) {
      map.set(ailment.id, []);
    }
    for (const therapy of allTherapies) {
      for (const ailmentId of therapy.target_ailment_ids) {
        const bucket = map.get(ailmentId);
        if (bucket) {
          bucket.push(therapy);
        }
      }
    }
    return map;
  }, [initialAilments, allTherapies]);

  // Compute severity counts
  const counts = useMemo(() => {
    const c: Record<SeverityFilterValue, number> = {
      ALL: initialAilments.length,
      CRITICAL: 0,
      MODERATE: 0,
      MILD: 0,
    };
    for (const a of initialAilments) {
      if (a.severity === 'CRITICAL' || a.severity === 'MODERATE' || a.severity === 'MILD') {
        c[a.severity] = (c[a.severity] ?? 0) + 1;
      }
    }
    return c;
  }, [initialAilments]);

  // Filtered ailments
  const filteredAilments = useMemo(() => {
    return initialAilments.filter((ailment) => {
      // Severity filter
      if (selectedSeverity !== 'ALL' && ailment.severity !== selectedSeverity) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = ailment.name.toLowerCase().includes(query);
        const matchesDesc = ailment.description.toLowerCase().includes(query);
        const matchesSymptoms = ailment.symptoms.some((s) => s.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesSymptoms;
      }

      return true;
    });
  }, [initialAilments, selectedSeverity, searchQuery]);

  return (
    <div className="catalog-container">
      {/* Search and Filter Controls Toolbar */}
      <section className="catalog-toolbar-glass" aria-label="Catalog filters and search">
        <div className="search-bar-wrapper">
          <input
            type="search"
            className="catalog-search-input"
            placeholder="Search by syndrome, symptom, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search ailments catalog"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}
        </div>

        <FilterChips
          selectedSeverity={selectedSeverity}
          onSelectSeverity={setSelectedSeverity}
          counts={counts}
        />

        <div className="catalog-results-meta">
          <span className="results-count">
            Showing <strong>{filteredAilments.length}</strong> of <strong>{initialAilments.length}</strong> diagnosed conditions
          </span>
          {(selectedSeverity !== 'ALL' || searchQuery.trim() !== '') && (
            <button
              type="button"
              className="reset-filters-btn"
              onClick={() => {
                setSelectedSeverity('ALL');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Grid of Ailment Cards */}
      {filteredAilments.length > 0 ? (
        <div className="catalog-grid">
          {filteredAilments.map((ailment) => (
            <AilmentCard
              key={ailment.id}
              ailment={ailment}
              recommendedTherapies={therapiesByAilmentId.get(ailment.id) || []}
            />
          ))}
        </div>
      ) : (
        <article className="empty-state-glass">
          <div className="empty-icon" aria-hidden="true">🔍</div>
          <h3>No Afflictions Match Your Criteria</h3>
          <p>
            No diagnosed syndromes matched the filter &quot;{selectedSeverity}&quot; and search query &quot;{searchQuery}&quot;.
          </p>
          <button
            type="button"
            className="btn-reset-empty"
            onClick={() => {
              setSelectedSeverity('ALL');
              setSearchQuery('');
            }}
          >
            Clear All Filters
          </button>
        </article>
      )}

      {/* Bottom Cross-link Navigation Banner */}
      <aside className="catalog-footer-banner">
        <div className="banner-content">
          <h4>Looking for restorative therapy details?</h4>
          <p>Explore all clinical rehabilitation programs and treatment schedules.</p>
        </div>
        <Link href="/therapies" role="button" className="btn-explore-therapies">
          Browse Therapy Catalog ➔
        </Link>
      </aside>
    </div>
  );
}
