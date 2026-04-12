import { Metadata } from 'next'
import { LegalShell, LegalSection, LegalHighlight, LegalFooter } from '@/components/LegalShell'

export const metadata: Metadata = {
  title: 'Cookie Policy | KerfOS',
  description: 'KerfOS cookie policy — how we use cookies on our website.',
}

async function getPolicy() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/gdpr/cookie-policy`,
      { cache: 'no-store', signal: AbortSignal.timeout(4000) }
    )
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

const STATIC_COOKIES = [
  { name: 'kerfos_session', type: 'Essential', purpose: 'Maintains your login session', duration: 'Session', can_disable: false },
  { name: 'kerfos_csrf', type: 'Essential', purpose: 'Cross-site request forgery protection', duration: 'Session', can_disable: false },
  { name: 'kerfos_prefs', type: 'Functional', purpose: 'Stores UI preferences (dark mode, units)', duration: '1 year', can_disable: true },
  { name: '_analytics', type: 'Analytics', purpose: 'Anonymous usage analytics', duration: '13 months', can_disable: true },
]

export default async function CookiesPage() {
  const policy = await getPolicy()
  const cookies = policy?.cookies ?? STATIC_COOKIES

  return (
    <LegalShell
      title="Cookie Policy"
      badge={policy?.version ? `v${policy.version}` : 'v1.0'}
      subtitle={policy?.last_updated ? `Last updated ${policy.last_updated}` : 'Last updated March 2026'}
    >
      <LegalHighlight variant="accent">
        We use a minimal set of cookies required to run KerfOS. You can manage analytics
        and functional cookies at any time via our{' '}
        <a href="/gdpr" style={{ color: 'var(--k-amber)', textDecoration: 'none' }}>GDPR settings</a>.
      </LegalHighlight>

      <LegalSection title="Cookies We Use">
        <div style={{
          border: '1px solid var(--k-border)',
          borderRadius: 'var(--k-r-md)',
          overflow: 'hidden',
          marginBottom: '24px',
        }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '160px 100px 1fr 100px 90px',
            gap: '0',
            background: 'var(--k-bg-subtle)',
            borderBottom: '1px solid var(--k-border)',
            padding: '10px 16px',
          }}>
            {['Name', 'Type', 'Purpose', 'Duration', 'Opt-out'].map(h => (
              <span key={h} style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                color: 'var(--k-ink-4)',
              }}>{h}</span>
            ))}
          </div>
          {/* Rows */}
          {cookies.map((cookie: { name: string; type: string; purpose: string; duration: string; can_disable: boolean }, i: number) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '160px 100px 1fr 100px 90px',
              gap: '0',
              padding: '12px 16px',
              borderBottom: i < cookies.length - 1 ? '1px solid var(--k-border)' : 'none',
              background: 'var(--k-surface)',
              alignItems: 'center',
            }}>
              <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '12px', color: 'var(--k-ink-2)' }}>
                {cookie.name}
              </span>
              <span style={{
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: 'var(--k-r-sm)',
                border: '1px solid var(--k-border)',
                color: 'var(--k-ink-3)',
                display: 'inline-block',
                width: 'fit-content',
              }}>
                {cookie.type}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--k-ink-3)' }}>{cookie.purpose}</span>
              <span style={{ fontSize: '13px', color: 'var(--k-ink-4)' }}>{cookie.duration}</span>
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: cookie.can_disable ? 'var(--k-amber)' : 'var(--k-ink-4)',
              }}>
                {cookie.can_disable ? 'Yes' : 'Required'}
              </span>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title="Categories">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { name: 'Essential', desc: 'Required for the site to function. Cannot be disabled. Includes session management and security tokens.' },
            { name: 'Functional', desc: 'Improve your experience by remembering preferences. Safe to disable — the site still works.' },
            { name: 'Analytics', desc: 'Anonymous usage data. Helps us understand how KerfOS is used. Can be disabled without affecting functionality.' },
            { name: 'Marketing', desc: 'KerfOS does not use marketing or advertising cookies.' },
          ].map(cat => (
            <div key={cat.name} style={{
              padding: '14px 16px',
              background: 'var(--k-surface)',
              border: '1px solid var(--k-border)',
              borderRadius: 'var(--k-r-md)',
            }}>
              <div style={{
                fontFamily: 'var(--font-sora), Sora, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--k-ink)',
                marginBottom: '4px',
              }}>
                {cat.name}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--k-ink-3)', lineHeight: 1.6, margin: 0 }}>{cat.desc}</p>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title="Managing Your Preferences">
        <ul style={{ padding: '0 0 0 18px', margin: 0, fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 2 }}>
          <li>Use our <a href="/gdpr" style={{ color: 'var(--k-amber)', textDecoration: 'none' }}>GDPR portal</a> to manage consent preferences</li>
          <li>Clear cookies in your browser settings at any time</li>
          <li>Use incognito / private browsing to avoid persistent cookies</li>
        </ul>
      </LegalSection>

      <LegalFooter />
    </LegalShell>
  )
}
