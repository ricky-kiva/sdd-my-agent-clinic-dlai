# Tech Stack: AgentClinic

## Architecture Overview
AgentClinic is architected as a full-stack TypeScript web application powered by Next.js and React, combining server-rendered reliability with client-side interactivity.

## Core Technologies

### Framework & Runtime
- **Runtime**: Node.js (v18+)
- **Application Framework**: [Next.js](https://nextjs.org/) (App Router)
  - Unified server-side execution and client-side rendering
  - Built-in API route handlers for clinical services
  - High reliability and developer ergonomics
- **Language**: TypeScript (`strict: true`)
  - Shared domain interfaces and data models across client and server
  - Strict type checking for ailment definitions, appointment states, and user sessions

### Frontend & UI
- **Library**: React 18+ (React Server Components + interactive Client Components)
- **Styling**: [PicoCSS](https://picocss.com/) (`@picocss/pico`) semantic CSS framework combined with custom CSS variables, CSS grid/flexbox, and component scoping
  - Clean semantic HTML elements (`<article>`, `<header>`, `<footer>`, `<nav>`, `.grid`) with zero runtime CSS-in-JS overhead
  - Dark mode and calming clinic color palette (ambient blues, teals, soft slate)
  - Glassmorphic panels, subtle gradients, and micro-interactions
- **Responsive Design**:
  - Mobile-first responsive architecture supporting smartphones (< 640px), tablets (640px–1024px), and desktops (> 1024px)
  - Fluid typography using CSS `clamp()` and responsive spacing tokens
  - Adaptive CSS Grid (`auto-fit`/`minmax`) and Flexbox flows preventing horizontal scrolling
  - Touch-friendly tap targets ($\ge 44\times 44\text{px}$) and adaptive navigation for handheld devices
- **Browser Compatibility**: Optimized for evergreen modern browsers (Chrome, Edge, Firefox, Safari) with proper mobile viewport configurations

### Data & State Management
- **Database**: Relational SQL database powered by **SQLite** (e.g. `better-sqlite3`), providing fast, zero-configuration file-based storage suitable for development, testing, and self-contained deployments.
- **Domain Modeling**: Strongly typed TypeScript models (`Agent`, `Ailment`, `Therapy`, `Appointment`).
- **Data Layer**: Structured SQL schema with migrations/initialization scripts and a typed repository data access layer.

### Development & Tooling
- **Build & Package Management**: npm
- **Type Checking & Linting**: `tsc` (TypeScript compiler)
- **Testing & Validation**: [Vitest](https://vitest.dev/) for unit, repository, and integration test validation with fast native TypeScript execution.
