import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About | KerfOS',
  description: 'KerfOS — CNC cabinet design software for serious woodworkers.',
}

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--k-bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '80px 40px 64px',
        borderBottom: '1px solid var(--k-border)',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '11px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--k-ink-4)',
          marginBottom: '24px',
        }}>
          About KerfOS
        </div>
        <h1 className="k-heading" style={{ fontSize: '44px', letterSpacing: '-0.04em', maxWidth: '680px', marginBottom: '24px' }}>
          Cabinet design software that takes you seriously.
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--k-ink-3)', lineHeight: 1.65, maxWidth: '560px' }}>
          KerfOS is built for woodworkers who have a CNC and no patience for enterprise software.
          Design cabinets, generate accurate cut lists, and export G-code without a training course.
        </p>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '64px 40px' }}>
        {/* What it is */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          background: 'var(--k-border)',
          border: '1px solid var(--k-border)',
          marginBottom: '64px',
        }}>
          {[
            {
              label: 'Who it\'s for',
              body: 'DIY woodworkers with a CNC. Small cabinet shops. Anyone who finds Microvellum too expensive and too complex.',
            },
            {
              label: 'What it does',
              body: 'Cabinet builder with 3D preview, automated cut list, material optimizer, hardware finder, and G-code export.',
            },
            {
              label: 'How it\'s different',
              body: 'Designed for one person working alone. No sales call, no seat license, no training budget required.',
            },
            {
              label: 'Where it\'s going',
              body: 'AI-powered design assistant, DFM checking, community gallery, and template library already in development.',
            },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--k-surface)',
              padding: '28px 32px',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.07em',
                textTransform: 'uppercase' as const,
                color: 'var(--k-amber)',
                marginBottom: '10px',
              }}>
                {item.label}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.7, margin: 0 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>

        {/* Built by */}
        <div style={{ marginBottom: '64px' }}>
          <h2 className="k-heading" style={{ fontSize: '24px', marginBottom: '16px' }}>Built by Modology Studios</h2>
          <p style={{ fontSize: '15px', color: 'var(--k-ink-3)', lineHeight: 1.75, maxWidth: '600px' }}>
            Modology Studios builds tools for makers — physical and digital. KerfOS started as an internal tool
            for our own CNC cabinet work and became too useful not to ship. We use it ourselves.
          </p>
          <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
            <Link href="/pricing" className="k-btn k-btn-primary k-btn-sm">View pricing</Link>
            <Link href="/support" className="k-btn k-btn-ghost k-btn-sm">Get support</Link>
          </div>
        </div>

        {/* Contact */}
        <div style={{
          borderTop: '1px solid var(--k-border)',
          paddingTop: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '32px',
        }}>
          {[
            { label: 'General', value: 'hello@kerfos.com' },
            { label: 'Support', value: 'support@kerfos.com' },
            { label: 'Privacy', value: 'privacy@kerfos.com' },
          ].map(c => (
            <div key={c.label}>
              <div style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                letterSpacing: '0.07em',
                textTransform: 'uppercase' as const,
                color: 'var(--k-ink-4)',
                marginBottom: '4px',
              }}>
                {c.label}
              </div>
              <a href={`mailto:${c.value}`} style={{ fontSize: '14px', color: 'var(--k-amber)', textDecoration: 'none' }}>
                {c.value}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
