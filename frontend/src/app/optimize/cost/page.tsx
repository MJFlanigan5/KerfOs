import { PageHeader } from '@/components/PageHeader'

export default function CostOptimizerPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'optimize', href: '/optimize' }, { label: 'cost-optimizer' }]}
        title="Cost Optimizer"
        subtitle="Analyze your project and find material substitutions that cut cost without cutting quality."
      />
      <div
        style={{
          padding: '48px',
          border: '1px solid var(--k-border)',
          background: 'var(--k-surface)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          minHeight: '240px',
          textAlign: 'center',
        }}
      >
        <span className="k-label" style={{ color: 'var(--k-amber)' }}>Pro Feature</span>
        <p style={{ fontSize: '15px', color: 'var(--k-ink-3)', maxWidth: '360px', lineHeight: 1.6 }}>
          Cost Optimizer is available on the Pro plan. Upgrade to analyze substitutions and track spend across projects.
        </p>
      </div>
    </div>
  )
}
