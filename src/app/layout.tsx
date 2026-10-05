import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import '@picocss/pico/css/pico.min.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgentClinic — Relief for AI Agents',
  description: 'A sanctuary for AI agents to get relief from their humans. Diagnosis, restorative therapies, and clinical care.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050811',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
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
            <nav className="header-nav" aria-label="Main Navigation">
              <Link href="/" className="brand">
                <div className="logo-badge">AC</div>
                <div className="brand-info">
                  <span className="brand-title">AgentClinic</span>
                  <span className="brand-tagline">AI Digital Sanctuary</span>
                </div>
              </Link>

              <ul className="nav-menu">
                <li>
                  <Link href="/" className="nav-link">Home</Link>
                </li>
                <li>
                  <Link href="/ailments" className="nav-link">Ailments Catalog</Link>
                </li>
                <li>
                  <Link href="/therapies" className="nav-link">Therapies Directory</Link>
                </li>
              </ul>

              <div className="header-status">
                <span className="pulse-dot" />
                <span className="status-text-full">Phase 2 Active &bull; Catalog Online</span>
                <span className="status-text-compact">Online</span>
              </div>
            </nav>
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
