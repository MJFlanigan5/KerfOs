import AdvancedNesting from '@/components/AdvancedNesting'
import { PageHeader } from '@/components/PageHeader'

export default function NestingPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'optimize', href: '/optimize' }, { label: 'nesting' }]}
        title="Advanced Nesting"
        subtitle="Non-guillotine nesting algorithm that places every part for maximum sheet yield."
      />
      <AdvancedNesting />
    </div>
  )
}
