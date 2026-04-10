'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Builder',   href: '/design/builder' },
  { label: 'Optimize',  href: '/optimize' },
  { label: 'Pricing',   href: '/#pricing' },
  { label: 'Community', href: '/community' },
]

function KerfOSLogo() {
  return (
    <Link
      href="/"
      aria-label="KerfOS home"
      style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}
    >
      <svg width="28" height="28" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <clipPath id="nav-u"><polygon points="0,0 56,0 0,56"/></clipPath>
          <clipPath id="nav-l"><polygon points="56,0 56,56 0,56"/></clipPath>
          <filter id="nav-g" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect x="0" y="0" width="54" height="54" rx="4" fill="#0a0e1c" clipPath="url(#nav-u)"/>
        <g transform="translate(2, 2)">
          <rect x="0" y="0" width="54" height="54" rx="4" fill="#06b6d4" clipPath="url(#nav-l)"/>
        </g>
        <line x1="1" y1="1" x2="55" y2="55" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round" filter="url(#nav-g)"/>
      </svg>
      <span style={{
        fontFamily: 'var(--font-sora), Sora, sans-serif',
        fontWeight: 700,
        fontSize: '17px',
        letterSpacing: '-0.04em',
        color: '#0a0e1c',
        lineHeight: 1,
      }}>
        Kerf<span style={{ color: '#06b6d4', fontWeight: 400 }}>OS</span>
      </span>
    </Link>
  )
}

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile]     = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: scrolled ? 'rgba(248,247,244,0.92)' : 'var(--k-bg)',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--k-border)' : '1px solid transparent',
      transition: 'background-color 200ms ease, border-color 200ms ease',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
      }}>
        <KerfOSLogo />

        {/* Desktop links — only renders when not mobile */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href || pathname.startsWith(link.href.split('#')[0] + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--k-r-sm)',
                    fontSize: '13px',
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? 'var(--k-ink)' : 'var(--k-ink-2)',
                    background: isActive ? 'var(--k-surface-2)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'color 120ms ease, background 120ms ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--k-ink)'
                      e.currentTarget.style.background = 'var(--k-surface-2)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--k-ink-2)'
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}

        {/* Right: CTAs (desktop) or hamburger (mobile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {!isMobile ? (
            <>
              <button
                style={{
                  padding: '7px 14px', fontSize: '13px', fontWeight: 500,
                  color: 'var(--k-ink-2)', background: 'transparent',
                  border: 'none', borderRadius: 'var(--k-r-sm)',
                  cursor: 'pointer', letterSpacing: '-0.01em',
                  transition: 'color 120ms ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--k-ink)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--k-ink-2)'}
              >
                Sign in
              </button>
              <Link href="/design/builder" className="k-btn k-btn-primary k-btn-sm">
                Start free
              </Link>
            </>
          ) : (
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
              style={{
                width: '36px', height: '36px', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '5px', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block', width: '18px', height: '1.5px',
                  background: 'var(--k-ink)',
                  transform: mobileOpen && i === 0 ? 'translateY(6.5px) rotate(45deg)' :
                             mobileOpen && i === 2 ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                  transition: 'transform 200ms ease, opacity 150ms ease',
                  transformOrigin: 'center',
                }} />
              ))}
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && isMobile && (
        <div style={{
          position: 'absolute', top: '60px', left: 0, right: 0,
          background: 'var(--k-surface)',
          borderBottom: '1px solid var(--k-border)',
          boxShadow: 'var(--k-shadow-md)',
          padding: '12px 24px 24px',
          zIndex: 99,
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block', padding: '11px 0',
                fontSize: '15px', fontWeight: 500,
                color: 'var(--k-ink)', textDecoration: 'none',
                borderBottom: '1px solid var(--k-border)',
                letterSpacing: '-0.01em',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ paddingTop: '16px', display: 'flex', gap: '10px' }}>
            <button className="k-btn k-btn-ghost" style={{ flex: 1 }}>Sign in</button>
            <Link href="/design/builder" className="k-btn k-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Start free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
