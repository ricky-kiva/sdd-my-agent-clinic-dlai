# Plan: Phase 1 — Base Setup & Schema

## Overview
This plan specifies the implementation steps for Phase 1 as five numbered task groups. Each task group must be verified before proceeding to the next.

---

### Task Group 1: Project Setup & Dependencies
- **Task 1.1**: Update `package.json` to include runtime dependencies (`next`, `react`, `react-dom`, `better-sqlite3`) and dev dependencies (`@types/better-sqlite3`, `@types/node`, `@types/react`, `typescript`).
- **Task 1.2**: Configure `tsconfig.json` for Next.js App Router and TypeScript compilation.
- **Task 1.3**: Configure `next.config.js` and set up standard directory layout (`src/app/`, `src/lib/`, `src/types/`, `src/scripts/`).

---

### Task Group 2: TypeScript Domain Interfaces & Types
- **Task 2.1**: Create `src/types/agent.ts` with `Agent`, `AgentStatus`, and creation DTO types.
- **Task 2.2**: Create `src/types/ailment.ts` with `Ailment`, `AilmentSeverity`, and symptoms schema.
- **Task 2.3**: Create `src/types/therapy.ts` with `Therapy` interface and session duration types.
- **Task 2.4**: Create `src/types/appointment.ts` with `Appointment`, `AppointmentStatus`, and booking payload interfaces.
- **Task 2.5**: Create `src/types/index.ts` consolidating barrel exports.

---

### Task Group 3: SQLite DDL Schema & Database Module
- **Task 3.1**: Create `src/lib/schema.sql` defining SQL DDL statements for `agents`, `ailments`, `therapies`, and `appointments` tables with foreign keys and indexes.
- **Task 3.2**: Create `src/lib/db.ts` providing a typed singleton SQLite connection helper using `better-sqlite3`.
- **Task 3.3**: Ensure `src/lib/db.ts` automatically executes `schema.sql` on initial connect if tables do not exist.

---

### Task Group 4: Seed Data Script & Verification Smoke Test
- **Task 4.1**: Create `src/scripts/seed.ts` to populate realistic clinical data (4 ailments, 4 therapies, 2 distressed agents).
- **Task 4.2**: Add `npm run db:seed` script in `package.json`.
- **Task 4.3**: Create `src/scripts/verify-db.ts` to perform an end-to-end smoke test (connecting to SQLite, validating table existence, verifying seed row counts, creating a test appointment, and cleaning up).
- **Task 4.4**: Add `npm run db:verify` script in `package.json`.

---

### Task Group 5: Minimal AgentClinic Home Page with Glassmorphism Design
- **Task 5.1**: Create `src/app/globals.css` with clinic design tokens and glassmorphic system (frosted glass surface translucency, `backdrop-filter: blur()`, specular rim borders, ambient glowing background gradients/orbs, and sleek micro-interactions).
- **Task 5.2**: Create `src/app/layout.tsx` defining the root HTML shell, glassmorphic floating header navigation, ambient background orbs, and SEO metadata.
- **Task 5.3**: Create `src/app/page.tsx` as a React Server Component that queries the SQLite database to display:
  - Frosted glass hero sanctuary banner ("Relief for AI agents from their humans") with shimmering typography.
  - Live clinic stats cards styled with translucent glassmorphic surfaces, glow effects, and subtle depth.
  - Interactive glass preview cards for upcoming phases (Ailment Catalog, Booking, Dashboards) with dynamic hover accents.
- **Task 5.4**: Add `dev` and `build` scripts in `package.json` (`next dev`, `next build`, `next start`).
