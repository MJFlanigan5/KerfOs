import HardwareRecommendations from '@/components/HardwareRecommendations'
import { PageHeader } from '@/components/PageHeader'

export default function RecommendationsPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'hardware', href: '/hardware' }, { label: 'recommendations' }]}
        title="Smart Recommendations"
        subtitle="AI-suggested hardware based on your cabinet style, dimensions, and budget."
      />
      <HardwareRecommendations />
    </div>
  )
}
