'use client'

import Link from 'next/link'
import { MapPin, ShoppingCart, Calculator, Thermometer, History } from 'lucide-react'
import { ToolCard } from '@/components/ToolCard'
import { PageHeader } from '@/components/PageHeader'

const tools = [
  {
    href: '/tools/localization',
    label: 'Local Suppliers',
    description: 'Find lumber yards and hardware stores near you with live stock and pricing',
    icon: MapPin,
    plan: 'Free' as const,
    featured: true,
  },
  {
    href: '/tools/stores',
    label: 'Store Integration',
    description: "Order materials directly from Home Depot, Lowe's, and more",
    icon: ShoppingCart,
    plan: 'Hobbyist' as const,
  },
  {
    href: '/tools/scratch-build',
    label: 'Scratch Build Calc',
    description: 'Calculate what tools and time a build from scratch requires',
    icon: Calculator,
    plan: 'Free' as const,
  },
  {
    href: '/tools/climate',
    label: 'Climate Adjustment',
    description: 'Adjust tolerances for your local climate and humidity automatically',
    icon: Thermometer,
    plan: 'Hobbyist' as const,
  },
  {
    href: '/tools/history',
    label: 'Version History',
    description: 'Browse and restore previous versions of your designs',
    icon: History,
    plan: 'Hobbyist' as const,
  },
]

export default function ToolsPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'tools' }]}
        title="Tools"
        subtitle="Utilities to plan, source, and manage your builds."
        action={
          <Link href="/tools/localization" className="k-btn k-btn-primary k-btn-sm">
            Find suppliers
          </Link>
        }
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1px',
          background: 'var(--k-border)',
          border: '1px solid var(--k-border)',
        }}
      >
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </div>
  )
}
