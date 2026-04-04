'use client'
import CutListExporter from '@/components/CutListExporter'
import { PageHeader } from '@/components/PageHeader'

const defaultCabinet = {
  id: 1,
  name: 'Base Cabinet',
  width: 36,
  height: 34.5,
  depth: 24,
  material: 'Birch Plywood',
}

export default function CutListPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'optimize', href: '/optimize' }, { label: 'cut-list' }]}
        title="Cut List Export"
        subtitle="Generate an optimized cut list from your cabinet design."
      />
      <CutListExporter cabinets={[defaultCabinet]} materials={{}} />
    </div>
  )
}
