import HardwareFinder from '@/components/HardwareFinder'
import { PageHeader } from '@/components/PageHeader'

export default function HardwareFinderPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'hardware', href: '/hardware' }, { label: 'finder' }]}
        title="Hardware Finder"
        subtitle="Browse hinges, drawer slides, pulls, and fasteners matched to your cabinet dimensions."
      />
      <HardwareFinder />
    </div>
  )
}
