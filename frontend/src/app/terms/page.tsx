import { Metadata } from 'next'
import { LegalShell, LegalSection, LegalCardGrid, LegalCard, LegalHighlight, LegalFooter } from '@/components/LegalShell'

export const metadata: Metadata = {
  title: 'Terms of Service | KerfOS',
  description: 'KerfOS terms of service — rules and guidelines for using our platform.',
}

async function getTerms() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/gdpr/terms-of-service`,
      { cache: 'no-store', signal: AbortSignal.timeout(4000) }
    )
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export default async function TermsPage() {
  const terms = await getTerms()

  return (
    <LegalShell
      title="Terms of Service"
      badge={terms?.version ? `v${terms.version}` : 'v1.0'}
      subtitle={terms?.last_updated ? `Last updated ${terms.last_updated}` : 'Last updated March 2026'}
    >
      {/* Key points */}
      <LegalCardGrid>
        <LegalCard label="You Own Your Designs">
          All cabinet projects you create are your intellectual property. We claim no rights.
        </LegalCard>
        <LegalCard label="Your Data is Protected">
          Industry-standard encryption at rest and in transit. No data sold to third parties.
        </LegalCard>
        <LegalCard label="Cancel Anytime">
          No long-term contracts. Cancel your subscription at any time, effective immediately.
        </LegalCard>
        <LegalCard label="Questions?">
          Email support@kerfos.com — we respond within one business day.
        </LegalCard>
      </LegalCardGrid>

      {/* Dynamic sections from API, or static fallback */}
      {terms?.sections?.map((section: { title: string; content: string }, i: number) => (
        <LegalSection key={i} title={section.title}>
          <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.75 }}>
            {section.content}
          </p>
        </LegalSection>
      )) ?? (
        <>
          <LegalSection title="1. Acceptance of Terms">
            <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.75 }}>
              By creating a KerfOS account or using our services, you agree to these terms.
              If you do not agree, do not use KerfOS.
            </p>
          </LegalSection>
          <LegalSection title="2. Permitted Use">
            <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.75 }}>
              KerfOS is licensed for personal and commercial cabinet design work. You may not
              resell access to the platform, reverse-engineer the software, or use it to generate
              content that violates applicable law.
            </p>
          </LegalSection>
          <LegalSection title="3. Subscriptions and Billing">
            <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.75 }}>
              Paid plans are billed monthly or annually via Stripe. You may cancel at any time.
              Refunds are available within 14 days of initial purchase; no refunds on renewals.
            </p>
          </LegalSection>
          <LegalSection title="4. Intellectual Property">
            <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.75 }}>
              You retain full ownership of all designs created in KerfOS. We retain ownership
              of the KerfOS software, trademarks, and underlying technology.
            </p>
          </LegalSection>
          <LegalSection title="5. Limitation of Liability">
            <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.75 }}>
              KerfOS is provided &ldquo;as is.&rdquo; We are not liable for losses resulting from
              manufacturing errors, inaccurate cut lists, or reliance on AI-generated suggestions.
              Always verify dimensions before cutting.
            </p>
          </LegalSection>
        </>
      )}

      <LegalHighlight>
        By using KerfOS you agree to these terms. Questions? Email{' '}
        <a href="mailto:support@kerfos.com" style={{ color: 'var(--k-amber)', textDecoration: 'none' }}>
          support@kerfos.com
        </a>
      </LegalHighlight>

      <LegalFooter />
    </LegalShell>
  )
}
