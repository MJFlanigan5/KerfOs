'use client'
import SketchToDesign from '@/components/SketchToDesign'
import { PageHeader } from '@/components/PageHeader'

export default function SketchPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'design', href: '/design' }, { label: 'sketch-import' }]}
        title="Sketch Import"
        subtitle="Snap a photo of your hand sketch and convert it directly to a cabinet plan."
      />
      <SketchToDesign onDesignGenerated={() => {}} />
    </div>
  )
}
