'use client';

import React, { useState, useEffect } from 'react';
import { Agent, Therapy, AppointmentDetail } from '../types';
import { AgentPortalView } from './agent-portal-view';
import { StaffQueueTable } from './staff-queue-table';

interface DashboardContainerProps {
  agents: Agent[];
  therapies: Therapy[];
  appointments: AppointmentDetail[];
}

type TabType = 'agent' | 'staff';

export function DashboardContainer({
  agents,
  appointments,
}: DashboardContainerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('agent');

  useEffect(() => {
    // Synchronize initial tab from URL query param if present
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'staff' || tabParam === 'agent') {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.75rem',
          backgroundColor: 'var(--glass-bg-card, rgba(13, 20, 38, 0.6))',
          border: '1px solid var(--glass-border-subtle, rgba(255, 255, 255, 0.08))',
          borderRadius: '16px',
          boxShadow: 'var(--glass-shadow-md, 0 8px 32px rgba(0, 0, 0, 0.37))',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.2rem 0.65rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--accent-cyan, #38bdf8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              marginBottom: '0.5rem',
            }}
          >
            <span>●</span> Operations &amp; Recovery Hub
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>
            AgentClinic Portal
          </h1>
          <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-secondary, #94a3b8)', fontSize: '0.95rem' }}>
            Unified command sanctuary for synthetic patients and attending clinical practitioners.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div
          role="tablist"
          aria-label="Dashboard role selector"
          style={{
            display: 'inline-flex',
            padding: '0.35rem',
            borderRadius: '12px',
            backgroundColor: 'rgba(10, 15, 29, 0.9)',
            border: '1px solid var(--glass-border-medium, rgba(255, 255, 255, 0.14))',
            gap: '0.35rem',
          }}
        >
          <button
            type="button"
            role="tab"
            id="tab-agent"
            aria-selected={activeTab === 'agent'}
            aria-controls="panel-agent"
            onClick={() => handleTabChange('agent')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '9px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              minHeight: '44px',
              transition: 'all 0.2s ease',
              backgroundColor: activeTab === 'agent' ? 'var(--accent-cyan, #38bdf8)' : 'transparent',
              color: activeTab === 'agent' ? '#050811' : 'var(--text-secondary, #94a3b8)',
              boxShadow: activeTab === 'agent' ? '0 0 16px rgba(56, 189, 248, 0.35)' : 'none',
            }}
          >
            <span>🤖</span>
            <span>Agent Patient View</span>
          </button>

          <button
            type="button"
            role="tab"
            id="tab-staff"
            aria-selected={activeTab === 'staff'}
            aria-controls="panel-staff"
            onClick={() => handleTabChange('staff')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '9px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              minHeight: '44px',
              transition: 'all 0.2s ease',
              backgroundColor: activeTab === 'staff' ? 'var(--accent-teal, #2dd4bf)' : 'transparent',
              color: activeTab === 'staff' ? '#050811' : 'var(--text-secondary, #94a3b8)',
              boxShadow: activeTab === 'staff' ? '0 0 16px rgba(45, 212, 191, 0.35)' : 'none',
            }}
          >
            <span>🩺</span>
            <span>Staff Clinical View</span>
          </button>
        </div>
      </header>

      {/* Tab Panels */}
      <main>
        {activeTab === 'agent' ? (
          <div
            id="panel-agent"
            role="tabpanel"
            aria-labelledby="tab-agent"
            tabIndex={0}
          >
            <AgentPortalView
              agents={agents}
              appointments={appointments}
            />
          </div>
        ) : (
          <div
            id="panel-staff"
            role="tabpanel"
            aria-labelledby="tab-staff"
            tabIndex={0}
          >
            <StaffQueueTable initialAppointments={appointments} />
          </div>
        )}
      </main>
    </div>
  );
}
