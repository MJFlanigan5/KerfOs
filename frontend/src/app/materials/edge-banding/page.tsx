import EdgeBanding from '@/components/EdgeBanding'
import { PageHeader } from '@/components/PageHeader'

export default function EdgeBandingPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'materials', href: '/materials' }, { label: 'edge-banding' }]}
        title="Edge Banding"
        subtitle="Configure PVC, veneer, or solid wood banding on any exposed panel edge."
      />
      <EdgeBanding />
    </div>
  )
}
