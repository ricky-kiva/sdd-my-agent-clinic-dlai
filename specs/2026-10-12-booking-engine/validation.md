# Validation: Phase 3 — Booking Engine

## Overview
This document specifies how to verify that the Phase 3 implementation succeeded and is ready to merge into `main`. The validation follows a structured 3-step pipeline.

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
  - No database connection locking or SSR hydration mismatches during server build.

---

## Merge Readiness Checklist
- [ ] Feature branch `feature/booking-engine` is active.
- [ ] New spec directory `specs/2026-10-12-booking-engine/` committed with `requirements.md`, `plan.md`, and `validation.md`.
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm test` passes all Vitest test suites (0 failures).
- [ ] `npm run build` compiles production build without errors.
- [ ] Working tree is clean and ready for review.
