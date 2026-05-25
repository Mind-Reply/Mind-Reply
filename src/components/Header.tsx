'use client';

import React, { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Capabilities', href: '#features' },
  { label: 'Clarity Tools', href: '#tools' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Membership', href: '#pricing' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 w-full z-50 transition-all duration-500"
        style={{
          padding: scrolled ? '14px 0' : '22px 0',
          background: scrolled ? 'rgba(9,9,11,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <nav className="max-w-screen-xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group" aria-label="MindReply home">
            <div
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9a96e, #7c6b52)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display, Fraunces, serif)',
                fontSize: 14, fontWeight: 400, color: '#09090b',
                fontStyle: 'italic',
              }}
            >
              M
            </div>
            <span style={{
              fontFamily: 'var(--font-display, Fraunces, serif)',
              fontSize: 17, fontWeight: 400, letterSpacing: '-0.01em',
              color: 'var(--foreground, #f2ede6)',
            }}>
              MindReply
            </span>
          </a>

          <div className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.12em', color: 'var(--muted-foreground, #7a7068)',
                  textDecoration: 'none', transition: 'color 0.25s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--foreground, #f2ede6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-foreground, #7a7068)')}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#pricing"
              className="hidden md:inline-flex items-center gap-2"
              style={{
                padding: '9px 20px',
                borderRadius: 99,
                background: 'var(--primary, #c9a96e)',
                color: 'var(--primary-foreground, #09090b)',
                fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                textDecoration: 'none', transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Enter MR Hub
            </a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden flex flex-col gap-1.5 w-7"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <span style={{
                display: 'block', width: '100%', height: 1,
                background: 'var(--foreground, #f2ede6)',
                transition: 'all 0.4s ease',
                transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
              }} />
              <span style={{
                display: 'block', height: 1,
                background: 'var(--foreground, #f2ede6)',
                transition: 'all 0.4s ease',
                width: menuOpen ? 0 : '66%',
                opacity: menuOpen ? 0 : 1,
              }} />
              <span style={{
                display: 'block', width: '100%', height: 1,
                background: 'var(--foreground, #f2ede6)',
                transition: 'all 0.4s ease',
                transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
              }} />
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-8"
          style={{ background: 'rgba(9,9,11,0.97)', backdropFilter: 'blur(20px)' }}
          onClick={() => setMenuOpen(false)}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-display, Fraunces, serif)',
                fontSize: 28, fontWeight: 300, fontStyle: 'italic',
                color: 'var(--foreground, #f2ede6)', textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#pricing"
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: 16, padding: '12px 32px', borderRadius: 99,
              background: 'var(--primary, #c9a96e)',
              color: 'var(--primary-foreground, #09090b)',
              fontSize: 12, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              textDecoration: 'none',
            }}
          >
            Enter MR Hub
          </a>
        </div>
      )}
    </>
  );
}
