'use client'

import Link from 'next/link'
import { type ReactNode } from 'react'

interface LegalShellProps {
  title: string
  subtitle?: string
  badge?: string
  children: ReactNode
}

export function LegalShell({ title, subtitle, badge, children }: LegalShellProps) {
  return (
    <div style={{ background: 'var(--k-bg)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header strip */}
      <div style={{
        borderBottom: '1px solid var(--k-border)',
        padding: '48px 0 40px',
        marginBottom: '48px',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 40px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '11px',
              color: 'var(--k-ink-4)',
              textDecoration: 'none',
              marginBottom: '28px',
              letterSpacing: '0.01em',
            }}
          >
            ← kerfos
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <h1 className="k-heading-lg" style={{ margin: 0 }}>{title}</h1>
            {badge && (
              <span style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--k-ink-4)',
                border: '1px solid var(--k-border-mid)',
                padding: '2px 7px',
                borderRadius: 'var(--k-r-sm)',
              }}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{ fontSize: '15px', color: 'var(--k-ink-3)', lineHeight: 1.6, margin: 0 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 40px' }}>
        {children}
      </div>
    </div>
  )
}

interface LegalSectionProps {
  title: string
  children: ReactNode
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{
        fontFamily: 'var(--font-sora), Sora, sans-serif',
        fontSize: '16px',
        fontWeight: 600,
        letterSpacing: '-0.02em',
        color: 'var(--k-ink)',
        marginBottom: '12px',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

interface LegalHighlightProps {
  variant?: 'neutral' | 'accent'
  children: ReactNode
}

export function LegalHighlight({ variant = 'neutral', children }: LegalHighlightProps) {
  return (
    <div style={{
      background: variant === 'accent' ? 'var(--k-amber-soft)' : 'var(--k-bg-subtle)',
      border: `1px solid ${variant === 'accent' ? 'var(--k-amber-glow)' : 'var(--k-border)'}`,
      borderLeft: `3px solid ${variant === 'accent' ? 'var(--k-amber)' : 'var(--k-border-strong)'}`,
      borderRadius: 'var(--k-r-md)',
      padding: '16px 20px',
      marginBottom: '24px',
      fontSize: '14px',
      lineHeight: 1.65,
      color: variant === 'accent' ? 'var(--k-ink-2)' : 'var(--k-ink-3)',
    }}>
      {children}
    </div>
  )
}

interface LegalCardGridProps {
  children: ReactNode
}

export function LegalCardGrid({ children }: LegalCardGridProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1px',
      background: 'var(--k-border)',
      border: '1px solid var(--k-border)',
      marginBottom: '32px',
    }}>
      {children}
    </div>
  )
}

interface LegalCardProps {
  label: string
  children: ReactNode
}

export function LegalCard({ label, children }: LegalCardProps) {
  return (
    <div style={{
      background: 'var(--k-surface)',
      padding: '20px',
    }}>
      <div style={{
        fontFamily: 'var(--font-sora), Sora, sans-serif',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--k-ink)',
        marginBottom: '6px',
        letterSpacing: '-0.01em',
      }}>
        {label}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--k-ink-3)', lineHeight: 1.55 }}>
        {children}
      </div>
    </div>
  )
}

export function LegalFooter() {
  const links = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/gdpr', label: 'GDPR Rights' },
  ]
  return (
    <div style={{
      borderTop: '1px solid var(--k-border)',
      paddingTop: '24px',
      marginTop: '48px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
    }}>
      {links.map(l => (
        <Link
          key={l.href}
          href={l.href}
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            color: 'var(--k-ink-4)',
            textDecoration: 'none',
            letterSpacing: '0.01em',
          }}
        >
          {l.label}
        </Link>
      ))}
    </div>
  )
}
