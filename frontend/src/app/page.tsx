'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { Cabinet, CanvasComponent } from '@/components/CabinetBuilder'

const CabinetPreview = dynamic(() => import('@/components/CabinetPreview'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: 'var(--k-canvas-bg)' }} />,
})

/* ─── Demo data for hero ──────────────────────────────────────────────────── */
const DEMO_CABINET: Cabinet = {
  id: 1, name: 'Kitchen Base Cabinet',
  width: 24, height: 34.5, depth: 23.75, material: 'plywood',
}
const DEMO_COMPONENTS: CanvasComponent[] = [
  { id: 'd1', type: 'box',     name: 'Cabinet Box',   width: 24,   height: 34.5, depth: 23.75, position: [0, 17.25, 0] },
  { id: 'd2', type: 'shelf',   name: 'Lower Shelf',   width: 22.5, height: 0.75, depth: 21.5,  position: [0, 10,    0] },
  { id: 'd3', type: 'shelf',   name: 'Upper Shelf',   width: 22.5, height: 0.75, depth: 21.5,  position: [0, 22,    0] },
  { id: 'd4', type: 'divider', name: 'Center Divider',width: 0.75, height: 30,   depth: 21.5,  position: [5, 16.5,  0] },
]

/* ─── Scroll Progress Bar ─────────────────────────────────────────────────── */
function ScrollBar() {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const update = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      setWidth(pct)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <div className="k-scroll-bar" style={{ width: `${width}%` }} />
}


/* ─── Feature card for bento grid ────────────────────────────────────────── */
function FeatureCard({
  title, body, tag, accent = false, large = false, mono,
}: {
  title: string
  body: string
  tag: string
  accent?: boolean
  large?: boolean
  mono?: string
}) {
  return (
    <div
      className="k-card"
      style={{
        padding: '28px',
        gridColumn: large ? 'span 2' : 'span 1',
        background: accent ? 'var(--k-ink)' : 'var(--k-surface)',
        color: accent ? 'var(--k-bg)' : 'var(--k-ink)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '20px',
        minHeight: '200px',
      }}
    >
      <div>
        <span
          className="k-label"
          style={{
            color: accent ? 'rgba(248,247,244,0.5)' : undefined,
            marginBottom: '10px',
            display: 'block',
          }}
        >
          {tag}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-sora), Sora, sans-serif',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.2,
            color: accent ? 'var(--k-bg)' : 'var(--k-ink)',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            marginTop: '8px',
            fontSize: '14px',
            lineHeight: 1.65,
            color: accent ? 'rgba(248,247,244,0.65)' : 'var(--k-ink-3)',
          }}
        >
          {body}
        </p>
      </div>
      {mono && (
        <div
          className="k-mono"
          style={{
            padding: '10px 14px',
            background: accent ? 'rgba(255,255,255,0.06)' : 'var(--k-bg-subtle)',
            borderRadius: 'var(--k-r-sm)',
            fontSize: '12px',
            color: accent ? 'rgba(255,255,255,0.7)' : 'var(--k-ink-3)',
            border: accent ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--k-border)',
            whiteSpace: 'pre-line',
          }}
        >
          {mono}
        </div>
      )}
    </div>
  )
}

/* ─── Ticker items ────────────────────────────────────────────────────────── */
const TICKER_ITEMS = [
  'Cabinet Builder', 'Cut List Generator', 'Advanced Nesting', 'G-Code Export',
  'Shapeoko', 'X-Carve', 'ShopBot', 'GRBL', 'OBJ / STL / 3MF', 'DXF Export',
  'Board Yield Optimizer', 'Scrap Tracker', 'Hardware Finder', 'Style Presets',
  'Design Doctor', 'Cost Optimizer', 'Material Selector', 'Edge Banding',
]

