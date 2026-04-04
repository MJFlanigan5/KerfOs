'use client'
import DesignExporter from '@/components/DesignExporter'
import { PageHeader } from '@/components/PageHeader'

export default function Export3DPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px' }}>
      <PageHeader
        crumbs={[{ label: 'kerfos', href: '/' }, { label: 'export', href: '/export' }, { label: '3d-cad' }]}
        title="3D / CAD Export"
        subtitle="Export OBJ, STL, 3MF, and DXF files for visualization or downstream fabrication."
      />
      <DesignExporter cabinet={null} />
    </div>
  )
}
