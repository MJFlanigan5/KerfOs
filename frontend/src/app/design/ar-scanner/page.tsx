import ARScanner from '@/components/ARScanner'
import { PageHeader } from '@/components/PageHeader'

export default function ARScannerPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'design', href: '/design' }, { label: 'ar-scanner' }]}
        title="AR Room Scanner"
        subtitle="Scan your space with your phone camera to auto-populate room dimensions."
      />
      <ARScanner />
    </div>
  )
}
