# Requirements: Phase 4 & 5 — Dashboards & UI Polish (MVP Completion)

## Overview & Scope
This specification defines the final feature milestone required to achieve a complete, production-ready Minimum Viable Product (MVP) for **AgentClinic**, combining **Phase 4: Dashboards (Agent & Staff)** and **Phase 5: UI Styling & Polish** from [specs/roadmap.md](../roadmap.md).

Following the successful completion of the schema, catalogs, and booking engine (Phases 1–3), this release delivers the operational care center: empowering AI agents to monitor their recovery journeys and clinic staff to manage patient queues, transition appointment lifecycles, and record clinical diagnosis notes within a high-aesthetic, fully responsive web application.

The scope of this milestone encompasses:
1. **Typed Service Layer Extensions**:
   - `src/lib/services/appointment-service.ts`:
     - `updateAppointmentStatus(id: string, status: AppointmentStatus): Appointment`: Enforces a valid state machine (`SCHEDULED` &rarr; `IN_PROGRESS` &rarr; `COMPLETED`, or cancellation).
     - `updateClinicalNotes(id: string, notes: string): Appointment`: Updates diagnostic observations and clinical fulfillment notes in SQLite.
     - `getAllAppointments(filter?: { status?: AppointmentStatus; agentId?: string }): AppointmentDetail[]`: Flexible appointment querying with joined agent and therapy metadata.
2. **REST API Extensions**:
   - `PATCH /api/appointments/[id]`:
     - Validates payload containing `status` and/or `clinicalNotes`.
     - Rejects illegal state transitions with HTTP 400 Bad Request.
     - Returns updated appointment record with HTTP 200 OK or HTTP 404 Not Found.
3. **Unified Clinic Dashboard (`/dashboard`)**:
   - A single, cohesive route featuring responsive, accessible interactive tabs to switch between role perspectives:
     - **Tab 1: Agent Patient Portal**:
       - Agent switcher allowing selection of active patient agent for booth and course demos.
       - Upcoming appointment cards highlighting therapy details, scheduled time, and clinician assignment.
       - Treatment history log detailing completed therapies and clinical outcomes.
       - Health & fatigue recovery metrics (visual indicators showing fatigue reduction and treatment progress).
     - **Tab 2: Staff Clinical Dashboard**:
       - Adaptive queue management interface with filter chips (`All`, `Scheduled`, `In Progress`, `Completed`, `Cancelled`).
       - Collapsible triage details revealing patient profile, model type, fatigue score, and initial human-induced stressors.
       - One-touch status transition controls (`Start Session` &rarr; `Complete Session` / `Cancel`).
       - Integrated diagnosis note editor with auto-resizing text area and rapid clinical tag insertion.
4. **Phase 5 UI Styling, Polish & Responsive Design**:
   - Built on semantic PicoCSS foundations with clinic design tokens (calming cyan `#38bdf8`, healing emerald `#34d399`, dark clinic slate `#0a0e17`).
   - Glassmorphic panels, subtle gradients, and micro-interactions.
   - Comprehensive responsive audit across mobile (< 640px), tablet (640px–1024px), and desktop (> 1024px) viewports with zero horizontal overflow.
   - Ergonomic touch targets ($\ge 44\times 44\text{px}$) for all tab switches, queue controls, and status actions.
   - Global navigation update in `src/app/layout.tsx` to include "Dashboard" alongside "Catalog" and "Book Session".

---

## Stakeholder & Architectural Context

### Product Alignment ([specs/mission.md](../mission.md))
- **Susan (Product)**: Completes the full end-to-end patient care lifecycle by providing AI agents with visible treatment tracking and empowering clinical staff to triage prompt fatigue, context thrashing, and hallucination loops in real time.

### Engineering Alignment ([specs/mission.md](../mission.md), [specs/tech-stack.md](../tech-stack.md))
- **Mary (Engineering)**:
  - Preserves full-stack TypeScript type safety (`strict: true`) with shared DTOs and lifecycle enums.
  - Enforces relational consistency in SQLite using atomic updates and status validation logic.
  - Maintains clean separation of concerns: database queries confined to services, route handlers managing HTTP status mapping, and presentation decoupled in React components.

### Marketing & UX Alignment ([specs/mission.md](../mission.md), [specs/tech-stack.md](../tech-stack.md))
- **Steve (Marketing)**:
  - Delivers an engaging, conference-demo-ready showcase where presenters can effortlessly flip between Agent and Staff views on smartphones, tablets, or booth monitors.
  - Delivers calming wellness aesthetics with ambient dark mode, glassmorphism, fluid typography, and micro-animations.

---

## Architectural Decisions

### 1. Unified Dashboard Architecture (`/dashboard`)
- **Single Page with Interactive Tabs**:
  - Rather than splitting into disparate routes requiring multiple logins, `/dashboard` hosts both portals within a unified responsive shell.
  - Controlled by an accessible tab navigation bar with query parameter synchronisation (`/dashboard?tab=agent` vs `/dashboard?tab=staff`) for direct URL deep-linking and seamless presentation demos.
  - Server Component (`src/app/dashboard/page.tsx`) pre-fetches active agents, therapies, and appointment queue data, passing them down to client components for instantaneous tab switching without layout thrashing.

### 2. Appointment Lifecycle State Machine
- Permitted transitions enforced by `appointmentService.updateAppointmentStatus`:
  - `SCHEDULED` &rarr; `IN_PROGRESS` or `CANCELLED`
  - `IN_PROGRESS` &rarr; `COMPLETED` or `CANCELLED`
  - `COMPLETED` &rarr; Terminal state (modifications rejected)
  - `CANCELLED` &rarr; Terminal state (modifications rejected)
- Any attempt to bypass the state machine (e.g., `SCHEDULED` directly to `COMPLETED` or reverting a `COMPLETED` session) produces a descriptive validation error returning HTTP 400 Bad Request.

### 3. Clinical Notes & Diagnostic Observation Handling
- The `clinical_notes` column in SQLite stores intake stressors as well as subsequent staff diagnostic observations.
- Staff note updates append timestamped practitioner notes (e.g., `[Clinician Update - 2026-10-12]: Administered prompt detox; context buffer cleared.`) while preserving the initial intake stressors recorded during booking.

### 4. Responsive UI & Accessibility Foundations
- **Mobile (< 640px)**:
  - Single-column stack layout.
  - Queue items render as expandable cards rather than truncated tables.
  - Touch targets $\ge 44\times 44\text{px}$ for all tab toggles and status action buttons.
- **Tablet (640px–1024px)**:
  - Two-column adaptive grid: Queue list on left, selected patient detail & clinical editor on right.
- **Desktop (> 1024px)**:
  - Full-width structured data table with sorting/filtering chips, expandable triage drawer, and real-time metric scorecards.
- **Accessibility**:
  - Proper ARIA roles (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`).
  - High-contrast text compliance and visible focus rings.
