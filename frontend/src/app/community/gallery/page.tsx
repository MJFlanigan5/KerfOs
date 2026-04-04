'use client'
import CommunityGallery from '@/components/CommunityGallery'
import { PageHeader } from '@/components/PageHeader'

export default function GalleryPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'community', href: '/community' }, { label: 'gallery' }]}
        title="Build Gallery"
        subtitle="Kitchens, baths, shop storage, and furniture from the KerfOS community."
      />
      <CommunityGallery />
    </div>
  )
}
