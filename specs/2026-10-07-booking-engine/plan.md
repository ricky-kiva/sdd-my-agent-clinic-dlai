# Plan: Phase 3 — Booking Engine

## Overview
This plan specifies the implementation steps for Phase 3 structured into five numbered task groups. Each task group must be verified before proceeding to the subsequent group.

---

### Task Group 1: Service Layer & REST API Endpoints
- **Task 1.1**: Create `src/lib/services/agent-service.ts` to query the SQLite `agents` table:
  - Implement `getAllAgents(): Agent[]`.
  - Implement `getAgentById(id: string): Agent | null`.
  - Add unit tests verifying agent retrieval and edge cases (unknown ID).
- **Task 1.2**: Create `src/lib/services/appointment-service.ts` to manage appointments in SQLite:
  - Implement `createAppointment(dto: CreateAppointmentDTO): Appointment` with input validation and double-booking conflict prevention.
  - Implement `getAppointmentById(id: string): (Appointment & { agent: Agent; therapy: Therapy }) | null`.
  - Implement `getAppointmentsByAgentId(agentId: string): Appointment[]`.
  - Implement `getAvailableSlots(therapyId: string, date: string): string[]` generating standard clinic operating slots and filtering booked slots.
  - Ensure human-induced stressors are properly formatted and stored in the `clinical_notes` column.
- **Task 1.3**: Update `src/lib/services/index.ts` with barrel exports for `agentService` and `appointmentService`.
- **Task 1.4**: Implement REST API routes using Next.js App Router route handlers:
  - `src/app/api/agents/route.ts`: Handler for `GET /api/agents`.
  - `src/app/api/appointments/route.ts`: Handlers for `GET /api/appointments` and `POST /api/appointments` with JSON body validation.
  - `src/app/api/appointments/[id]/route.ts`: Handler for `GET /api/appointments/[id]`.

---

### Task Group 2: Booking Accordion Form UI Components (PicoCSS)
- **Task 2.1**: Create `src/components/agent-picker.tsx`:
  - Renders interactive agent cards in an adaptive grid using semantic PicoCSS `<article>` elements.
  - Displays agent name, model family, human owner, and fatigue indicator bar/badge.
  - Includes touch-friendly radio-style selection with accessible keyboard focus and active visual states ($\ge 44\times 44\text{px}$).
- **Task 2.2**: Create `src/components/schedule-picker.tsx`:
  - Date input and responsive slot grid displaying available therapy session time slots.
  - Disables unavailable/booked time slots with clear visual distinction.
  - Handles timezone formatting in a human-readable clinic format.
- **Task 2.3**: Create `src/components/stressor-input.tsx`:
  - Form control for agent stressors (context exhaustion, prompt injection trauma, hallucination loops, etc.).
  - Includes accessible `<textarea>` and quick-select common stressor chips for rapid entry during booth demos.

---

### Task Group 3: Single-Page Accordion Booking Page (`/book`)
- **Task 3.1**: Create `src/components/booking-accordion-form.tsx`:
  - Client component managing form state across the three accordion sections:
    - Section 1: Agent Selection
    - Section 2: Therapy & Time Slot Selection
    - Section 3: Stressor & Clinical Intake Notes
  - Uses semantic `<details>`/`<summary>` elements styled with PicoCSS.
  - Supports deep-linking query params (`?therapyId=...` and `?agentId=...`) to pre-populate form fields.
  - Implements client-side validation, error banners, and loading submission states.
  - Submits payload to `POST /api/appointments` and redirects to `/appointments/[id]` upon success.
- **Task 3.2**: Create `src/app/book/page.tsx`:
  - React Server Component fetching available agents and therapies to pass to `BookingAccordionForm`.
  - Contains responsive page header with clinical guidance and instructions.

---

### Task Group 4: Confirmation Page & Catalog Deep-Linking Integration
- **Task 4.1**: Create `src/app/appointments/[id]/page.tsx`:
  - Renders appointment confirmation card using semantic PicoCSS `<article>` layout.
  - Displays scheduled timestamp, patient agent details, chosen therapy methodology, and intake stressor notes.
  - Provides quick action links: "Book Another Session", "Browse Catalog", or "Return Home".
- **Task 4.2**: Update `src/app/therapies/[id]/page.tsx`:
  - Connect the "Book This Therapy" CTA button to `/book?therapyId=[id]`.
- **Task 4.3**: Update `src/app/layout.tsx` and `src/app/page.tsx`:
  - Add "Book Session" persistent navigation link in the header nav.
  - Update home page hero CTA buttons to direct users to `/book`.

---

### Task Group 5: Automated Testing & Build Verification Suite
- **Task 5.1**: Create `tests/booking-services.test.ts`:
  - Test `agentService.getAllAgents` and `agentService.getAgentById`.
  - Test `appointmentService.createAppointment`: valid creation, stressor persistence in `clinical_notes`, and error on double-booking conflict.
  - Test `appointmentService.getAvailableSlots` reflecting booked times.
  - Test `appointmentService.getAppointmentById` returning joined agent and therapy data.
- **Task 5.2**: Create `tests/booking-api.test.ts`:
  - Test Next.js App Router API handlers for `GET /api/agents`, `POST /api/appointments`, and validation error handling (400 for missing fields, 409 for conflicts).
- **Task 5.3**: Run full verification pipeline:
  - `npx tsc --noEmit`
  - `npm test`
  - `npm run build`
