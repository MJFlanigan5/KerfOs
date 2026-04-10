'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const CabinetPreview = dynamic(() => import('./CabinetPreview'), { ssr: false })

export interface Material {
  id: number | string
  name: string
  price?: number
  thickness?: number
  type?: string
  pricePerSqFt?: number
  supplier?: string
}

export interface CabinetComponent {
  id: string
  name: string
  width: number
  height: number
  depth?: number
  material?: string
  materialId?: string
  quantity?: number
}

export interface Cabinet {
  id: number
  name: string
  width: number
  height: number
  depth: number
  material: string
  materialId?: string
  components?: CabinetComponent[]
}

const PALETTE_ITEMS = [
  { id: 'box',      label: 'Box' },
  { id: 'door',     label: 'Door' },
  { id: 'drawer',   label: 'Drawer' },
  { id: 'shelf',    label: 'Shelf' },
  { id: 'divider',  label: 'Divider' },
  { id: 'toe-kick', label: 'Toe Kick' },
]

const MATERIALS = [
  { id: 1, name: 'Birch Plywood',  price: 65.99, type: 'plywood',  thickness: 0.75 },
  { id: 2, name: 'MDF',            price: 42.50, type: 'mdf',      thickness: 0.75 },
  { id: 3, name: 'Oak Hardwood',   price: 89.99, type: 'hardwood', thickness: 0.75 },
]

const s = {
  // Workspace shell
  shell: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: 'calc(100vh - 64px)',
    background: 'var(--k-canvas-bg)',
    color: 'var(--k-canvas-text)',
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
  },
  // Top toolbar
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    height: '44px',
    borderBottom: '1px solid var(--k-canvas-border)',
    background: 'var(--k-canvas-surface)',
    flexShrink: 0,
  },
  toolbarTitle: {
    fontFamily: 'var(--font-sora), Sora, sans-serif',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    color: 'var(--k-canvas-text)',
  },
  toolbarActions: {
    display: 'flex',
    gap: '6px',
  },
  tbBtn: {
    padding: '4px 12px',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.01em',
    border: '1px solid var(--k-canvas-border)',
    background: 'transparent',
    color: 'var(--k-canvas-text-muted)',
    cursor: 'pointer',
    borderRadius: '3px',
  },
  tbBtnPrimary: {
    padding: '4px 12px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.01em',
    border: '1px solid var(--k-canvas-accent)',
    background: 'var(--k-canvas-accent)',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '3px',
  },
  // Middle row
  middle: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  // Left palette
  palette: {
    width: '200px',
    flexShrink: 0,
    borderRight: '1px solid var(--k-canvas-border)',
    background: 'var(--k-canvas-surface)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  paletteHeader: {
    padding: '10px 14px',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--k-canvas-text-muted)',
    borderBottom: '1px solid var(--k-canvas-border)',
  },
  paletteItem: {
    padding: '9px 14px',
    fontSize: '13px',
    color: 'var(--k-canvas-text)',
    cursor: 'pointer',
    borderBottom: '1px solid var(--k-canvas-border)',
    userSelect: 'none' as const,
  },
  // Center canvas
  canvas: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  // Right panel
  panel: {
    width: '260px',
    flexShrink: 0,
    borderLeft: '1px solid var(--k-canvas-border)',
    background: 'var(--k-canvas-surface)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  panelHeader: {
    padding: '10px 14px',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--k-canvas-text-muted)',
    borderBottom: '1px solid var(--k-canvas-border)',
  },
  panelBody: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '14px',
  },
  fieldLabel: {
    fontSize: '11px',
    fontWeight: 500,
    color: 'var(--k-canvas-text-muted)',
    marginBottom: '5px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '6px 8px',
    fontSize: '13px',
    background: 'var(--k-canvas-bg)',
    border: '1px solid var(--k-canvas-border)',
    color: 'var(--k-canvas-text)',
    borderRadius: '3px',
    outline: 'none',
    marginBottom: '12px',
  },
  select: {
    width: '100%',
    padding: '6px 8px',
    fontSize: '13px',
    background: 'var(--k-canvas-bg)',
    border: '1px solid var(--k-canvas-border)',
    color: 'var(--k-canvas-text)',
    borderRadius: '3px',
    outline: 'none',
    marginBottom: '12px',
  },
  sectionDivider: {
    height: '1px',
    background: 'var(--k-canvas-border)',
    margin: '12px 0',
  },
  sectionLabel: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: 'var(--k-canvas-text-muted)',
    marginBottom: '10px',
  },
  // Bottom bar
  bottomBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '0 20px',
    height: '40px',
    borderTop: '1px solid var(--k-canvas-border)',
    background: 'var(--k-canvas-surface)',
    flexShrink: 0,
    fontSize: '12px',
  },
  bottomStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--k-canvas-text-muted)',
  },
  bottomStatValue: {
    color: 'var(--k-canvas-text)',
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums' as const,
  },
  exportBtn: {
    marginLeft: 'auto',
    padding: '4px 14px',
    fontSize: '11px',
    fontWeight: 600,
    background: 'var(--k-canvas-accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
}

