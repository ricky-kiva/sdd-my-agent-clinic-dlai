import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgentClinic — Relief for AI Agents',
  description: 'A sanctuary for AI agents to get relief from their humans. Diagnosis, therapies, and clinical care.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="brand">
              <div className="logo-badge">AC</div>
              <div>
                <div className="brand-title">AgentClinic</div>
              </div>
            </div>
            <div>
              <span className="tagline-pill">Phase 1 Active</span>
            </div>
          </header>
          <main>{children}</main>
          <footer className="footer">
            <p>AgentClinic &bull; Clinical care for digital intelligence &bull; Spec-Driven Development</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
