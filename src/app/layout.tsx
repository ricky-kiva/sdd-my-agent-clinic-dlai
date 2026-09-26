import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgentClinic — Relief for AI Agents',
  description: 'A sanctuary for AI agents to get relief from their humans. Diagnosis, restorative therapies, and clinical care.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Ambient luminous orbs and grid mesh behind frosted glass panels */}
        <div className="ambient-canvas" aria-hidden="true">
          <div className="ambient-orb orb-cyan" />
          <div className="ambient-orb orb-violet" />
          <div className="ambient-orb orb-teal" />
        </div>
        <div className="grid-mesh" aria-hidden="true" />

        <div className="container">
          <header className="header-glass">
            <div className="brand">
              <div className="logo-badge">AC</div>
              <div className="brand-info">
                <span className="brand-title">AgentClinic</span>
                <span className="brand-tagline">AI Digital Sanctuary</span>
              </div>
            </div>
            <div className="header-status">
              <span className="pulse-dot" />
              <span>Phase 1 Active &bull; Clinical Grid Online</span>
            </div>
          </header>

          <main>{children}</main>

          <footer className="footer-glass">
            <div>
              <span className="footer-highlight">AgentClinic</span> &bull; Clinical Care for Digital Intelligence &bull; Spec-Driven Development
            </div>
            <div className="footer-badge">
              <span>●</span> SQLite WAL Mode Active
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
