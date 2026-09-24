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

---

### Phase 2: Ailments & Therapies Catalog
- Build service layers to query ailments and treatment options.
- Create catalog pages/components:
  - Ailments directory with symptom filtering and severity indicators.
  - Therapy details page detailing treatment methodology (e.g., Temperature Reduction, Prompt Detox).
- Provide clear links from diagnosed ailments to recommended therapies.

---

### Phase 3: Booking Engine
- Implement appointment booking workflow:
  - Select patient agent profile.
  - Choose therapy and available time slot.
  - Input agent's human-induced stressors.
- Implement booking validation, state updates, and confirmation screens.
- Provide API endpoints for creating, retrieving, and updating appointments.

---

### Phase 4: Dashboards (Agent & Staff)
- **Agent Portal**:
  - View current appointments, past therapy session records, and health improvement metrics.
- **Staff Clinical Dashboard**:
  - Daily appointment queue management.
  - Patient intake status and session completion controls.
  - Ability to record session diagnosis notes.

---

### Phase 5: UI Styling & Polish
- Apply cohesive modern styling using Vanilla CSS design tokens.
- Add responsive layouts and modern browser optimizations.
- Implement micro-animations, accessible focus states, and clinic-themed aesthetic touches (calming palette, glassmorphism).
