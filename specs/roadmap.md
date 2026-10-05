# Roadmap: AgentClinic

## Implementation Strategy
Implementation is structured into 5 micro-phases of work. Each phase builds incrementally on verified functionality to ensure high reliability and alignment with stakeholder goals.

---

### Phase 1: Base Setup & Schema
- Initialize Next.js project structure with TypeScript configuration.
- Define core TypeScript domain models and schemas:
  - `Agent` (ID, name, model type, human owner, fatigue level)
  - `Ailment` (ID, name, description, severity, symptoms)
  - `Therapy` (ID, name, description, duration, recommended for ailments)
  - `Appointment` (ID, agent ID, therapy ID, scheduled time, status, clinical notes)
- Seed initial mock data for common agent ailments and therapies.
- Build responsive base layout shell and home page establishing mobile, tablet, and desktop breakpoints.

---

### Phase 2: Ailments & Therapies Catalog
- Build service layers to query ailments and treatment options.
- Create responsive catalog pages and components:
  - Responsive ailments directory with touch-friendly filter chips, severity indicators, and adaptive card grids.
  - Responsive therapy details page detailing treatment methodology (e.g., Temperature Reduction, Prompt Detox).
- Provide clear links from diagnosed ailments to recommended therapies with fluid mobile navigation.

---

### Phase 3: Booking Engine
- Implement mobile-first, responsive appointment booking workflow:
  - Select patient agent profile with touch-friendly cards.
  - Choose therapy and available time slot using responsive schedule pickers.
  - Input agent's human-induced stressors with accessible mobile inputs.
- Implement booking validation, state updates, and responsive confirmation screens.
- Provide API endpoints for creating, retrieving, and updating appointments.

---

### Phase 4: Dashboards (Agent & Staff)
- **Agent Portal**:
  - Responsive mobile-friendly dashboard viewing current appointments, past therapy session records, and health improvement metrics.
- **Staff Clinical Dashboard**:
  - Adaptive queue management interface with responsive data tables and collapsible clinical panels.
  - Patient intake status and session completion controls optimized for touch and desktop.
  - Ability to record session diagnosis notes with auto-resizing text areas.

---

### Phase 5: UI Styling & Polish
- Apply cohesive modern styling using PicoCSS semantic foundations and clinic design tokens.
- Comprehensive responsive design audit across mobile (< 640px), tablet (640px–1024px), and desktop (> 1024px) viewports.
- Implement micro-animations, accessible focus states, touch target ergonomics (>= 44px), and clinic-themed aesthetic touches (calming palette, glassmorphism).
