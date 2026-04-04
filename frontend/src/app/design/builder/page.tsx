import { CabinetBuilder } from '@/components/CabinetBuilder'
import { PageHeader } from '@/components/PageHeader'

export default function BuilderPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'design', href: '/design' }, { label: 'builder' }]}
        title="Cabinet Builder"
        subtitle="Design cabinets parametrically. Every dimension updates the cut list in real time."
      />
      <CabinetBuilder />
    </div>
  )
}
