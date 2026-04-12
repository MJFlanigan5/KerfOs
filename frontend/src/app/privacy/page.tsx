import { Metadata } from 'next'
import { LegalShell, LegalSection, LegalHighlight, LegalCardGrid, LegalCard, LegalFooter } from '@/components/LegalShell'

export const metadata: Metadata = {
  title: 'Privacy Policy | KerfOS',
  description: 'KerfOS privacy policy — how we collect, use, and protect your data.',
}

async function getPolicy() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/gdpr/privacy-policy`,
      { cache: 'no-store', signal: AbortSignal.timeout(4000) }
    )
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export default async function PrivacyPage() {
  const policy = await getPolicy()

  return (
    <LegalShell
      title="Privacy Policy"
      badge={policy?.version ? `v${policy.version}` : 'v1.0'}
      subtitle={policy?.last_updated ? `Last updated ${policy.last_updated}` : 'Last updated March 2026'}
    >
      {/* Summary cards */}
      <LegalCardGrid>
        <LegalCard label="Data Controller">KerfOS / Modology Studios</LegalCard>
        <LegalCard label="Contact">privacy@kerfos.com</LegalCard>
        <LegalCard label="GDPR Compliant">Yes</LegalCard>
        <LegalCard label="CCPA Compliant">Yes</LegalCard>
      </LegalCardGrid>

      {/* Dynamic sections from API, or static fallback */}
      {policy?.sections?.map((section: { title: string; content: string }, i: number) => (
        <LegalSection key={i} title={section.title}>
          <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.75 }}>
            {section.content}
          </p>
        </LegalSection>
      )) ?? (
        <>
          <LegalSection title="1. Who We Are">
            <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.75 }}>
              KerfOS is a cabinet design software platform. Our contact: privacy@kerfos.com.
              Data Protection Officer: dpo@kerfos.com.
            </p>
          </LegalSection>
          <LegalSection title="2. Data We Collect">
            <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.75 }}>
              We collect account data (name, email), design data (cabinet projects, cut lists),
              and usage analytics to improve the product. We do not sell your data.
            </p>
          </LegalSection>
          <LegalSection title="3. How We Use Your Data">
            <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.75 }}>
              Your data is used to provide the KerfOS service, send transactional emails,
              process payments via Stripe, and improve our product. We do not use your designs
              to train AI models without explicit opt-in consent.
            </p>
          </LegalSection>
          <LegalSection title="4. Data Retention">
            <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.75 }}>
              Account data is retained while your account is active and for 30 days after deletion.
              You can request export or deletion at any time via our GDPR portal.
            </p>
          </LegalSection>
        </>
      )}

      {/* Rights */}
      <LegalSection title="Your Rights">
        <LegalHighlight variant="accent">
          You have the right to access, correct, export, and delete your data at any time.
          Use our <a href="/gdpr" style={{ color: 'var(--k-amber)', textDecoration: 'none' }}>GDPR portal</a> to exercise these rights.
        </LegalHighlight>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '8px',
        }}>
          {['Access your data', 'Correct your data', 'Delete your data', 'Export your data',
            'Withdraw consent', 'Object to processing'].map(right => (
            <div key={right} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: 'var(--k-ink-3)',
              padding: '10px 12px',
              background: 'var(--k-bg-subtle)',
              border: '1px solid var(--k-border)',
              borderRadius: 'var(--k-r-sm)',
            }}>
              <span style={{ color: 'var(--k-amber)', fontWeight: 600 }}>✓</span>
              {right}
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalFooter />
    </LegalShell>
  )
}
