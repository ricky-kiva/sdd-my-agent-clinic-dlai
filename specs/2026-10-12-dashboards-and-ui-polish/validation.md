# Validation: Phase 4 & 5 — Dashboards & UI Polish (MVP Completion)

## Overview
This document specifies how to verify that the implementation of Phase 4 (Dashboards) and Phase 5 (UI Styling & Polish) succeeded and that the completed MVP is ready to be merged into `main`.

---

## Verification Pipeline

### Step 1: TypeScript Compilation
- **Command**: `npx tsc --noEmit`
- **Criteria**:
  - Exits with return code 0.
  - Zero type errors across all service files, API routes, React components, and test suites.
  - Type integrity verified across `AppointmentStatus`, `UpdateAppointmentDTO`, `AppointmentDetail`, and query parameters.

### Step 2: Automated Vitest Test Suite
- **Command**: `npm test`
- **Criteria**:
  - All test suites pass with 0 failures:
    - `tests/clinic.test.ts` (Phase 1 database, schema, seed, and constraint checks).
    - `tests/catalog-services.test.ts` (Phase 2 ailment and therapy service tests).
    - `tests/booking-services.test.ts` (Phase 3 agent and appointment service tests).
    - `tests/booking-api.test.ts` (Phase 3 booking API route tests).
    - `tests/dashboard-services.test.ts` (Phase 4 status lifecycle, clinical notes, and appointment filtering tests).
    - `tests/dashboard-api.test.ts` (Phase 4 `PATCH /api/appointments/[id]` API handler integration tests).
  - Specific test assertions verified:
    - Status transitions strictly adhere to lifecycle (`SCHEDULED` &rarr; `IN_PROGRESS` &rarr; `COMPLETED`).
    - Illegal state jumps (e.g. `SCHEDULED` &rarr; `COMPLETED`) reject with clear descriptive errors.
    - Clinical notes updates persist to SQLite without overwriting original intake stressors.
    - `PATCH /api/appointments/[id]` returns HTTP 400 for illegal transitions and HTTP 404 for missing IDs.
    - `GET /api/appointments` accurately filters by status and agent ID.

### Step 3: Next.js Production Build
- **Command**: `npm run build`
- **Criteria**:
  - `next build` compiles successfully without runtime warnings or SSR errors.
  - Generates static and dynamic routes cleanly:
    - `/` (Home page)
    - `/ailments` (Ailments catalog)
    - `/therapies` (Therapy catalog)
    - `/therapies/[id]` (Therapy details)
    - `/book` (Booking accordion engine)
    - `/appointments/[id]` (Appointment confirmation)
    - `/dashboard` (Unified Agent & Staff Dashboard)
    - `/api/agents` (API route)
    - `/api/appointments` (API route)
    - `/api/appointments/[id]` (API route)

---

## Manual & Visual Experience Verification

### 1. Unified Dashboard Navigation & Tabs
- Navigate to `/dashboard`.
- Verify the tab switcher operates smoothly between **Agent Patient View** and **Staff Clinical View**.
- Verify query parameters update (`/dashboard?tab=agent` vs `/dashboard?tab=staff`) and deep links restore the selected tab on page refresh.

### 2. Agent Portal Verification
- Select an active agent profile from the demo switcher.
- Confirm upcoming appointments are displayed with accurate therapy and timestamp information.
- Confirm past therapy history displays recorded session notes.
- Verify recovery metrics cards and progress bars render properly.

### 3. Staff Clinical Dashboard Verification
- Verify the triage queue lists appointments.
- Test filter pills (`All`, `Scheduled`, `In Progress`, `Completed`, `Cancelled`).
- Click "Start Session" on a `SCHEDULED` appointment and confirm status transitions to `IN_PROGRESS`.
- Enter diagnosis notes in the clinical notes editor, click "Save Notes" / "Complete Session", and confirm persistence across reload.

### 4. Responsive Design & Touch Audit
- **Mobile (< 640px)**: Ensure no horizontal scrollbar appears, cards stack vertically, and touch targets meet $\ge 44\times 44\text{px}$.
- **Tablet (640px–1024px)**: Ensure 2-column adaptive layout renders cleanly.
- **Desktop (> 1024px)**: Ensure wide container centering, clear typography, and glassmorphic card elevation.

---

## Merge Readiness Checklist
- [ ] Active branch is `mvp`.
- [ ] Spec directory `specs/2026-10-12-dashboards-and-ui-polish/` committed with `requirements.md`, `plan.md`, and `validation.md`.
- [ ] `npx tsc --noEmit` exits with 0 errors.
- [ ] `npm test` passes all Vitest suites (0 failures).
- [ ] `npm run build` compiles production build cleanly.
- [ ] All manual verification steps verified across responsive breakpoints.
