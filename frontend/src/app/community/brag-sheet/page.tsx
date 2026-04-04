import { PageHeader } from '@/components/PageHeader'

export default function BragSheetPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'community', href: '/community' }, { label: 'brag-sheet' }]}
        title="Brag Sheet"
        subtitle="Show the community what you built. Upload photos, share your cut list, and get feedback."
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
          Brag Sheet is launching with community features. Sign up to be first on the list.
        </p>
      </div>
    </div>
  )
}
