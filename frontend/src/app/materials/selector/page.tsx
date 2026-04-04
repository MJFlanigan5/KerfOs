'use client'
import MaterialSelector from '@/components/MaterialSelector'
import { PageHeader } from '@/components/PageHeader'

export default function MaterialSelectorPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'materials', href: '/materials' }, { label: 'selector' }]}
        title="Material Selector"
        subtitle="Choose sheet goods, hardwoods, and composites for your project."
      />
      <MaterialSelector
        selected={null}
        onSelect={(material) => console.log('Selected', material)}
      />
    </div>
  )
}
