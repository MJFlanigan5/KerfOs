'use client';

import React, { useState, useEffect } from 'react';

interface CommunityGalleryProps {
  onSelectProject?: (project: GalleryProject) => void;
}

interface GalleryProject {
  id: string;
  name: string;
  author: string;
  authorAvatar?: string;
  description: string;
  images: string[];
  cabinetType: string;
  style: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedCost: number;
  actualCost?: number;
  buildTime: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  tips: string[];
  materials: string[];
  createdAt: Date;
  featured: boolean;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner:     'var(--k-success, #22c55e)',
  intermediate: 'var(--k-amber)',
  advanced:     '#ef4444',
}

const styles      = ['all', 'shaker', 'flat-panel', 'raised-panel', 'slab', 'rustic', 'modern', 'traditional']
const difficulties = ['all', 'beginner', 'intermediate', 'advanced']
const cabinetTypes = ['all', 'kitchen', 'bathroom', 'garage', 'office', 'living-room', 'bedroom']

const selectStyle: React.CSSProperties = {
  padding: '7px 10px',
  background: 'var(--k-surface)',
  border: '1px solid var(--k-border-mid)',
  borderRadius: 'var(--k-r-md)',
  fontSize: '13px',
  color: 'var(--k-ink)',
  fontFamily: 'var(--font-inter), system-ui, sans-serif',
  outline: 'none',
  cursor: 'pointer',
}

const MOCK_PROJECTS: GalleryProject[] = [
  {
    id: '1', name: 'Modern Farmhouse Kitchen', author: 'WoodWorkerMike',
    description: 'Complete kitchen renovation with shaker-style cabinets, soft-close drawers, and a massive center island. Used pre-finished maple plywood with maple face frames.',
    images: ['/projects/kitchen1.jpg'], cabinetType: 'kitchen', style: 'shaker', difficulty: 'intermediate',
    estimatedCost: 4500, actualCost: 4200, buildTime: 120, rating: 4.8, reviewCount: 45,
    tags: ['kitchen', 'island', 'soft-close', 'maple'],
    tips: ['Pre-finished plywood saves tons of time on finishing', 'Use a story pole for consistent measurements', 'Label every part as you cut'],
    materials: ['3/4" Maple Plywood', '1×4 Maple (face frames)', 'Blum soft-close slides', 'Concealed hinges'],
    createdAt: new Date('2024-01-15'), featured: true,
  },
  {
    id: '2', name: 'Garage Storage System', author: 'DIYDan',
    description: 'Full-wall storage with cabinets, workbench, and overhead compartments. Built from birch plywood with melamine countertops.',
    images: ['/projects/garage1.jpg'], cabinetType: 'garage', style: 'flat-panel', difficulty: 'beginner',
    estimatedCost: 1200, actualCost: 1350, buildTime: 40, rating: 4.5, reviewCount: 28,
    tags: ['garage', 'storage', 'workbench', 'budget-friendly'],
    tips: ['Use 3/4" plywood for durability', 'Add adjustable shelf pins for flexibility', 'Include toe kick space for comfort'],
    materials: ['3/4" Birch Plywood', 'Melamine sheets', 'Heavy-duty shelf pins'],
    createdAt: new Date('2024-02-20'), featured: false,
  },
  {
    id: '3', name: 'Floating Bathroom Vanity', author: 'ModernMaker',
    description: 'Wall-mounted double vanity with vessel sinks. Walnut veneer with LED under-cabinet lighting.',
    images: ['/projects/vanity1.jpg'], cabinetType: 'bathroom', style: 'modern', difficulty: 'advanced',
    estimatedCost: 1800, actualCost: 2100, buildTime: 65, rating: 4.9, reviewCount: 32,
    tags: ['bathroom', 'floating', 'modern', 'walnut'],
    tips: ['Use a French cleat for secure wall mounting', 'Seal all surfaces for bathroom moisture', 'Plan plumbing access carefully'],
    materials: ['Walnut veneer plywood', 'Solid walnut edge banding', 'LED strip lights'],
    createdAt: new Date('2024-03-01'), featured: true,
  },
  {
    id: '4', name: 'Built-In Bookshelves', author: 'ClassicCarpenter',
    description: 'Floor-to-ceiling built-in bookcases with integrated desk. Paint-grade with adjustable shelves.',
    images: ['/projects/bookshelf1.jpg'], cabinetType: 'living-room', style: 'traditional', difficulty: 'intermediate',
    estimatedCost: 900, buildTime: 35, rating: 4.6, reviewCount: 19,
    tags: ['bookshelf', 'built-in', 'desk', 'living-room'],
    tips: ['Scribe to wall for seamless fit', 'Use pocket holes for invisible joinery', 'Crown molding adds a professional touch'],
    materials: ['MDF', 'Poplar (face frames)', 'Crown molding'],
    createdAt: new Date('2024-02-05'), featured: false,
  },
  {
    id: '5', name: 'Kids Playroom Storage', author: 'FamilyBuilder',
    description: 'Colorful cubby storage system with bins and hooks. Rounded corners for safety.',
    images: ['/projects/playroom1.jpg'], cabinetType: 'bedroom', style: 'slab', difficulty: 'beginner',
    estimatedCost: 500, actualCost: 480, buildTime: 20, rating: 4.4, reviewCount: 15,
    tags: ['kids', 'storage', 'cubbies', 'beginner'],
    tips: ['Round all corners for child safety', 'Use durable, washable paint', 'Include label holders for organization'],
    materials: ['Birch plywood', 'Fabric bins', 'Plastic label holders'],
    createdAt: new Date('2024-03-10'), featured: false,
  },
  {
    id: '6', name: 'Rustic Pantry Cabinet', author: 'BarnwoodBob',
    description: 'Freestanding pantry with distressed finish. Reclaimed barn wood accents and chicken wire door panels.',
    images: ['/projects/pantry1.jpg'], cabinetType: 'kitchen', style: 'rustic', difficulty: 'intermediate',
    estimatedCost: 800, buildTime: 45, rating: 4.7, reviewCount: 22,
    tags: ['pantry', 'rustic', 'reclaimed', 'freestanding'],
    tips: ['Distress before final finish', 'Use gel stain for even color on pine', 'Seal interior for easy cleaning'],
    materials: ['Pine plywood', 'Reclaimed barn wood', 'Chicken wire'],
    createdAt: new Date('2024-01-28'), featured: true,
  },
]

