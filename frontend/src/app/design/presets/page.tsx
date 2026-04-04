'use client'
import StylePresetsGallery from '@/components/StylePresetsGallery'
import { PageHeader } from '@/components/PageHeader'

export default function PresetsPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'design', href: '/design' }, { label: 'presets' }]}
        title="Style Presets"
        subtitle="Start from Shaker, slab, inset, beadboard, and other professional door profiles."
      />
      <StylePresetsGallery onApplyPreset={() => {}} />
    </div>
  )
}
