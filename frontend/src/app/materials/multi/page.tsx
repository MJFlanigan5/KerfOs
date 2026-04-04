import MultiMaterialProjectManager from '@/components/MultiMaterialProjectManager'
import { PageHeader } from '@/components/PageHeader'

export default function MultiMaterialPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'materials', href: '/materials' }, { label: 'multi-material' }]}
        title="Multi-Material Projects"
        subtitle="Combine different sheet goods and species in a single project with separate cut lists."
      />
      <MultiMaterialProjectManager />
    </div>
  )
}
