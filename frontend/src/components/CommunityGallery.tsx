'use client'

import { useState, useEffect, useMemo } from 'react'

interface GalleryProject {
  id: string
  name: string
  author: string
  description: string
  cabinetType: string
  style: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedCost: number
  actualCost?: number
  buildTime: number
  rating: number
  reviewCount: number
  tags: string[]
  tips: string[]
  materials: string[]
  createdAt: Date
  featured: boolean
}

const MOCK_PROJECTS: GalleryProject[] = [
  {
    id: '1',
    name: 'Modern Farmhouse Kitchen',
    author: 'WoodWorkerMike',
    description: 'Complete kitchen renovation with shaker-style cabinets, soft-close drawers, and a massive center island. Used pre-finished maple plywood with maple face frames.',
    cabinetType: 'kitchen',
    style: 'shaker',
    difficulty: 'intermediate',
    estimatedCost: 4500,
    actualCost: 4200,
    buildTime: 120,
    rating: 4.8,
    reviewCount: 45,
    tags: ['kitchen', 'island', 'soft-close', 'maple'],
    tips: [
      'Pre-finished plywood saves tons of time on finishing',
      'Use a story pole for consistent measurements',
      'Label every part as you cut',
    ],
    materials: ['3/4" Maple Plywood', '1x4 Maple face frames', 'Blum soft-close slides', 'Concealed hinges'],
    createdAt: new Date('2024-01-15'),
    featured: true,
  },
  {
    id: '2',
    name: 'Garage Storage System',
    author: 'DIYDan',
    description: 'Full-wall storage with cabinets, workbench, and overhead compartments. Built from birch plywood with melamine countertops.',
    cabinetType: 'garage',
    style: 'flat-panel',
    difficulty: 'beginner',
    estimatedCost: 1200,
    actualCost: 1350,
    buildTime: 40,
    rating: 4.5,
    reviewCount: 28,
    tags: ['garage', 'storage', 'workbench', 'budget-friendly'],
    tips: [
      'Use 3/4" plywood for durability',
      'Add adjustable shelf pins for flexibility',
      'Include toe kick space for comfort',
    ],
    materials: ['3/4" Birch Plywood', 'Melamine sheets', 'Heavy-duty shelf pins'],
    createdAt: new Date('2024-02-20'),
    featured: false,
  },
  {
    id: '3',
    name: 'Floating Bathroom Vanity',
    author: 'ModernMaker',
    description: 'Wall-mounted double vanity with vessel sinks. Walnut veneer with LED under-cabinet lighting.',
    cabinetType: 'bathroom',
    style: 'modern',
    difficulty: 'advanced',
    estimatedCost: 1800,
    actualCost: 2100,
    buildTime: 65,
    rating: 4.9,
    reviewCount: 32,
    tags: ['bathroom', 'floating', 'modern', 'walnut'],
    tips: [
      'Use a French cleat for secure wall mounting',
      'Seal all surfaces for bathroom moisture',
      'Plan plumbing access carefully',
    ],
    materials: ['Walnut veneer plywood', 'Solid walnut edge banding', 'LED strip lights'],
    createdAt: new Date('2024-03-01'),
    featured: true,
  },
  {
    id: '4',
    name: 'Built-In Bookshelves',
    author: 'ClassicCarpenter',
    description: 'Floor-to-ceiling built-in bookcases with integrated desk. Paint-grade with adjustable shelves.',
    cabinetType: 'living-room',
    style: 'traditional',
    difficulty: 'intermediate',
    estimatedCost: 900,
    buildTime: 35,
    rating: 4.6,
    reviewCount: 19,
    tags: ['bookshelf', 'built-in', 'desk', 'living-room'],
    tips: [
      'Scribe to wall for seamless fit',
      'Use pocket holes for invisible joinery',
      'Crown molding adds a professional touch',
    ],
    materials: ['MDF', 'Poplar face frames', 'Crown molding'],
    createdAt: new Date('2024-02-05'),
    featured: false,
  },
  {
    id: '5',
    name: 'Kids Playroom Cubbies',
    author: 'FamilyBuilder',
    description: 'Colorful cubby storage system with bins and hooks. Rounded corners for safety.',
    cabinetType: 'bedroom',
    style: 'slab',
    difficulty: 'beginner',
    estimatedCost: 500,
    actualCost: 480,
    buildTime: 20,
    rating: 4.4,
    reviewCount: 15,
    tags: ['kids', 'storage', 'cubbies', 'beginner'],
    tips: [
      'Round all corners for child safety',
      'Use durable, washable paint',
      'Include label holders for organization',
    ],
    materials: ['Birch plywood', 'Fabric bins', 'Plastic label holders'],
    createdAt: new Date('2024-03-10'),
    featured: false,
  },
  {
    id: '6',
    name: 'Rustic Pantry Cabinet',
    author: 'BarnwoodBob',
    description: 'Freestanding pantry with distressed finish. Reclaimed barn wood accents and chicken wire door panels.',
    cabinetType: 'kitchen',
    style: 'rustic',
    difficulty: 'intermediate',
    estimatedCost: 800,
    buildTime: 45,
    rating: 4.7,
    reviewCount: 22,
    tags: ['pantry', 'rustic', 'reclaimed', 'freestanding'],
    tips: [
      'Distress before final finish',
      'Use gel stain for even color on pine',
      'Seal interior for easy cleaning',
    ],
    materials: ['Pine plywood', 'Reclaimed barn wood', 'Chicken wire'],
    createdAt: new Date('2024-01-28'),
    featured: true,
  },
]

