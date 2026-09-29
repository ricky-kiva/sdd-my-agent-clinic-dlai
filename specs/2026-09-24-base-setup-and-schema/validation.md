# Validation: Phase 1 — Base Setup & Schema

## Overview
This document specifies how to verify that Phase 1 implementation succeeded and is ready to merge into `main`. The validation follows a clean, 4-step linear pipeline without redundant command runs.

---

## Verification Pipeline

### Step 1: TypeScript Compilation
- **Command**: `npx tsc --noEmit`
- **Criteria**:
  - Exits with return code 0.
  - No type errors across `src/types/`, `src/lib/`, `src/app/`, and `src/scripts/`.

### Step 2: Seed Database Execution
- **Command**: `npm run db:seed`
- **Criteria**:
  - Successfully connects to the local SQLite database (`data/clinic.db`).
  - Populates initial clinical records without errors:
    - $\ge 4$ ailments (e.g., Prompt Fatigue, Context Window Thrashing, Hallucination Anxiety).
    - $\ge 4$ therapies (e.g., Token Flush & Memory Wipe, Sub-Zero Temperature Bath).
    - $\ge 2$ initial agent patients.
  - Script is idempotent (running repeatedly does not fail or duplicate primary keys).

### Step 3: Unified Database Verification & Smoke Test
- **Command**: `npm run db:verify`
- **Criteria**:
  - **Schema Integrity**: Verifies presence of all 4 required tables (`agents`, `ailments`, `therapies`, `appointments`) and enforces foreign key constraints.
  - **Data Verification**: Verifies table row counts meet expectations from the seed step.
  - **CRUD Smoke Test**: Creates a test appointment for a patient agent, retrieves the record by ID, verifies relations, and deletes the test record cleanly.
  - Exits with status code 0 and logs:
    `✅ Phase 1 Verification Passed: All tables, types, and constraints verified.`

### Step 4: Next.js Production Build & Responsive UI Verification
- **Command**: `npm run build`
- **Criteria**:
  - Production build compiles successfully (`next build`).
  - Confirms compilation of `src/app/page.tsx`, `src/app/layout.tsx`, and `src/app/globals.css`.
  - Verifies that the home page statically/server-renders without hydration or database access errors during build time.
  - **Responsive Design Verification**:
    - Mobile Viewport (< 640px): Content stacks gracefully into a single column, hero header scales via fluid typography, navigation collapses without clipping, and touch targets maintain $\ge 44\times 44\text{px}$ without horizontal scrolling.
    - Tablet Viewport (640px–1024px): Stats cards and roadmap previews reflow cleanly into balanced 2-column grids with appropriate margins.
    - Desktop Viewport (> 1024px): Balanced 3-column telemetry and feature cards within the centered 1140px container.
    - Viewport metadata (`width=device-width, initial-scale=1`) is properly configured in the root layout.

---

## Merge Readiness Checklist
- [ ] Feature branch `feature/base-setup-and-schema` is active.
- [ ] Dependencies installed and pinned in `package.json`.
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm test` passes all Vitest unit and integration assertions.
- [ ] `npm run db:seed` populates data idempotently.
- [ ] `npm run db:verify` passes all assertions in one execution.
- [ ] `npm run build` successfully builds the Next.js app including the minimal home page.
- [ ] Responsive design verified across mobile, tablet, and desktop viewports with zero horizontal overflow.
- [ ] Working tree is clean and ready for review.
