import TemplateGallery from '@/components/TemplateGallery'
import { PageHeader } from '@/components/PageHeader'

export default function TemplatesPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'design', href: '/design' }, { label: 'templates' }]}
        title="Project Templates"
        subtitle="Full kitchen, bath, laundry, and shop project starting points."
      />
      <TemplateGallery />
    </div>
  )
}
