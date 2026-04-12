import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Subscription Confirmed',
  description: 'Your KerfOS subscription is active. Start building.',
  robots: { index: false },
}

export default function PricingSuccess() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--k-bg-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Check icon */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(6,182,212,0.12)',
          border: '1px solid rgba(6,182,212,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M5 14L11 20.5L23 7.5" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p className="k-label" style={{ marginBottom: '12px' }}>You're in</p>

        <h1 style={{
          fontFamily: 'var(--font-sora), Sora, sans-serif',
          fontSize: 'clamp(26px, 4vw, 38px)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          color: 'var(--k-ink)',
          marginBottom: '16px',
        }}>
          Subscription confirmed
        </h1>

        <p style={{
          fontSize: '15px',
          color: 'var(--k-ink-3)',
          lineHeight: 1.7,
          marginBottom: '40px',
        }}>
          Your plan is active. Head to the builder and start cutting — your projects, exports, and team seats are ready.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/builder"
            style={{
              display: 'inline-block',
              padding: '11px 24px',
              background: '#06b6d4',
              color: '#0a0e1c',
              borderRadius: '3px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              textDecoration: 'none',
            }}
          >
            Open builder
          </Link>
          <Link
            href="/account"
            style={{
              display: 'inline-block',
              padding: '11px 24px',
              background: 'var(--k-surface)',
              color: 'var(--k-ink-2)',
              borderRadius: '3px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.02em',
              textDecoration: 'none',
              border: '1px solid var(--k-border)',
            }}
          >
            Account settings
          </Link>
        </div>

        <p style={{ marginTop: '32px', fontSize: '12px', color: 'var(--k-ink-4)' }}>
          Confirmation sent to your email. Questions?{' '}
          <a href="mailto:hello@kerfos.com" style={{ color: 'var(--k-ink-3)', textDecoration: 'underline' }}>
            hello@kerfos.com
          </a>
        </p>
      </div>
    </div>
  )
}