const STYLES   = ['all', 'shaker', 'flat-panel', 'raised-panel', 'slab', 'rustic', 'modern', 'traditional']
const DIFFS    = ['all', 'beginner', 'intermediate', 'advanced']
const ROOMS    = ['all', 'kitchen', 'bathroom', 'garage', 'office', 'living-room', 'bedroom']

const DIFF_COLOR: Record<string, string> = {
  beginner:     'var(--k-amber-dark)',
  intermediate: '#f59e0b',
  advanced:     '#ef4444',
}

function Stars({ rating }: { rating: number }) {
  const full  = Math.floor(rating)
  const empty = 5 - full
  return (
    <span style={{ color: '#f59e0b', fontSize: '12px', letterSpacing: '1px' }}>
      {'★'.repeat(full)}{'☆'.repeat(empty)}
    </span>
  )
}

function PlaceholderImage({ featured }: { featured: boolean }) {
  return (
    <div style={{
      height: 180,
      background: 'var(--k-surface)',
      borderBottom: '1px solid var(--k-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      {/* Simple wood grain SVG placeholder */}
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity={0.25}>
        <rect x="4" y="4" width="40" height="40" rx="2" stroke="var(--k-ink-3)" strokeWidth="1.5"/>
        <path d="M4 16h40M4 24h40M4 32h40" stroke="var(--k-ink-3)" strokeWidth="1" strokeDasharray="4 3"/>
        <path d="M16 4v40M32 4v40" stroke="var(--k-ink-3)" strokeWidth="1" strokeDasharray="4 3"/>
      </svg>
      {featured && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(6,182,212,0.15)',
          border: '1px solid rgba(6,182,212,0.35)',
          color: '#06b6d4',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '2px 8px',
          borderRadius: '2px',
        }}>
          Featured
        </div>
      )}
    </div>
  )
}

