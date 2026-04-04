import { PageHeader } from '@/components/PageHeader'

export default function BoardYieldPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'optimize', href: '/optimize' }, { label: 'board-yield' }]}
        title="Board Yield"
        subtitle="Visualize sheet utilization and track material efficiency across every project."
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
        <span className="k-label">Coming soon</span>
        <p style={{ fontSize: '15px', color: 'var(--k-ink-3)', maxWidth: '360px', lineHeight: 1.6 }}>
          Board Yield visualization is in active development. You&apos;ll see live utilization charts per sheet here.
        </p>
      </div>
    </div>
  )
}
