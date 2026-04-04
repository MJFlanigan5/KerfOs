'use client'
import DesignDoctor from '@/components/DesignDoctor'
import { PageHeader } from '@/components/PageHeader'

const sampleDesign = {
  id: 'sample',
  name: 'Base Cabinet',
  width: 36,
  height: 34.5,
  depth: 24,
  material: 'Birch Plywood',
}

export default function DesignDoctorPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'optimize', href: '/optimize' }, { label: 'design-doctor' }]}
        title="Design Doctor"
        subtitle="Automated structural checks, joinery validation, and clearance analysis before you cut."
      />
      <DesignDoctor design={sampleDesign} />
    </div>
  )
}