function ProjectDetail({ project, onBack }: { project: GalleryProject; onBack: () => void }) {
  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--k-ink-3)',
          fontSize: '13px',
          padding: '0 0 24px',
          fontFamily: 'inherit',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to gallery
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }} className="gallery-detail-grid">
        {/* Left */}
        <div>
          <div style={{
            height: 300,
            background: 'var(--k-surface)',
            border: '1px solid var(--k-border)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="64" height="64" viewBox="0 0 48 48" fill="none" opacity={0.2}>
              <rect x="4" y="4" width="40" height="40" rx="2" stroke="var(--k-ink-3)" strokeWidth="1.5"/>
              <path d="M4 16h40M4 24h40M4 32h40" stroke="var(--k-ink-3)" strokeWidth="1" strokeDasharray="4 3"/>
              <path d="M16 4v40M32 4v40" stroke="var(--k-ink-3)" strokeWidth="1" strokeDasharray="4 3"/>
            </svg>
          </div>
        </div>

        {/* Right */}
        <div>
          {project.featured && (
            <p className="k-label" style={{ marginBottom: '8px', color: '#06b6d4' }}>Featured Build</p>
          )}
          <h2 style={{
            fontFamily: 'var(--font-sora), Sora, sans-serif',
            fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em',
            color: 'var(--k-ink)', marginBottom: '6px',
          }}>{project.name}</h2>
          <p style={{ fontSize: '13px', color: 'var(--k-ink-4)', marginBottom: '16px' }}>
            by {project.author}
          </p>

          <p style={{ fontSize: '14px', color: 'var(--k-ink-2)', lineHeight: 1.7, marginBottom: '24px' }}>
            {project.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Est. Cost', value: `$${project.estimatedCost.toLocaleString()}` },
              { label: 'Build Time', value: `${project.buildTime} hrs` },
              { label: 'Difficulty', value: project.difficulty },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'var(--k-surface)',
                border: '1px solid var(--k-border)',
                borderRadius: '4px',
                padding: '12px 14px',
              }}>
                <p style={{ fontSize: '10px', color: 'var(--k-ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</p>
                <p style={{
                  fontSize: '16px', fontWeight: 600, color:
                    label === 'Difficulty' ? DIFF_COLOR[project.difficulty] : 'var(--k-ink)',
                  textTransform: label === 'Difficulty' ? 'capitalize' : undefined,
                }}>{value}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Stars rating={project.rating} />
            <span style={{ fontSize: '12px', color: 'var(--k-ink-4)' }}>{project.rating} ({project.reviewCount} reviews)</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontSize: '11px', color: 'var(--k-ink-3)',
                background: 'var(--k-surface)',
                border: '1px solid var(--k-border)',
                borderRadius: '2px',
                padding: '2px 8px',
              }}>#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="gallery-detail-grid">
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '16px' }}>
            Tips from {project.author}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {project.tips.map((tip, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '13px', color: 'var(--k-ink-2)', lineHeight: 1.6 }}>
                <span style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                  background: 'rgba(6,182,212,0.12)',
                  border: '1px solid rgba(6,182,212,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4L3 6.5L7 1.5" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '16px' }}>
            Materials
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {project.materials.map(m => (
              <span key={m} style={{
                fontSize: '12px',
                color: 'var(--k-ink-2)',
                background: 'var(--k-surface)',
                border: '1px solid var(--k-border)',
                borderRadius: '3px',
                padding: '4px 10px',
              }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({ label, value, options, onChange }: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label style={{ fontSize: '10px', color: 'var(--k-ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: 'var(--k-surface)',
          border: '1px solid var(--k-border)',
          borderRadius: '3px',
          color: 'var(--k-ink-2)',
          fontSize: '12px',
          padding: '6px 28px 6px 10px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
        }}
      >
        {options.map(o => (
          <option key={o} value={o}>
            {o === 'all' ? `All ${label}s` : o.replace('-', ' ')}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function CommunityGallery() {
  const [selected, setSelected] = useState<GalleryProject | null>(null)
  const [search, setSearch] = useState('')
  const [style, setStyle] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [room, setRoom] = useState('all')
  const [sort, setSort] = useState<'popular' | 'recent' | 'cost'>('popular')

  const filtered = useMemo(() => {
    let list = [...MOCK_PROJECTS]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    if (style !== 'all') list = list.filter(p => p.style === style)
    if (difficulty !== 'all') list = list.filter(p => p.difficulty === difficulty)
    if (room !== 'all') list = list.filter(p => p.cabinetType === room)

    switch (sort) {
      case 'popular': list.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount); break
      case 'recent':  list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); break
      case 'cost':    list.sort((a, b) => a.estimatedCost - b.estimatedCost); break
    }
    return list
  }, [search, style, difficulty, room, sort])

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div>
      {/* Filters row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'flex-end',
        marginBottom: '32px',
        paddingBottom: '24px',
        borderBottom: '1px solid var(--k-border)',
      }}>
        {/* Search */}
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ fontSize: '10px', color: 'var(--k-ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            Search
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Kitchen, garage, shaker..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--k-surface)',
                border: '1px solid var(--k-border)',
                borderRadius: '3px',
                color: 'var(--k-ink)',
                fontSize: '12px',
                padding: '6px 10px 6px 30px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
              <circle cx="5" cy="5" r="4" stroke="var(--k-ink)" strokeWidth="1.5"/>
              <path d="M8 8L11 11" stroke="var(--k-ink)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <FilterSelect label="Style"      value={style}      options={STYLES} onChange={setStyle} />
        <FilterSelect label="Difficulty" value={difficulty} options={DIFFS}  onChange={setDifficulty} />
        <FilterSelect label="Room"       value={room}       options={ROOMS}  onChange={setRoom} />

        <div>
          <label style={{ fontSize: '10px', color: 'var(--k-ink-4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            Sort
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['popular', 'recent', 'cost'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSort(s)}
                style={{
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 500,
                  background: sort === s ? 'var(--k-ink)' : 'var(--k-surface)',
                  color: sort === s ? '#f5f0eb' : 'var(--k-ink-3)',
                  border: '1px solid var(--k-border)',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textTransform: 'capitalize',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      <p style={{ fontSize: '12px', color: 'var(--k-ink-4)', marginBottom: '20px' }}>
        {filtered.length} build{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--k-ink-4)', fontSize: '14px' }}>
          No builds match your filters.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }} className="gallery-grid">
          {filtered.map(project => (
            <div
              key={project.id}
              onClick={() => setSelected(project)}
              style={{
                background: 'var(--k-bg)',
                border: '1px solid var(--k-border)',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 150ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--k-border)')}
            >
              <PlaceholderImage featured={project.featured} />

              <div style={{ padding: '16px 18px 18px' }}>
                <p style={{
                  fontSize: '14px', fontWeight: 600, color: 'var(--k-ink)',
                  marginBottom: '4px', lineHeight: 1.3,
                }}>{project.name}</p>
                <p style={{ fontSize: '11px', color: 'var(--k-ink-4)', marginBottom: '10px' }}>by {project.author}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <Stars rating={project.rating} />
                  <span style={{ fontSize: '11px', color: 'var(--k-ink-4)' }}>({project.reviewCount})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, textTransform: 'capitalize',
                    color: DIFF_COLOR[project.difficulty],
                  }}>{project.difficulty}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--k-ink)' }}>
                    ${project.estimatedCost.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      fontSize: '10px', color: 'var(--k-ink-4)',
                    }}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .gallery-detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