/* ─── Compatible machines ─────────────────────────────────────────────────── */
const MACHINES = [
  { name: 'Shapeoko',   fmt: 'GRBL' },
  { name: 'X-Carve',    fmt: 'GRBL' },
  { name: 'ShopBot',    fmt: 'SBP' },
  { name: 'Openbuilds', fmt: 'GRBL' },
  { name: 'Avid CNC',   fmt: 'FANUC' },
  { name: 'Mach3/4',    fmt: 'G-code' },
]

/* ─── Pricing tiers ───────────────────────────────────────────────────────── */
const PLANS = [
  {
    name: 'Free',
    price: 0,
    desc: 'Try it with no credit card.',
    features: ['3 projects', 'Basic templates', 'Cut list generation', 'GRBL G-code export', 'Community support'],
    cta: 'Get started free',
    highlighted: false,
  },
  {
    name: 'Hobbyist',
    price: 9,
    desc: 'For serious weekend builders.',
    features: ['Unlimited projects', 'All cabinet templates', 'Waste optimization', 'All CNC formats', '3D exports (OBJ, STL, DXF)', 'Email support'],
    cta: 'Start Hobbyist',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: 29,
    desc: 'For YouTubers and small shops.',
    features: ['Everything in Hobbyist', 'Advanced non-guillotine nesting', 'Live hardware pricing', 'Team collaboration (3 seats)', 'Priority support', 'API access'],
    cta: 'Start Pro',
    highlighted: false,
  },
  {
    name: 'Shop',
    price: 79,
    desc: 'Full production shop.',
    features: ['Everything in Pro', 'Unlimited team members', 'Custom export branding', 'Dedicated account manager', 'Phone support', 'Custom integrations'],
    cta: 'Talk to us',
    highlighted: false,
  },
]

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <ScrollBar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: 'calc(100vh - 60px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 40px',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* Left: copy */}
        <div style={{ paddingRight: '64px' }}>
          <div className="fade-up fade-up-1" style={{ marginBottom: '20px' }}>
            <span className="k-badge k-badge-amber">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--k-amber)', display: 'inline-block', flexShrink: 0 }} />
              No training course required
            </span>
          </div>

          <h1
            className="k-heading-xl fade-up fade-up-2"
            style={{ marginBottom: '24px' }}
          >
            CNC cabinet software
            <br />
            <span style={{ color: 'var(--k-ink-3)', fontWeight: 400 }}>
              built for the
            </span>{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              shop floor
              <span className="k-kerf-line" style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0 }} />
            </span>
          </h1>

          <p
            className="fade-up fade-up-3"
            style={{
              fontSize: '18px',
              lineHeight: 1.65,
              color: 'var(--k-ink-2)',
              maxWidth: '480px',
              marginBottom: '36px',
            }}
          >
            Design cabinets, generate precise cut lists, and send G-code to your CNC
            in minutes — not days. No $10,000 license. No 40-hour training video.
          </p>

          <div className="fade-up fade-up-4" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/design/builder" className="k-btn k-btn-primary k-btn-lg">
              Start designing free
            </Link>
            <Link href="/community/gallery" className="k-btn k-btn-ghost k-btn-lg">
              See what people build
            </Link>
          </div>

          <div
            className="fade-up fade-up-5"
            style={{
              marginTop: '40px',
              display: 'flex',
              gap: '28px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {[
              { val: '$0', label: 'Free tier, no credit card' },
              { val: '100%', label: 'Browser-based, no install' },
              { val: '6+', label: 'CNC machine formats' },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                    fontSize: '28px',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    color: 'var(--k-ink)',
                    lineHeight: 1,
                  }}
                >
                  {stat.val}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--k-ink-4)', marginTop: '4px', letterSpacing: '0.02em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: actual 3D canvas preview */}
        <div
          className="fade-up fade-up-3 hero-canvas-panel"
          style={{
            position: 'relative',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid var(--k-canvas-border)',
            height: '520px',
          }}
        >
          <CabinetPreview
            cabinet={DEMO_CABINET}
            material={null}
            components={DEMO_COMPONENTS}
            selectedId={null}
            onSelect={() => {}}
            onMove={() => {}}
            autoRotate
          />
          {/* "Live demo" badge */}
          <div style={{
            position: 'absolute', top: '12px', left: '12px',
            background: 'rgba(15,10,7,0.82)', backdropFilter: 'blur(8px)',
            border: '1px solid var(--k-canvas-border)',
            padding: '5px 11px', borderRadius: '3px',
            display: 'flex', alignItems: 'center', gap: '6px',
            pointerEvents: 'none',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--k-canvas-text)', letterSpacing: '0.04em' }}>
              Live demo · drag to rotate
            </span>
          </div>
          {/* CTA overlay */}
          <div style={{
            position: 'absolute', bottom: '52px', right: '12px',
          }}>
            <Link href="/design/builder" className="k-btn k-btn-sm" style={{
              background: 'rgba(6,182,212,0.15)',
              color: '#06b6d4',
              border: '1px solid rgba(6,182,212,0.3)',
              backdropFilter: 'blur(8px)',
              fontSize: '12px',
            }}>
              Open builder →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TICKER STRIP ─────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid var(--k-border)',
          borderBottom: '1px solid var(--k-border)',
          padding: '14px 0',
          background: 'var(--k-surface)',
          overflow: 'hidden',
        }}
      >
        <div className="k-ticker-wrap">
          <div className="k-ticker">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={i}
                style={{
                  padding: '0 20px',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: i % 6 === 0 ? 'var(--k-amber-dark)' : 'var(--k-ink-3)',
                  whiteSpace: 'nowrap',
                }}
              >
                {item}
                {i % 3 === 2 && <span style={{ marginLeft: '20px', color: 'var(--k-border-strong)', opacity: 0.5 }}>—</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── COMPATIBLE CNC ───────────────────────────────────────────── */}
      <section style={{ padding: '56px 40px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        <p className="k-label" style={{ marginBottom: '24px' }}>Exports G-code for</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {MACHINES.map(({ name, fmt }) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                background: 'var(--k-surface)',
                border: '1px solid var(--k-border-mid)',
                borderRadius: 'var(--k-r-sm)',
                cursor: 'default',
                transition: 'border-color 200ms ease, background 200ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(6,182,212,0.4)'
                ;(e.currentTarget as HTMLDivElement).style.background = 'var(--k-bg-subtle)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--k-border-mid)'
                ;(e.currentTarget as HTMLDivElement).style.background = 'var(--k-surface)'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--k-ink-2)' }}>{name}</span>
              <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em', color: 'var(--k-amber)', background: 'var(--k-amber-soft)', padding: '2px 6px', borderRadius: '2px' }}>{fmt}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENTO FEATURE GRID ───────────────────────────────────────── */}
      <section style={{ padding: '40px 40px 80px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ maxWidth: '560px', marginBottom: '48px' }}>
          <p className="k-label" style={{ marginBottom: '12px' }}>Everything you need</p>
          <h2 className="k-heading-lg">
            Professional-grade tools.{' '}
            <span style={{ color: 'var(--k-ink-3)', fontWeight: 400 }}>Without the enterprise price.</span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
          className="bento-grid"
        >
          <FeatureCard
            tag="Design"
            title="Parametric Cabinet Builder"
            body="Define your dimensions once. KerfOS generates every part, every joint, and every cut — automatically. Framed or frameless, inset or overlay."
            large
          />
          <FeatureCard
            tag="Optimize"
            title="94%+ Board Yield"
            body="Advanced nesting cuts waste before you run a single line. See exactly what sheets you need before touching your material."
            mono={`G0 X0 Y0 Z5.0000\nG1 X24.000 F300\nG1 Y34.500 F300`}
            accent
          />
          <FeatureCard
            tag="Export"
            title="G-Code for Every Machine"
            body="Shapeoko, X-Carve, ShopBot, GRBL — pick your post-processor and export in seconds."
          />
          <FeatureCard
            tag="Materials"
            title="Live Hardware Pricing"
            body="Know your project cost before you order. Live pricing from major suppliers, auto-updated."
          />
          <FeatureCard
            tag="Tools"
            title="Design Doctor"
            body="Run a pre-flight check on any design. KerfOS flags clearance issues, unsupported spans, and hardware conflicts before they become expensive mistakes."
            large
          />
          <FeatureCard
            tag="Community"
            title="Gallery &amp; Templates"
            body="Pull in a proven template or share your finished kitchen with the community."
          />
        </div>
      </section>

      {/* ── VS MICROVELLUM ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 40px', background: 'var(--k-surface)', borderTop: '1px solid var(--k-border)', borderBottom: '1px solid var(--k-border)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p className="k-label" style={{ marginBottom: '12px', textAlign: 'center' }}>Why KerfOS</p>
          <h2 className="k-heading-lg" style={{ textAlign: 'center', marginBottom: '48px' }}>
            The honest comparison
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '32px', alignItems: 'start' }} className="compare-grid">
            {/* KerfOS column */}
            <div>
              <div style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.03em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>KerfOS</span>
                <span className="k-badge k-badge-amber" style={{ fontWeight: 600 }}>You&apos;re here</span>
              </div>
              {[
                ['Starts free', '0 training required'],
                ['Web-based — works anywhere', 'Runs in your browser'],
                ['From $9/month', 'No per-seat enterprise license'],
                ['Designed for CNC hobbyists', 'Shop-class learning curve: none'],
                ['G-code for every major CNC', 'Not locked to one machine brand'],
              ].map(([a, b]) => (
                <div key={a} style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--k-amber-soft)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4.2 7.2L8 3" stroke="#0e7490" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--k-ink)', letterSpacing: '-0.01em' }}>{a}</div>
                    <div style={{ fontSize: '12px', color: 'var(--k-ink-3)', marginTop: '1px' }}>{b}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '52px' }}>
              <div style={{ width: '1px', height: '280px', background: 'var(--k-border-mid)' }} />
            </div>

            {/* Microvellum column */}
            <div>
              <div style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', fontWeight: 600, fontSize: '20px', letterSpacing: '-0.03em', color: 'var(--k-ink-3)', marginBottom: '24px' }}>
                Microvellum
              </div>
              {[
                ['$3,500–7,000+ license', 'Plus annual maintenance fees'],
                ['AutoCAD dependency', 'Required as a base platform'],
                ['40+ hour training', 'Video library + certification tracks'],
                ['Enterprise-first design', 'Built for production shops of 10+'],
                ['Windows only', 'On-premise installation required'],
              ].map(([a, b]) => (
                <div key={a} style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,0,0,0.04)', border: '1px solid var(--k-border-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 3L7 7M7 3L3 7" stroke="var(--k-ink-4)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--k-ink-2)', letterSpacing: '-0.01em' }}>{a}</div>
                    <div style={{ fontSize: '12px', color: 'var(--k-ink-4)', marginTop: '1px' }}>{b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '96px 40px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p className="k-label" style={{ marginBottom: '12px' }}>Pricing</p>
          <h2 className="k-heading-lg">
            Pay for what you use.{' '}
            <span style={{ color: 'var(--k-ink-3)', fontWeight: 400 }}>Cancel anytime.</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="pricing-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                padding: '28px 24px',
                borderRadius: 'var(--k-r-lg)',
                border: plan.highlighted ? '1.5px solid var(--k-amber)' : '1px solid var(--k-border)',
                background: 'var(--k-surface)',
                boxShadow: plan.highlighted ? 'var(--k-shadow-md), 0 0 0 4px var(--k-amber-soft)' : 'var(--k-shadow-xs)',
                position: 'relative',
              }}
            >
              {plan.highlighted && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-13px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <span className="k-badge k-badge-amber">Most popular</span>
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.025em', marginBottom: '4px' }}>{plan.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--k-ink-3)' }}>{plan.desc}</div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', fontWeight: 700, fontSize: '36px', letterSpacing: '-0.04em', color: 'var(--k-ink)' }}>
                  {plan.price === 0 ? 'Free' : `$${plan.price}`}
                </span>
                {plan.price > 0 && (
                  <span style={{ fontSize: '13px', color: 'var(--k-ink-3)', marginLeft: '4px' }}>/mo</span>
                )}
              </div>

              <Link
                href="/pricing"
                className={`k-btn ${plan.highlighted ? 'k-btn-amber' : 'k-btn-ghost'}`}
                style={{ width: '100%', justifyContent: 'center', marginBottom: '20px', display: 'inline-flex' }}
              >
                {plan.cta}
              </Link>

              <div style={{ borderTop: '1px solid var(--k-border)', paddingTop: '16px' }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: '2px', flexShrink: 0 }}>
                      <path d="M3 7L6 10L11 4" stroke={plan.highlighted ? 'var(--k-amber-dark)' : 'var(--k-ink-3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontSize: '13px', color: 'var(--k-ink-2)', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section style={{ padding: '80px 40px', background: 'var(--k-ink)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: 'var(--k-bg)',
              marginBottom: '20px',
            }}
          >
            Your first cut list is 10 minutes away
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(248,247,244,0.6)', lineHeight: 1.65, marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Free to start. No credit card. Works in the browser on any machine — even out in the shop on an iPad.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/design/builder" className="k-btn k-btn-amber k-btn-lg">
              Open the builder
            </Link>
            <Link
              href="/community/gallery"
              className="k-btn k-btn-lg"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--k-bg)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              Browse the gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{ padding: '48px 40px 40px', borderTop: '1px solid var(--k-border)', background: 'var(--k-bg)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px' }} className="footer-grid">
          <div>
            <div style={{ fontFamily: 'var(--font-sora), Sora, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.04em', marginBottom: '10px', display: 'flex', alignItems: 'baseline', gap: '1px' }}>
              <span style={{ color: '#0a0e1c' }}>Kerf</span>
              <span style={{ color: '#06b6d4', fontWeight: 400 }}>OS</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--k-ink-3)', lineHeight: 1.65, maxWidth: '260px' }}>
              Precision cabinet software for woodworkers who know what a kerf is.
            </p>
          </div>
          {[
            { title: 'Product', links: [['Cabinet Builder', '/design/builder'], ['Cut List', '/optimize/cutlist'], ['G-Code Export', '/export/gcode'], ['Pricing', '/pricing']] },
            { title: 'Learn', links: [['Gallery', '/community/gallery'], ['Templates', '/design/templates'], ['Hardware Finder', '/hardware/finder'], ['Community', '/community']] },
            { title: 'Company', links: [['About', '/about'], ['Changelog', '/changelog'], ['Support', '/support'], ['Privacy', '/privacy']] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '16px' }}>{col.title}</div>
              {col.links.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  style={{ display: 'block', fontSize: '13px', color: 'var(--k-ink-3)', textDecoration: 'none', marginBottom: '8px', transition: 'color 120ms ease' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--k-ink)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--k-ink-3)' }}
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            maxWidth: '1280px',
            margin: '40px auto 0',
            paddingTop: '24px',
            borderTop: '1px solid var(--k-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--k-ink-4)' }}>© 2026 KerfOS. All rights reserved.</span>
          <span className="k-mono" style={{ fontSize: '11px', color: 'var(--k-ink-4)' }}>
            kerf /kərf/ n. — the slot made by a cutting tool
          </span>
        </div>
      </footer>

      {/* ── Responsive overrides ──────────────────────────────────────── */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; padding: 48px 24px !important; }
          .hero-grid > div:first-child { padding-right: 0 !important; }
          .hero-canvas-panel { display: none !important; }
          .bento-grid { grid-template-columns: 1fr !important; }
          .bento-grid > div[style*="span 2"] { grid-column: span 1 !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
          .compare-grid > div:nth-child(2) { display: none !important; }
          .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
