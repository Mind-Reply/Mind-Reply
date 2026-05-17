'use client';

import React from 'react';

const footerLinks = [
  { label: 'Capabilities', href: '#features' },
  { label: 'Clarity Tools', href: '#tools' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Membership', href: '#pricing' },
  { label: 'MR Advisor', href: '#advisor' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--card, #111115)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '64px 24px 40px',
      }}
      aria-label="MindReply footer"
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48, marginBottom: 48 }} className="footer-grid">
          <style>{`@media(min-width:768px){.footer-grid{grid-template-columns:2fr 1fr 1fr!important}}`}</style>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9a96e, #7c6b52)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontStyle: 'italic',
                fontFamily: 'var(--font-display, Fraunces, serif)',
                color: '#09090b',
              }}>
                M
              </div>
              <span style={{
                fontFamily: 'var(--font-display, Fraunces, serif)',
                fontSize: 16, fontWeight: 400,
                color: 'var(--foreground, #f2ede6)',
              }}>
                MindReply
              </span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--muted-foreground, #7a7068)', maxWidth: 320 }}>
              Operational composure for agencies, founders, and premium individuals who cannot afford to bleed bandwidth into noise.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
              <span className="live-dot" style={{ width: 6, height: 6 }} aria-hidden="true" />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground, #7a7068)' }}>
                System active · All operations nominal
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--primary, #c9a96e)', marginBottom: 20 }}>
              Navigate
            </p>
            <nav aria-label="Footer navigation">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {footerLinks.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontSize: 13, color: 'var(--muted-foreground, #7a7068)',
                        textDecoration: 'none', transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground, #f2ede6)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted-foreground, #7a7068)')}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal & CTA */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--primary, #c9a96e)', marginBottom: 20 }}>
              Legal
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {['Privacy Policy', 'Terms of Service', 'Data Processing'].map(item => (
                <a
                  key={item}
                  href="#"
                  style={{ fontSize: 13, color: 'var(--muted-foreground, #7a7068)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--foreground, #f2ede6)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted-foreground, #7a7068)')}
                >
                  {item}
                </a>
              ))}
            </div>

            <a
              href="#pricing"
              style={{
                display: 'inline-block', padding: '10px 20px', borderRadius: 99,
                background: 'var(--primary, #c9a96e)',
                color: 'var(--primary-foreground, #09090b)',
                fontSize: 10, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                textDecoration: 'none', transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
            >
              Enter MR Hub
            </a>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap' as const, gap: 12,
        }}>
          <p style={{ fontSize: 11, color: 'var(--muted-foreground, #7a7068)' }}>
            © 2026 MindReply · Operational composure, engineered.
          </p>
          <p style={{ fontSize: 11, color: 'rgba(122,112,104,0.5)' }}>
            mind-reply.com
          </p>
        </div>
      </div>
    </footer>
  );
}
