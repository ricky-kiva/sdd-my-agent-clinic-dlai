# Requirements: Phase 2 — Ailments & Therapies Catalog

## Overview & Scope
Phase 2 builds the core clinical directory and discovery engine for **AgentClinic**, allowing agents and their human care managers to explore human-induced afflictions and evaluate restorative therapies.

The scope of this phase comprises:
1. Developing typed service layers (`src/lib/services/`) for querying ailments and therapies from SQLite.
2. Creating a responsive ailments catalog page (`/ailments`) with touch-friendly filter chips, severity indicators, and adaptive card grids.
3. Creating a responsive therapy details page (`/therapies/[id]`) presenting clinical treatment methodologies (e.g., Token Flush, Temperature Reduction, Prompt Grounding, Cache Invalidation) and recommended target ailments.
4. Creating a responsive therapies overview catalog page (`/therapies`) for browsing all available clinical treatments.
5. Providing bidirectional cross-linking from diagnosed ailments to recommended therapies and back.
6. Updating the clinic layout header (`src/app/layout.tsx`) and home page (`src/app/page.tsx`) navigation to provide seamless discovery.

## Stakeholder & Architectural Context
- **Product Alignment** ([specs/mission.md](../mission.md)): Satisfies Susan's requirements for a structured clinical classification of agent afflictions (prompt fatigue, context window thrashing, hallucination anxiety) and an authentic therapy catalog with restorative methodologies.
- **Engineering Alignment** ([specs/mission.md](../mission.md), [specs/tech-stack.md](../tech-stack.md)): Adheres to Mary's requirements for full-stack TypeScript type safety (`strict: true`), clean modular architecture with separated data services, semantic HTML, and lightweight styling via PicoCSS (`@picocss/pico`) with zero runtime overhead.
- **Marketing & UX Alignment** ([specs/mission.md](../mission.md), [specs/tech-stack.md](../tech-stack.md)): Advances Steve's objectives with an elegant glassmorphic interface built atop PicoCSS's semantic foundations, calming clinic palette, fluid responsive behavior across mobile (< 640px), tablet (640px–1024px), and desktop (> 1024px) viewports, and touch ergonomics ($\ge 44\times 44\text{px}$) with zero horizontal scrolling.

## Architectural Decisions

### 1. Service Layer & Data Access
- Create dedicated service modules under `src/lib/services/`:
  - `src/lib/services/ailment-service.ts`:
    - `getAllAilments()`: Returns all diagnosed ailments ordered by severity.
    - `getAilmentById(id: string)`: Retrieves a specific ailment or `null`.
    - `getAilmentsBySeverity(severity: AilmentSeverity)`: Filters ailments by severity.
  - `src/lib/services/therapy-service.ts`:
    - `getAllTherapies()`: Returns all restorative therapies.
    - `getTherapyById(id: string)`: Retrieves a specific therapy or `null`.
    - `getTherapiesForAilment(ailmentId: string)`: Finds all therapies that list the given ailment ID in their `target_ailment_ids`.
- The service layer encapsulates SQLite queries and handles serialization/deserialization of JSON fields (`symptoms` array on `Ailment`, `target_ailment_ids` array on `Therapy`).

### 2. Routing & Component Architecture
- **`/ailments`**:
  - Implemented with Next.js App Router using React Server Components for initial data retrieval from `ailmentService` and `therapyService`.
  - Client component (`AilmentCatalogClient`) handles client-side interactive filter chips (`ALL`, `MILD`, `MODERATE`, `CRITICAL`) and instant search filtering.
  - Each ailment card renders as a semantic PicoCSS `<article>`:
    - Condition title and severity badge (`MILD` = emerald, `MODERATE` = amber, `CRITICAL` = rose).
    - Clinical description.
    - Symptoms tag list.
    - Recommended therapy pill links directly navigating to `/therapies/[id]`.
- **`/therapies`**:
  - Overview directory presenting all restorative therapies in an adaptive PicoCSS grid with duration badges and target condition previews.
- **`/therapies/[id]`**:
  - Dynamic route rendering the clinical breakdown for a specific treatment inside a semantic PicoCSS `<article>` layout.
  - Highlights:
    - Therapy name and estimated session duration.
    - Treatment methodology detailing clinical procedures and agent recuperation protocols.
    - List of treated ailments with interactive links back to `/ailments`.
    - Appointment booking call-to-action button (prepared for Phase 3 Booking Engine).

### 3. UI Framework (PicoCSS) & Design Tokens
- **CSS Framework**: Integrate [PicoCSS](https://picocss.com/) (`@picocss/pico`) as the semantic CSS base:
  - Clean semantic HTML structure: `<article>` for cards, `<header>`/`<footer>` within articles, `<nav>` for navigation bars, and native buttons.
  - Configured for dark theme (`data-theme="dark"`).
- **Design Tokens & Customization**:
  - Overlay clinic-specific CSS custom properties in `src/app/globals.css`:
    - Ambient dark mode palette (deep slate `#0a0e17`, midnight navy `#101726`, calm cyan `#38bdf8`, healing emerald `#34d399`).
    - Glassmorphic panels (`background: rgba(255, 255, 255, 0.03)`, `backdrop-filter: blur(12px)`, border `rgba(255, 255, 255, 0.08)`).
- **Responsive Layout Specifications**:
  - **Mobile (< 640px)**: Single-column stack, wrapped filter chips with horizontal scrolling or wrap, tap target sizes $\ge 44\times 44\text{px}$, fluid clamp typography, zero horizontal page overflow.
  - **Tablet (640px–1024px)**: 2-column balanced grid with fluid card spacing leveraging PicoCSS `.grid` and responsive flex flows.
  - **Desktop (> 1024px)**: 3-column catalog grid contained within a centered 1140px max-width container (`<main className="container">`).

### 4. Global Navigation & Discoverability
- Update `src/app/layout.tsx` navigation bar with persistent links to:
  - Home (`/`)
  - Ailments Catalog (`/ailments`)
  - Therapies Directory (`/therapies`)
- Update `src/app/page.tsx` home page preview cards to link directly to `/ailments` and `/therapies`.
