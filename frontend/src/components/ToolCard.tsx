'use client'

import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'

interface ToolCardProps {
  href: string
  label: string
  description: string
  icon: LucideIcon
  plan?: 'Free' | 'Hobbyist' | 'Pro' | 'Shop'
  featured?: boolean
}

const planColor: Record<string, string> = {
  Free:     'var(--k-ink-4)',
  Hobbyist: 'var(--k-amber)',
  Pro:      'var(--k-amber)',
  Shop:     'var(--k-ink)',
}

export function ToolCard({ href, label, description, icon: Icon, plan = 'Free', featured = false }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="tool-card"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '22px 24px',
        background: featured ? 'var(--k-ink)' : 'var(--k-surface)',
        border: '1px solid var(--k-border)',
        textDecoration: 'none',
        position: 'relative',
        transition: 'border-color 150ms ease, box-shadow 150ms ease, background 150ms ease',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = featured ? 'var(--k-ink)' : 'var(--k-border-strong)'
        el.style.boxShadow = 'var(--k-shadow-md)'
        const arrow = el.querySelector('.tool-arrow') as HTMLElement | null
        if (arrow) arrow.style.transform = 'translateX(4px)'
        const icon = el.querySelector('.tool-icon') as HTMLElement | null
        if (icon && !featured) {
          icon.style.background = 'var(--k-ink)'
          icon.style.color = 'var(--k-bg)'
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'var(--k-border)'
        el.style.boxShadow = 'none'
        const arrow = el.querySelector('.tool-arrow') as HTMLElement | null
        if (arrow) arrow.style.transform = 'translateX(0)'
        const icon = el.querySelector('.tool-icon') as HTMLElement | null
        if (icon && !featured) {
          icon.style.background = featured ? 'rgba(255,255,255,0.1)' : 'var(--k-bg-subtle)'
          icon.style.color = 'var(--k-ink)'
        }
      }}
    >
      {/* Icon block */}
      <div
        className="tool-icon"
        style={{
          width: '36px',
          height: '36px',
          background: featured ? 'rgba(255,255,255,0.12)' : 'var(--k-bg-subtle)',
          border: `1px solid ${featured ? 'rgba(255,255,255,0.1)' : 'var(--k-border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: featured ? 'rgba(255,255,255,0.9)' : 'var(--k-ink)',
          transition: 'background 150ms ease, color 150ms ease',
        }}
      >
        <Icon size={15} strokeWidth={1.75} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px', gap: '12px' }}>
          <span
            style={{
              fontFamily: 'var(--font-sora), Sora, sans-serif',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: featured ? '#fff' : 'var(--k-ink)',
              lineHeight: 1.2,
            }}
          >
            {label}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.07em',
                textTransform: 'uppercase' as const,
                color: featured ? 'rgba(255,255,255,0.45)' : planColor[plan] ?? 'var(--k-ink-4)',
              }}
            >
              {plan}
            </span>
            <svg
              className="tool-arrow"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{
                color: featured ? 'rgba(255,255,255,0.4)' : 'var(--k-ink-4)',
                transition: 'transform 150ms var(--k-ease)',
              }}
            >
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.55,
            color: featured ? 'rgba(255,255,255,0.5)' : 'var(--k-ink-3)',
          }}
        >
          {description}
        </p>
      </div>
    </Link>
  )
}
