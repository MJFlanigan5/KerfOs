import ScrapTracker from '@/components/ScrapTracker'
import { PageHeader } from '@/components/PageHeader'

export default function ScrapPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'optimize', href: '/optimize' }, { label: 'scrap-tracker' }]}
        title="Scrap Tracker"
        subtitle="Log your offcuts and pull them into future projects before buying new sheet goods."
      />
      <ScrapTracker />
    </div>
  )
}