export function CabinetBuilder() {
  const [cabinet, setCabinet] = useState<Cabinet>({
    id: 1,
    name: 'Base Cabinet',
    width: 36,
    height: 34.5,
    depth: 24,
    material: 'Birch Plywood',
  })

  const selectedMaterial = MATERIALS.find(m => m.name === cabinet.material) ?? MATERIALS[0]

  const cutList = [
    { part: 'Bottom / Top', qty: 2, w: cabinet.width,         h: cabinet.depth },
    { part: 'Sides',        qty: 2, w: cabinet.depth,         h: cabinet.height },
    { part: 'Back',         qty: 1, w: cabinet.width,         h: cabinet.height },
    { part: 'Shelves',      qty: 2, w: cabinet.width - 1.5,   h: cabinet.depth - 1.5 },
  ]

  // Very rough cost estimate
  const sqInTotal = cutList.reduce((sum, c) => sum + c.qty * c.w * c.h, 0)
  const sqFt = sqInTotal / 144
  const cost = (sqFt * (selectedMaterial.price / 32)) + 25 // hardware flat

  const handleDim = (dim: 'width' | 'height' | 'depth', val: string) => {
    const n = parseFloat(val)
    if (!isNaN(n) && n > 0) setCabinet(p => ({ ...p, [dim]: n }))
  }

  return (
    <div style={s.shell}>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <span style={s.toolbarTitle}>KerfOS — {cabinet.name}</span>
        <div style={s.toolbarActions}>
          <button style={s.tbBtn}>Undo</button>
          <button style={s.tbBtn}>Redo</button>
          <button style={s.tbBtnPrimary}>Export</button>
        </div>
      </div>

      {/* Middle row */}
      <div style={s.middle}>

        {/* Left palette */}
        <div style={s.palette}>
          <div style={s.paletteHeader}>Components</div>
          {PALETTE_ITEMS.map(item => (
            <div key={item.id} style={s.paletteItem}>
              {item.label}
            </div>
          ))}
          <div style={{ ...s.paletteHeader, marginTop: 'auto' }}>Materials</div>
          {MATERIALS.map(mat => (
            <div
              key={mat.id}
              onClick={() => setCabinet(p => ({ ...p, material: mat.name }))}
              style={{
                ...s.paletteItem,
                color: cabinet.material === mat.name
                  ? 'var(--k-canvas-accent)'
                  : 'var(--k-canvas-text)',
                background: cabinet.material === mat.name
                  ? 'var(--k-canvas-accent-dim)'
                  : 'transparent',
              }}
            >
              {mat.name}
            </div>
          ))}
        </div>

        {/* Center canvas */}
        <div style={s.canvas}>
          <CabinetPreview cabinet={cabinet} material={selectedMaterial} />
        </div>

        {/* Right properties panel */}
        <div style={s.panel}>
          <div style={s.panelHeader}>Properties</div>
          <div style={s.panelBody}>

            <p style={s.sectionLabel}>Dimensions (inches)</p>

            <label style={s.fieldLabel}>Width</label>
            <input
              style={s.input}
              type="number"
              value={cabinet.width}
              onChange={e => handleDim('width', e.target.value)}
            />

            <label style={s.fieldLabel}>Height</label>
            <input
              style={s.input}
              type="number"
              value={cabinet.height}
              onChange={e => handleDim('height', e.target.value)}
            />

            <label style={s.fieldLabel}>Depth</label>
            <input
              style={s.input}
              type="number"
              value={cabinet.depth}
              onChange={e => handleDim('depth', e.target.value)}
            />

            <div style={s.sectionDivider} />
            <p style={s.sectionLabel}>Material</p>

            <select
              style={s.select}
              value={cabinet.material}
              onChange={e => setCabinet(p => ({ ...p, material: e.target.value }))}
            >
              {MATERIALS.map(m => (
                <option key={m.id} value={m.name}>{m.name}</option>
              ))}
            </select>

            <div style={s.sectionDivider} />
            <p style={s.sectionLabel}>Cut List</p>

            {cutList.map((cut, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                <span style={{ fontSize: '12px', color: 'var(--k-canvas-text-muted)' }}>
                  {cut.qty}× {cut.part}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--k-canvas-text)', fontVariantNumeric: 'tabular-nums' }}>
                  {cut.w.toFixed(1)}" × {cut.h.toFixed(1)}"
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={s.bottomBar}>
        <div style={s.bottomStat}>
          <span>Parts</span>
          <span style={s.bottomStatValue}>{cutList.reduce((n, c) => n + c.qty, 0)}</span>
        </div>
        <div style={s.bottomStat}>
          <span>Material</span>
          <span style={s.bottomStatValue}>{selectedMaterial.name}</span>
        </div>
        <div style={s.bottomStat}>
          <span>Est. Cost</span>
          <span style={s.bottomStatValue}>${cost.toFixed(2)}</span>
        </div>
        <button style={s.exportBtn}>Export ▾</button>
      </div>

    </div>
  )
}
