'use client'

import { useState } from 'react'
import { SUBSCRIPTION_PLANS, type PlanId } from '@/lib/stripe'

const PLAN_ORDER: PlanId[] = ['free', 'hobbyist', 'pro', 'shop']

const HIGHLIGHTED: PlanId = 'hobbyist'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSelect = async (planId: PlanId) => {
    if (planId === 'free') {
      window.location.href = '/register'
      return
    }

    setLoading(planId)
    setError(null)

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      })

      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Checkout failed')
      }

      window.location.href = data.url
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(null)
    }
  }

  return (
    <div style={{ padding: '96px 40px', background: 'var(--k-bg-subtle)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p className="k-label" style={{ marginBottom: '16px' }}>Pricing</p>
          <h1 style={{
            fontFamily: 'var(--font-sora), Sora, sans-serif',
            fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700,
            letterSpacing: '-0.04em', lineHeight: 1.05,
            color: 'var(--k-ink)', marginBottom: '20px',
          }}>
            Simple, transparent pricing
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--k-ink-3)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Free to start. Upgrade when you need more projects, formats, or a team.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            maxWidth: '480px', margin: '0 auto 32px',
            padding: '12px 16px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '4px', color: '#ef4444', fontSize: '14px', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          alignItems: 'start',
        }} className="pricing-grid">
          {PLAN_ORDER.map(planId => {
            const plan = SUBSCRIPTION_PLANS[planId]
            const isHighlighted = planId === HIGHLIGHTED
            const isLoading = loading === planId

            return (
              <div
                key={planId}
                style={{
                  background: isHighlighted ? 'var(--k-ink)' : 'var(--k-bg)',
                  border: isHighlighted ? '1px solid rgba(6,182,212,0.3)' : '1px solid var(--k-border)',
                  borderRadius: '6px',
                  padding: '32px 28px',
                  position: 'relative',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                {isHighlighted && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    background: '#06b6d4', color: '#0a0e1c',
                    fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', padding: '3px 12px', borderRadius: '2px',
                    whiteSpace: 'nowrap',
                  }}>Most popular</div>
                )}

                <p style={{
                  fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isHighlighted ? 'rgba(245,240,235,0.4)' : 'var(--k-ink-4)',
                  marginBottom: '12px',
                }}>{plan.name}</p>

                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{
                    fontFamily: 'var(--font-sora), Sora, sans-serif',
                    fontSize: '40px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1,
                    color: isHighlighted ? '#f5f0eb' : 'var(--k-ink)',
                  }}>
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span style={{ fontSize: '13px', color: isHighlighted ? 'rgba(245,240,235,0.4)' : 'var(--k-ink-4)' }}>/mo</span>
                  )}
                </div>

                <p style={{
                  fontSize: '12px', color: isHighlighted ? 'rgba(245,240,235,0.45)' : 'var(--k-ink-4)',
                  marginBottom: '28px', lineHeight: 1.6,
                }}>
                  {planId === 'free'      && 'For trying it out'}
                  {planId === 'hobbyist'  && 'For serious weekend builders'}
                  {planId === 'pro'       && 'For YouTubers and small shops'}
                  {planId === 'shop'      && 'Full production shop'}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flex: 1 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{
                      display: 'flex', gap: '10px', alignItems: 'flex-start',
                      marginBottom: '10px', fontSize: '13px',
                      color: isHighlighted ? 'rgba(245,240,235,0.65)' : 'var(--k-ink-2)',
                    }}>
                      <span style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: '1px',
                        background: isHighlighted ? 'rgba(6,182,212,0.15)' : 'var(--k-amber-soft)',
                        border: `1px solid ${isHighlighted ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4L3 6.5L7 1.5" stroke={isHighlighted ? '#06b6d4' : 'var(--k-amber-dark)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelect(planId)}
                  disabled={loading !== null}
                  style={{
                    width: '100%', padding: '11px 16px',
                    borderRadius: '3px', border: 'none', cursor: loading !== null ? 'not-allowed' : 'pointer',
                    fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em',
                    opacity: loading !== null && !isLoading ? 0.5 : 1,
                    transition: 'opacity 150ms',
                    background: isHighlighted ? '#06b6d4' : planId === 'free' ? 'var(--k-surface)' : 'var(--k-ink)',
                    color: isHighlighted ? '#0a0e1c' : planId === 'free' ? 'var(--k-ink-2)' : '#f5f0eb',
                  }}
                >
                  {isLoading ? 'Redirecting…' : planId === 'free' ? 'Get started free' : `Start ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '13px', color: 'var(--k-ink-4)' }}>
          All plans include SSL, automatic backups, and browser-based access — no software to install.
          Cancel anytime.
        </p>

      </div>
    </div>
  )
}
