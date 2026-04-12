import { Metadata } from 'next'
import Link from 'next/link'
import { LegalShell, LegalSection, LegalCardGrid, LegalCard, LegalFooter } from '@/components/LegalShell'

export const metadata: Metadata = {
  title: 'Support | KerfOS',
  description: 'Get help with KerfOS — documentation, FAQs, and direct support.',
}

const FAQS = [
  {
    q: 'How do I export a cut list to CSV?',
    a: 'Open your project, go to Cut List, and click the Export button in the top right. Choose CSV or PDF. The export includes part names, dimensions, material, and edge banding notes.',
  },
  {
    q: 'Can I import from SketchUp or Fusion 360?',
    a: 'Not directly. KerfOS uses its own cabinet model format. You can re-enter dimensions manually — most cabinet projects take under 10 minutes to set up from scratch.',
  },
  {
    q: 'My G-code output isn\'t cutting at the right depth. What\'s wrong?',
    a: 'Check your material thickness setting in the project. KerfOS uses the material thickness to set pass depth. If your sheet is non-standard, edit it under Project → Materials.',
  },
  {
    q: 'Does KerfOS support frameless and face-frame cabinets?',
    a: 'Yes — both styles are fully supported. Switch between them per-cabinet in the cabinet settings panel. Overlay calculations adjust automatically based on style.',
  },
  {
    q: 'How does the nest optimizer work?',
    a: 'The optimizer arranges all parts from your cut list onto full sheets to minimize waste. It runs automatically when you open the Sheet Layout view. You can drag parts manually if needed.',
  },
  {
    q: 'Is my data backed up?',
    a: 'Yes. Projects are saved to our servers in real time. You can also export a full project backup from Settings → Data.',
  },
]

export default function SupportPage() {
  return (
    <LegalShell
      title="Support"
      subtitle="We're a small team. We respond fast."
    >
      {/* Contact cards */}
      <LegalCardGrid>
        <LegalCard label="Email Support">
          <a href="mailto:support@kerfos.com" style={{ color: 'var(--k-amber)', textDecoration: 'none' }}>
            support@kerfos.com
          </a>
          {' '}— response within one business day.
        </LegalCard>
        <LegalCard label="Bug Reports">
          Found something broken?{' '}
          <a href="mailto:bugs@kerfos.com" style={{ color: 'var(--k-amber)', textDecoration: 'none' }}>
            bugs@kerfos.com
          </a>
          {' '}with steps to reproduce.
        </LegalCard>
        <LegalCard label="Feature Requests">
          Ideas welcome at{' '}
          <a href="mailto:hello@kerfos.com" style={{ color: 'var(--k-amber)', textDecoration: 'none' }}>
            hello@kerfos.com
          </a>
          . We read everything.
        </LegalCard>
        <LegalCard label="Billing">
          Subscription questions? Email{' '}
          <a href="mailto:billing@kerfos.com" style={{ color: 'var(--k-amber)', textDecoration: 'none' }}>
            billing@kerfos.com
          </a>
          . Cancel anytime — no hoops.
        </LegalCard>
      </LegalCardGrid>

      {/* Quick links */}
      <LegalSection title="Documentation">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            { label: 'Getting Started', desc: 'Create your first cabinet in 5 minutes' },
            { label: 'Cut List Guide', desc: 'Export formats, grouping, and edge banding' },
            { label: 'G-code Export', desc: 'CNC setup, post-processors, and toolpaths' },
            { label: 'Material Settings', desc: 'Plywood grades, sheet sizes, and costs' },
            { label: 'Hardware Finder', desc: 'Matching hinges, slides, and pulls to your build' },
            { label: 'Keyboard Shortcuts', desc: 'Full shortcut reference for power users' },
          ].map(item => (
            <div key={item.label} style={{
              padding: '14px 16px',
              background: 'var(--k-surface)',
              border: '1px solid var(--k-border)',
              borderRadius: 'var(--k-r-md)',
              cursor: 'default',
            }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--k-ink)',
                marginBottom: '3px',
              }}>
                {item.label}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--k-ink-4)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--k-ink-4)', marginTop: '12px', marginBottom: 0 }}>
          Full docs are in progress. Email us if you need help with anything above — we&rsquo;ll reply with the answer and use your question to prioritize the next doc.
        </p>
      </LegalSection>

      {/* FAQ */}
      <LegalSection title="Common Questions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--k-border)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-md)', overflow: 'hidden' }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: 'var(--k-surface)', padding: '18px 20px' }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--k-ink)',
                marginBottom: '6px',
              }}>
                {faq.q}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--k-ink-3)', lineHeight: 1.65, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </LegalSection>

      {/* Status + links */}
      <LegalSection title="Other Resources">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/changelog" className="k-btn k-btn-ghost k-btn-sm">Changelog</Link>
          <Link href="/pricing" className="k-btn k-btn-ghost k-btn-sm">Pricing</Link>
          <Link href="/gdpr" className="k-btn k-btn-ghost k-btn-sm">Data & Privacy</Link>
          <Link href="/terms" className="k-btn k-btn-ghost k-btn-sm">Terms of Service</Link>
        </div>
      </LegalSection>

      <LegalFooter />
    </LegalShell>
  )
}
