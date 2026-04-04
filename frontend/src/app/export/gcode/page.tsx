'use client'
import GCodeExporter from '@/components/GCodeExporter'
import { PageHeader } from '@/components/PageHeader'

const defaultCabinet = {
  id: 1,
  name: 'Base Cabinet',
  width: 36,
  height: 34.5,
  depth: 24,
  material: 'Birch Plywood',
}

export default function GCodePage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'export', href: '/export' }, { label: 'g-code' }]}
        title="G-Code Export"
        subtitle="Export toolpaths for ShopBot, Shapeoko, X-Carve, and any GRBL-based machine."
      />
      <GCodeExporter cabinets={[defaultCabinet]} />
    </div>
  )
}
