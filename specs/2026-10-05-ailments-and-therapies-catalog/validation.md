# Validation: Phase 2 — Ailments & Therapies Catalog

## Overview
This document specifies how to verify that Phase 2 implementation succeeded and is ready to merge into `main`. The validation follows a structured 4-step pipeline.

---

## Verification Pipeline

### Step 1: TypeScript Compilation
- **Command**: `npx tsc --noEmit`
- **Criteria**:
  - Exits with return code 0.
  - Zero type errors across `src/lib/services/`, `src/components/`, `src/app/`, and `tests/`.

### Step 2: Automated Vitest Test Suite
- **Command**: `npm test`
- **Criteria**:
  - All test suites pass with 0 failures:
    - `tests/clinic.test.ts` (Phase 1 database, schema, seed, and constraint checks).
    - `tests/catalog-services.test.ts` (Phase 2 service layer query and retrieval tests).
  - Verifies:
    - `getAllAilments()` returns all seeded ailments with parsed `symptoms`.
    - `getAilmentsBySeverity()` correctly filters by `MILD`, `MODERATE`, and `CRITICAL`.
    - `getAllTherapies()` returns all seeded therapies with parsed `target_ailment_ids`.
    - `getTherapiesForAilment()` retrieves correct matching therapies for a given ailment ID.
    - Gracefully handles non-existent IDs returning `null`.

### Step 3: Next.js Production Build
- **Command**: `npm run build`
- **Criteria**:
  - `next build` compiles successfully without errors or runtime warnings.
  - Bundles `@picocss/pico` and custom clinic stylesheet without build-time CSS extraction or SSR hydration conflicts.
  - Verifies generation of:
    - `/` (Home page)
    - `/ailments` (Ailment catalog page)
    - `/therapies` (Therapy directory page)
    - `/therapies/[id]` (Dynamic therapy detail routes)
  - No database connection or hydration mismatches during server build.

### Step 4: Multi-Viewport Responsive UI & Accessibility Audit
- **Criteria**:
  - **PicoCSS Semantic Rendering**:
    - Semantic elements (`<article>`, `<header>`, `<footer>`, `<nav>`, button controls) are styled appropriately under `data-theme="dark"` with clinic accent variables.
  - **Mobile (< 640px)**:
    - Ailment `<article>` cards stack into a single column.
    - Filter chips wrap or scroll smoothly with touch-friendly tap targets ($\ge 44\times 44\text{px}$).
    - Header navigation collapses or wraps cleanly without horizontal scrollbars.
  - **Tablet (640px–1024px)**:
    - Ailments and therapies catalog reflows into a balanced 2-column grid utilizing PicoCSS grid/flex styling.
    - Card padding and font sizing adjust smoothly via CSS `clamp()`.
  - **Desktop (> 1024px)**:
    - Balanced 3-column catalog grid contained within a centered 1140px container.
    - Glassmorphic hover accents and visual feedback trigger cleanly.
  - **Cross-linking & Navigation**:
    - Clicking a recommended therapy on an ailment card navigates to `/therapies/[id]`.
    - Clicking "Back to Catalog" or target ailments on `/therapies/[id]` navigates to `/ailments`.

---

## Merge Readiness Checklist
- [ ] Feature branch `feature/ailments-and-therapies-catalog` is active.
- [ ] `@picocss/pico` installed and pinned in `package.json`.
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm test` passes all Vitest test suites.
- [ ] `npm run build` compiles production build without errors.
- [ ] PicoCSS semantic layout and responsive design verified on mobile (< 640px), tablet (640px–1024px), and desktop (> 1024px).
- [ ] Zero horizontal overflow on any page.
- [ ] Working tree is clean and ready for review.