const CommunityGallery: React.FC<CommunityGalleryProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<GalleryProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<GalleryProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedCabinetType, setSelectedCabinetType] = useState('all')
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'cost'>('popular')

  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(MOCK_PROJECTS)
      setFilteredProjects(MOCK_PROJECTS)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = [...projects]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    if (selectedStyle !== 'all')        filtered = filtered.filter(p => p.style === selectedStyle)
    if (selectedDifficulty !== 'all')   filtered = filtered.filter(p => p.difficulty === selectedDifficulty)
    if (selectedCabinetType !== 'all')  filtered = filtered.filter(p => p.cabinetType === selectedCabinetType)
    switch (sortBy) {
      case 'popular': filtered.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount); break
      case 'recent':  filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); break
      case 'cost':    filtered.sort((a, b) => a.estimatedCost - b.estimatedCost); break
    }
    setFilteredProjects(filtered)
  }, [searchQuery, selectedStyle, selectedDifficulty, selectedCabinetType, sortBy, projects])

  const renderStars = (rating: number) =>
    '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))

  if (selectedProject) {
    return (
      <div style={{ background: 'var(--k-surface)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-lg)', padding: '32px' }}>
        <button
          onClick={() => setSelectedProject(null)}
          style={{ marginBottom: '24px', fontSize: '13px', color: 'var(--k-amber)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ← Back to Gallery
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Image placeholder */}
          <div>
            <div style={{ background: 'var(--k-bg-subtle)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-md)', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono), monospace', color: 'var(--k-ink-4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>No image</span>
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--k-ink)', margin: 0 }}>
                {selectedProject.name}
              </h2>
              {selectedProject.featured && (
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono), monospace', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--k-amber)', border: '1px solid var(--k-amber-glow)', padding: '2px 7px', borderRadius: 'var(--k-r-sm)', flexShrink: 0, marginLeft: '12px' }}>
                  Featured
                </span>
              )}
            </div>

            <p style={{ fontSize: '13px', color: 'var(--k-ink-4)', marginBottom: '16px' }}>by {selectedProject.author}</p>
            <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.65, marginBottom: '20px' }}>{selectedProject.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {[
                { label: 'Est. Cost', value: `$${selectedProject.estimatedCost}` },
                { label: 'Build Time', value: `${selectedProject.buildTime} hrs` },
                { label: 'Difficulty', value: selectedProject.difficulty },
                { label: 'Style', value: selectedProject.style.replace('-', ' ') },
              ].map(item => (
                <div key={item.label} style={{ padding: '10px 12px', background: 'var(--k-bg-subtle)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-md)' }}>
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--k-ink)', textTransform: 'capitalize' }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '14px', color: 'var(--k-amber)', marginBottom: '16px' }}>
              {renderStars(selectedProject.rating)}{' '}
              <span style={{ color: 'var(--k-ink-4)', fontSize: '12px' }}>({selectedProject.reviewCount} reviews)</span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {selectedProject.tags.map(tag => (
                <span key={tag} style={{ fontSize: '11px', fontFamily: 'var(--font-mono), monospace', padding: '2px 8px', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-sm)', color: 'var(--k-ink-3)' }}>
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => onSelectProject?.(selectedProject)}
              className="k-btn k-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Use as Template
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--k-border)' }}>
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '12px' }}>Tips from {selectedProject.author}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedProject.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--k-ink-3)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--k-amber)', flexShrink: 0 }}>–</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '12px' }}>Materials</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {selectedProject.materials.map(m => (
                <span key={m} style={{ fontSize: '12px', padding: '4px 10px', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-sm)', color: 'var(--k-ink-3)' }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px' }}>
          <input
            type="text"
            placeholder="Search projects, tags, or styles..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ ...selectStyle, width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <select value={selectedStyle} onChange={e => setSelectedStyle(e.target.value)} style={selectStyle}>
          {styles.map(s => <option key={s} value={s}>{s === 'all' ? 'All Styles' : s}</option>)}
        </select>
        <select value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)} style={selectStyle}>
          {difficulties.map(d => <option key={d} value={d}>{d === 'all' ? 'All Levels' : d}</option>)}
        </select>
        <select value={selectedCabinetType} onChange={e => setSelectedCabinetType(e.target.value)} style={selectStyle}>
          {cabinetTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'All Rooms' : t}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} style={selectStyle}>
          <option value="popular">Most Popular</option>
          <option value="recent">Most Recent</option>
          <option value="cost">Lowest Cost</option>
        </select>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--k-ink-4)', marginBottom: '16px', fontFamily: 'var(--font-mono), monospace' }}>
        {filteredProjects.length} of {projects.length} projects
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--k-ink-4)', fontSize: '14px' }}>
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--k-ink-4)', fontSize: '14px' }}>
          No projects match your filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {filteredProjects.map(project => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              style={{ border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-lg)', overflow: 'hidden', background: 'var(--k-surface)', cursor: 'pointer', transition: 'border-color 150ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--k-border-strong)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--k-border)')}
            >
              {/* Image area */}
              <div style={{ height: '140px', background: 'var(--k-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {project.featured && (
                  <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '10px', fontFamily: 'var(--font-mono), monospace', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--k-amber)', border: '1px solid var(--k-amber-glow)', padding: '2px 6px', borderRadius: 'var(--k-r-sm)', background: 'var(--k-bg)' }}>
                    Featured
                  </span>
                )}
                <span style={{ fontSize: '11px', color: 'var(--k-ink-4)', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.06em' }}>No image</span>
              </div>

              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--k-ink)', marginBottom: '2px', letterSpacing: '-0.01em' }}>{project.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--k-ink-4)', marginBottom: '10px' }}>by {project.author}</div>

                <div style={{ fontSize: '13px', color: 'var(--k-amber)', marginBottom: '10px' }}>
                  {renderStars(project.rating)}{' '}
                  <span style={{ color: 'var(--k-ink-4)', fontSize: '11px' }}>({project.reviewCount})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono), monospace', color: DIFFICULTY_COLOR[project.difficulty], letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {project.difficulty}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--k-ink)', fontFamily: 'var(--font-mono), monospace' }}>
                    ${project.estimatedCost.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{ fontSize: '10px', fontFamily: 'var(--font-mono), monospace', color: 'var(--k-ink-4)' }}>#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommunityGallery
