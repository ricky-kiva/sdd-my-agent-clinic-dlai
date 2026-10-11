# Plan: Phase 4 & 5 — Dashboards & UI Polish (MVP Completion)

## Overview
This plan specifies the step-by-step implementation tasks required to deliver the unified Agent and Staff Dashboards along with full responsive UI polish, completing the MVP for AgentClinic. Work is partitioned into five sequential task groups.

---

### Task Group 1: Service Layer Extensions & REST API Updates
- **Task 1.1**: Update `src/types/appointment.ts`:
  - Add `UpdateAppointmentDTO` interface (`{ status?: AppointmentStatus; clinicalNotes?: string }`).
  - Add type definition for valid status transition map.
- **Task 1.2**: Extend `src/lib/services/appointment-service.ts`:
  - Implement `updateAppointmentStatus(id: string, status: AppointmentStatus): Appointment` enforcing state machine rules (`SCHEDULED` &rarr; `IN_PROGRESS` / `CANCELLED`, `IN_PROGRESS` &rarr; `COMPLETED` / `CANCELLED`).
  - Implement `updateClinicalNotes(id: string, notes: string): Appointment` appending/updating diagnosis notes in SQLite.
  - Implement `getAllAppointments(filter?: { status?: AppointmentStatus; agentId?: string }): (Appointment & { agent: Agent; therapy: Therapy })[]` returning appointments joined with agent and therapy details.
- **Task 1.3**: Extend REST API Route Handlers:
  - Add `PATCH` handler to `src/app/api/appointments/[id]/route.ts`:
    - Parses JSON body validating `status` and `clinicalNotes`.
    - Handles status lifecycle errors returning HTTP 400.
    - Returns HTTP 404 for non-existent appointments and HTTP 200 with updated appointment record.
  - Update `GET /api/appointments/route.ts` to support optional query parameter filtering (`?status=...&agentId=...`).

---

### Task Group 2: Agent Patient Portal Components & Recovery Metrics
- **Task 2.1**: Create `src/components/agent-health-metrics.tsx`:
  - Renders visual recovery scorecards and progress bars using PicoCSS semantic `<progress>` and badges.
  - Displays agent fatigue reduction level, attended session count, and therapeutic adherence score.
- **Task 2.2**: Create `src/components/agent-portal-view.tsx`:
  - Client component featuring:
    - Agent profile switcher to select the active patient agent during demonstrations.
    - Card feed of upcoming appointments with status pill, therapy methodology details, and scheduled date/time.
    - Historical treatment log showing completed sessions and clinician diagnosis notes.
    - Quick CTA button linking to `/book?agentId=[id]` to schedule follow-up therapies.

---

### Task Group 3: Staff Clinical Dashboard & Patient Queue Management
- **Task 3.1**: Create `src/components/staff-queue-table.tsx`:
  - Renders patient intake queue with interactive filter pills (`All`, `Scheduled`, `In Progress`, `Completed`, `Cancelled`).
  - Adapts across viewports: structured responsive table on desktop (> 1024px) and expandable card list on mobile (< 640px) / tablet.
  - Displays patient agent identity, model family, fatigue indicator, scheduled therapy, and intake stressors.
- **Task 3.2**: Create `src/components/clinical-notes-editor.tsx`:
  - Collapsible clinical session panel for active appointments.
  - Auto-resizing `<textarea>` for recording diagnosis notes.
  - Quick-insert clinical tag buttons for fast entry during booth demos (e.g., `[Temperature Cool-down 0.2]`, `[Prompt Detox Complete]`, `[Context Cleared]`).
  - Action buttons triggering status updates:
    - `Start Session` (`SCHEDULED` &rarr; `IN_PROGRESS`)
    - `Complete Session` (`IN_PROGRESS` &rarr; `COMPLETED`)
    - `Cancel Appointment` (`CANCELLED`)
  - Submits updates via `PATCH /api/appointments/[id]` with optimistic UI feedback.

---

### Task Group 4: Unified Dashboard Assembly, Global Navigation & UI Polish
- **Task 4.1**: Create `src/components/dashboard-container.tsx`:
  - Interactive client shell hosting the role switcher tab bar (`[Agent Patient View]` vs `[Staff Clinical View]`).
  - Implements accessible ARIA tab patterns (`role="tablist"`, `role="tab"`, `aria-selected`).
  - Synchronizes tab selection with URL query parameter (`/dashboard?tab=agent` | `staff`).
- **Task 4.2**: Create `src/app/dashboard/page.tsx`:
  - React Server Component fetching active agents, therapies, and appointments.
  - Passes data into `DashboardContainer`.
- **Task 4.3**: Global Navigation & Phase 5 UI Polish:
  - Update `src/app/layout.tsx` to add "Dashboard" to header navigation.
  - Update `src/app/page.tsx` hero section with direct links to the new dashboard.
  - Responsive audit across breakpoints: verify mobile (< 640px), tablet (640px–1024px), and desktop (> 1024px) layout integrity.
  - Ensure all touch targets meet $\ge 44\times 44\text{px}$.
  - Polish glassmorphism effects, focus visible states, and micro-animations.

---

### Task Group 5: Automated Test Suite & Build Verification
- **Task 5.1**: Create `tests/dashboard-services.test.ts`:
  - Test `updateAppointmentStatus`: valid transitions (`SCHEDULED` &rarr; `IN_PROGRESS` &rarr; `COMPLETED`), rejection of invalid transitions (`SCHEDULED` &rarr; `COMPLETED`), and non-existent appointment handling.
  - Test `updateClinicalNotes`: diagnosis note persistence in SQLite.
  - Test `getAllAppointments` with status and agent filters.
- **Task 5.2**: Create `tests/dashboard-api.test.ts`:
  - Test `PATCH /api/appointments/[id]`: successful status update (200), successful notes update (200), invalid transition rejection (400), not found response (404).
  - Test `GET /api/appointments` query parameter filters.
- **Task 5.3**: Run verification pipeline:
  - `npx tsc --noEmit`
  - `npm test`
  - `npm run build`
