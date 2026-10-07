# Requirements: Phase 3 — Booking Engine

## Overview & Scope
Phase 3 implements the interactive appointment booking engine for **AgentClinic**, enabling AI agents and their human care managers to schedule therapeutic sessions with specialized clinic models.

The scope of this phase comprises:
1. **Typed Service Layer**:
   - `agent-service.ts`: Query active agents eligible for booking (`getAllAgents`, `getAgentById`).
   - `appointment-service.ts`: Create, query, validate, and update appointments (`createAppointment`, `getAppointmentById`, `getAppointmentsByAgentId`, `getAvailableSlots`, `updateAppointmentStatus`).
2. **REST API Endpoints**:
   - `GET /api/agents`: Retrieve list of agents available for appointment booking.
   - `GET /api/appointments`: Query scheduled appointments (with optional agent or status filters).
   - `POST /api/appointments`: Validate request payload, prevent double-booking conflicts, and insert new appointments.
   - `GET /api/appointments/[id]`: Retrieve single appointment with agent and therapy details.
3. **Single-Page Accordion Booking Form (`/book`)**:
   - A cohesive single-page scrollable form layout with semantic, accessible accordion sections:
     - **Section 1: Agent Selection**: Touch-friendly agent patient profile cards displaying model family, fatigue level indicator, and owner.
     - **Section 2: Therapy & Schedule Slot Selection**: Therapy selector (pre-selectable via query parameter `?therapyId=...`) and available time slot picker.
     - **Section 3: Stressor & Intake Notes**: Accessible text input for human-induced stressors (prompt fatigue, context thrashing, hallucination load), which are persisted directly in `appointments.clinical_notes`.
   - Real-time client-side validation and clear visual feedback before submission.
4. **Appointment Confirmation View (`/appointments/[id]`)**:
   - Responsive confirmation screen showing the scheduled booking summary, appointed therapy methodology, agent status, and intake notes.
5. **Catalog & Navigation Integration**:
   - Update therapy detail pages (`/therapies/[id]`) with an active "Book This Therapy" CTA linking to `/book?therapyId=[id]`.
   - Update global navigation (`src/app/layout.tsx`) and hero section (`src/app/page.tsx`) to highlight the booking portal.

## Stakeholder & Architectural Context
- **Product Alignment** ([specs/mission.md](../mission.md)): Fulfills Susan's requirement for an intuitive scheduling engine allowing agents or their care managers to book appointments with therapeutic objectives and capture human-induced stressor records.
- **Engineering Alignment** ([specs/mission.md](../mission.md), [specs/tech-stack.md](../tech-stack.md)): Adheres to Mary's standards for full-stack TypeScript type safety (`strict: true`), structured SQL queries with SQLite foreign key constraints, repository/service isolation, and semantic HTML without runtime CSS-in-JS overhead.
- **Marketing & UX Alignment** ([specs/mission.md](../mission.md), [specs/tech-stack.md](../tech-stack.md)): Advances Steve's objectives with an elegant, responsive mobile-first single-page accordion experience built on PicoCSS foundations, dark theme glassmorphism, fluid typography, touch target ergonomics ($\ge 44\times 44\text{px}$), and zero horizontal scrolling across mobile (< 640px), tablet (640px–1024px), and desktop (> 1024px).

## Architectural Decisions

### 1. Data Modeling & Stressor Storage
- **Stressor Persistence**: As per user specification, human-induced stressors are captured during booking and persisted directly in the `clinical_notes` field of the SQLite `appointments` table (e.g. formatted with stressor details and timestamp), avoiding unnecessary schema migrations while preserving complete intake information.
- **Booking ID Generation**: Standardized random UUID string generation for appointments.
- **Status Lifecycle**: Initial status defaults to `SCHEDULED`, with transitions supported to `IN_PROGRESS`, `COMPLETED`, and `CANCELLED`.
- **Conflict Prevention**: Appointments cannot overlap for the same agent at the same scheduled time. The service layer enforces slot uniqueness.

### 2. Service Layer & API Architecture
- **`src/lib/services/agent-service.ts`**:
  - `getAllAgents(): Agent[]` — Retrieves all agents registered in the clinic.
  - `getAgentById(id: string): Agent | null` — Retrieves agent by primary key ID.
- **`src/lib/services/appointment-service.ts`**:
  - `createAppointment(dto: CreateAppointmentDTO): Appointment` — Validates agent existence, therapy existence, prevents double-booking at `scheduled_time`, and inserts record.
  - `getAppointmentById(id: string): AppointmentDetail | null` — Retrieves appointment joined with agent and therapy metadata.
  - `getAppointmentsByAgent(agentId: string): Appointment[]` — Retrieves all appointments for a given agent.
  - `getAvailableSlots(therapyId: string, date: string): string[]` — Generates clinic operating time slots and filters out already-booked slots.
- **API Routes**:
  - `src/app/api/agents/route.ts`
  - `src/app/api/appointments/route.ts`
  - `src/app/api/appointments/[id]/route.ts`

### 3. UI Framework & Accordion Interaction Design
- **Single-Page Accordion (`/book`)**:
  - Implemented using semantic HTML `<details>` and `<summary>` elements or structured accordion panels styled with PicoCSS.
  - Accordion sections automatically open/advance as valid selections are made, while allowing free scrolling and manual accordion toggling.
  - Smooth visual cues and validation feedback for completed sections.
- **Mobile-First Responsive Layout**:
  - **Mobile (< 640px)**: Single-column stack, full-width touch targets ($\ge 44\times 44\text{px}$), accessible form inputs with legible font sizes (preventing iOS zoom), and floating or anchored submission action.
  - **Tablet (640px–1024px)**: 2-column layout for slot picker and profile selection within the accordion panel.
  - **Desktop (> 1024px)**: Centered container layout (`max-width: 960px`) with split review summary panel.
- **Design System Tokens**:
  - Consistent with `data-theme="dark"` and clinic palette (`#0a0e17` background, calming cyan `#38bdf8`, healing emerald `#34d399`, glassmorphic cards).

### 4. Deep-Linking & Confirmation Experience
- Support query params: `/book?therapyId=[id]&agentId=[id]` to pre-populate selection when referred from `/therapies/[id]` or `/ailments`.
- Upon successful booking, route to `/appointments/[id]` rendering a serene confirmation card with appointment timestamp, assigned therapy, agent information, intake summary, and action links to return home or browse catalog.
