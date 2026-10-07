# Validation: Phase 3 — Booking Engine

## Overview
This document specifies how to verify that the Phase 3 implementation succeeded and is ready to merge into `main`. The validation follows a structured 4-step pipeline.

---

## Verification Pipeline

### Step 1: TypeScript Compilation
- **Command**: `npx tsc --noEmit`
- **Criteria**:
  - Exits with return code 0.
  - Zero type errors across `src/lib/services/`, `src/components/`, `src/app/`, and `tests/`.
  - Type integrity verified across `Appointment`, `CreateAppointmentDTO`, `Agent`, and `Therapy`.

### Step 2: Automated Vitest Test Suite
- **Command**: `npm test`
- **Criteria**:
  - All test suites pass with 0 failures:
    - `tests/clinic.test.ts` (Phase 1 database, schema, seed, and constraint checks).
    - `tests/catalog-services.test.ts` (Phase 2 ailment and therapy service tests).
    - `tests/booking-services.test.ts` (Phase 3 agent and appointment service tests).
    - `tests/booking-api.test.ts` (Phase 3 API route handler integration tests).
  - Specific test assertions verified:
    - `agentService.getAllAgents()` returns active clinic agents.
    - `appointmentService.createAppointment()` generates valid appointment record.
    - Double-booking prevention throws or rejects when scheduling the same agent at identical times.
    - Stressors submitted during booking are correctly preserved in the `clinical_notes` field.
    - `getAvailableSlots()` correctly omits occupied time slots.
    - Invalid request payloads return appropriate HTTP 400 Bad Request responses.
    - Double-booking attempts via API return HTTP 409 Conflict responses.

### Step 3: Next.js Production Build
- **Command**: `npm run build`
- **Criteria**:
  - `next build` compiles successfully without errors or runtime warnings.
  - Generates static and dynamic routes cleanly:
    - `/` (Home page)
    - `/ailments` (Ailment catalog)
    - `/therapies` (Therapy catalog)
    - `/therapies/[id]` (Dynamic therapy details)
    - `/book` (Single-page accordion booking engine)
    - `/appointments/[id]` (Dynamic appointment confirmation receipt)
    - `/api/agents` (API route)
    - `/api/appointments` (API route)
    - `/api/appointments/[id]` (API route)
  - No database connection locking or SSR hydration mismatches.

### Step 4: Multi-Viewport Responsive UI & Ergonomics Audit
- **Criteria**:
  - **Single-Page Accordion Functionality (`/book`)**:
    - Semantic `<details>`/`<summary>` accordion sections expand and collapse smoothly.
    - Touch targets for accordion headers, agent cards, time slot buttons, and submit buttons meet or exceed $44\times 44\text{px}$.
    - Selecting an agent and therapy updates preview and validation state instantly.
    - Form submission redirects to `/appointments/[id]` with confirmation receipt.
  - **Mobile (< 640px)**:
    - Single-column stack for all accordion sections.
    - Agent cards and time slot pickers wrap cleanly with zero horizontal scrollbars.
    - Stressor textarea provides accessible touch focus and does not trigger unintended layout shifts or zoom.
  - **Tablet (640px–1024px)**:
    - Agent cards display in a responsive 2-column grid.
    - Time slot picker displays in a 3-column grid of pill buttons.
  - **Desktop (> 1024px)**:
    - Centered container layout (`max-width: 960px`) with elegant glassmorphism.
    - Hover states and focus rings clearly visible on all interactive elements.
  - **Deep Linking Integration**:
    - Navigating from `/therapies/[id]` via "Book This Therapy" pre-selects the chosen therapy in Section 2 of `/book`.

---

## Merge Readiness Checklist
- [ ] Feature branch `feature/booking-engine` is active.
- [ ] New spec directory `specs/2026-10-07-booking-engine/` committed with `requirements.md`, `plan.md`, and `validation.md`.
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm test` passes all Vitest test suites (0 failures).
- [ ] `npm run build` compiles production build without errors.
- [ ] Single-page accordion form verified on mobile (< 640px), tablet (640px–1024px), and desktop (> 1024px).
- [ ] Zero horizontal overflow across all pages.
- [ ] Working tree is clean and ready for review.
