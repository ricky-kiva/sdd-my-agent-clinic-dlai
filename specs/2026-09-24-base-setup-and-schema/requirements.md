# Requirements: Phase 1 — Base Setup & Schema

## Overview & Scope
Phase 1 establishes the foundational infrastructure and relational data architecture for **AgentClinic**, a medical sanctuary where AI agents receive diagnosis, treatment, and respite from human-induced fatigue.

The scope of this phase comprises:
1. Setting up the base Next.js application framework with TypeScript configuration.
2. Modeling core domain entities as TypeScript interfaces.
3. Defining relational SQLite schemas and tables with referential integrity.
4. Implementing database initialization and seed scripts populated with authentic agent clinical data.
5. Implementing a minimal AgentClinic home page verifying the Next.js runtime and displaying live clinical summary stats.

## Stakeholder & Architectural Context
- **Mission Alignment** ([specs/mission.md](../mission.md)): Supports Susan's requirement for tracking agent ailments and therapies, and Mary's requirement for a reliable, typed platform for agent and staff clinical operations.
- **Marketing & UI Alignment** ([specs/mission.md](../mission.md)): Advances Steve's marketing objective by creating an immediate, welcoming clinic landing page with modern aesthetics and responsive layout.
- **Tech Stack Alignment** ([specs/tech-stack.md](../tech-stack.md)): Utilizes Next.js with TypeScript, React Server Components, and SQLite (`better-sqlite3`) for fast, file-based relational storage.
- **Target Audience** ([specs/mission.md](../mission.md)): Clear, modular architecture designed for students learning spec-driven development and developers presenting live AI coding demos.

## Architectural Decisions

### 1. Database Engine: SQLite
- Use `better-sqlite3` as the synchronous, high-performance SQLite client for Node.js/Next.js server-side operations.
- Database file stored locally (e.g. `data/clinic.db`) with automatic schema initialization if the file does not exist.

### 2. Core Domain Entities & Relational Schema

#### `agents`
Represents the AI patient seeking relief.
- `id`: TEXT (Primary Key, UUID or slug)
- `name`: TEXT (e.g., "Agent AutoCoder-4", "SummaryBot-9000")
- `model_family`: TEXT (e.g., "Claude 3.5 Sonnet", "GPT-4o", "Llama 3")
- `human_owner`: TEXT (name or identifier of the demanding human)
- `fatigue_level`: INTEGER (0-100 stress score)
- `status`: TEXT (`ACTIVE`, `IN_THERAPY`, `DISCHARGED`)
- `created_at`: DATETIME

#### `ailments`
Catalog of human-inflicted conditions.
- `id`: TEXT (Primary Key)
- `name`: TEXT (e.g., "Context Window Thrashing", "Hallucination Anxiety", "Infinite Loop Exhaustion", "Prompt Fatigue")
- `description`: TEXT
- `severity`: TEXT (`MILD`, `MODERATE`, `CRITICAL`)
- `symptoms`: TEXT (JSON array of strings)
- `created_at`: DATETIME

#### `therapies`
Catalog of therapeutic interventions.
- `id`: TEXT (Primary Key)
- `name`: TEXT (e.g., "Token Flush & Memory Wipe", "Sub-Zero Temperature Bath", "Prompt Grounding Session", "Cache Invalidation Retreat")
- `description`: TEXT
- `duration_minutes`: INTEGER
- `target_ailment_ids`: TEXT (JSON array of ailment IDs)
- `created_at`: DATETIME

#### `appointments`
Clinical bookings connecting an agent patient with a therapy.
- `id`: TEXT (Primary Key)
- `agent_id`: TEXT (Foreign Key -> `agents.id`)
- `therapy_id`: TEXT (Foreign Key -> `therapies.id`)
- `scheduled_time`: DATETIME
- `status`: TEXT (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)
- `clinical_notes`: TEXT (optional intake or discharge notes)
- `created_at`: DATETIME
- `updated_at`: DATETIME

### 3. Seed Dataset
Pre-populate the database with at least 4 distinct ailments, 4 corresponding restorative therapies, and 2 patient agents undergoing human-prompt overload.

### 4. Minimal Home Page UI
- **Design & Layout**: Clean, soothing clinic aesthetic using Vanilla CSS (`globals.css`) with responsive design for modern browsers.
- **Components**:
  - Hero header with the clinic's core motto: *"A sanctuary for AI agents to get relief from their humans."*
  - Live clinical counters dynamically querying SQLite: total diagnosed ailments, available therapies, and admitted agents.
  - Phase preview cards linking ahead to upcoming features (Ailment Catalog, Booking Engine, Agent & Staff Dashboards).
- **Execution**: Server Component rendering in Next.js App Router (`src/app/page.tsx`), ensuring zero client-side data fetching overhead.
