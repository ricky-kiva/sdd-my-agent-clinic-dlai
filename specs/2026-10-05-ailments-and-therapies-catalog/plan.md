# Plan: Phase 2 — Ailments & Therapies Catalog

## Overview
This plan specifies the implementation steps for Phase 2 structured into five numbered task groups. Each task group must be verified before proceeding to the subsequent group.

---

### Task Group 1: PicoCSS Setup & Typed Service Layer
- **Task 1.1**: Install `@picocss/pico` dependency in `package.json` and configure PicoCSS in `src/app/globals.css` with dark theme (`data-theme="dark"`) and AgentClinic glassmorphic design token overrides.
- **Task 1.2**: Create `src/lib/services/ailment-service.ts` to query the SQLite `ailments` table:
  - Implement `getAllAilments(): Ailment[]`.
  - Implement `getAilmentById(id: string): Ailment | null`.
  - Implement `getAilmentsBySeverity(severity: AilmentSeverity): Ailment[]`.
  - Safely deserialize JSON `symptoms` field into strongly typed string arrays.
- **Task 1.3**: Create `src/lib/services/therapy-service.ts` to query the SQLite `therapies` table:
  - Implement `getAllTherapies(): Therapy[]`.
  - Implement `getTherapyById(id: string): Therapy | null`.
  - Implement `getTherapiesForAilment(ailmentId: string): Therapy[]`.
  - Safely deserialize JSON `target_ailment_ids` field into strongly typed string arrays.
- **Task 1.4**: Create `src/lib/services/index.ts` consolidating barrel exports for clean service consumption.

---

### Task Group 2: Ailments Catalog Page & Interactive Filter Components (PicoCSS)
- **Task 2.1**: Create `src/components/ailment-card.tsx` rendering as a semantic PicoCSS `<article>` with `<header>` (title & severity badge), body (clinical description & symptoms tags), and `<footer>` (recommended therapy button links).
- **Task 2.2**: Create `src/components/filter-chips.tsx` using PicoCSS button groups / button styles providing touch-friendly, accessible filter chips ($\ge 44\times 44\text{px}$) with active state styling.
- **Task 2.3**: Create `src/app/ailments/ailment-catalog-client.tsx` managing client-side filter state and search input within a PicoCSS container and adaptive grid layout.
- **Task 2.4**: Create `src/app/ailments/page.tsx` as a React Server Component fetching data via `ailmentService` and rendering the catalog shell and client filter view.

---

### Task Group 3: Therapy Details & Catalog Page Components (PicoCSS)
- **Task 3.1**: Create `src/components/therapy-card.tsx` as a semantic PicoCSS `<article>` displaying therapy name, duration badge, description snippet, and target ailment preview tags.
- **Task 3.2**: Create `src/app/therapies/[id]/page.tsx` as a dynamic server route:
  - Structured with PicoCSS semantic layout (`<article>`, `<header>`, treatment methodology procedures, and linked ailments grid).
  - Provide back navigation to `/ailments` or `/therapies` and a styled booking CTA button teasing Phase 3.
- **Task 3.3**: Create `src/app/therapies/page.tsx` as a catalog overview page displaying all available restorative therapies in a PicoCSS grid layout.

---

### Task Group 4: Global Navigation & Cross-Linking Integration
- **Task 4.1**: Update `src/app/layout.tsx` navigation bar using PicoCSS semantic `<nav>` and list structure with links to `/ailments` and `/therapies` and active link indicators.
- **Task 4.2**: Update `src/app/page.tsx` hero badges and phase preview cards to align with PicoCSS semantics and link to `/ailments` and `/therapies`.
- **Task 4.3**: Verify bidirectional linking between ailments and recommended therapies across all viewports.

---

### Task Group 5: Automated Testing & Verification Suite
- **Task 5.1**: Create `tests/catalog-services.test.ts` covering:
  - `getAllAilments`, `getAilmentById`, and `getAilmentsBySeverity`.
  - `getAllTherapies`, `getTherapyById`, and `getTherapiesForAilment`.
  - JSON parsing integrity and edge cases (unknown ID, invalid severity).
- **Task 5.2**: Run full test suite with `npm test` verifying all Phase 1 and Phase 2 assertions pass.
- **Task 5.3**: Run `npx tsc --noEmit` and `npm run build` to verify Next.js production build and page prerendering with PicoCSS bundled cleanly.
