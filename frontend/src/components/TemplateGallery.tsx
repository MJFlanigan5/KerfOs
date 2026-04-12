'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface TemplateChange {
  name: string;
  quantity: number;
  width: number;
  height: number;
  depth: number;
  material: string;
}

interface HardwareItem {
  name: string;
  quantity: number;
  type: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  style: string;
  room_type: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  estimated_cost_low: number;
  estimated_cost_high: number;
  tags: string[];
  inspiration: string;
  inspiration_notes?: string;
  components: TemplateChange[];
  hardware_needed: HardwareItem[];
  joinery: string[];
  finishing_suggestions: string[];
}

interface CutlistData {
  template_name: string;
  summary: {
    total_components: number;
    estimated_3_4_sheets: number;
    total_lumber_board_feet: number;
    estimated_cost_range: string;
  };
  cut_list: Array<{ sheet?: string; lumber?: string; pieces?: number; waste_pct?: number; board_feet?: number }>;
  hardware_needed: HardwareItem[];
  joinery: string[];
  finishing: string[];
}

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner:     '#22c55e',
  intermediate: 'var(--k-amber)',
  advanced:     '#ef4444',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 11px',
  background: 'var(--k-surface)',
  border: '1px solid var(--k-border-mid)',
  borderRadius: 'var(--k-r-md)',
  fontSize: '13px',
  color: 'var(--k-ink)',
  fontFamily: 'var(--font-inter), system-ui, sans-serif',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
  width: 'auto',
}

function Pill({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontSize: '10px',
      fontFamily: 'var(--font-mono), monospace',
      fontWeight: 500,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: color || 'var(--k-ink-3)',
      border: `1px solid ${color ? color + '55' : 'var(--k-border)'}`,
      padding: '2px 7px',
      borderRadius: 'var(--k-r-sm)',
      display: 'inline-block',
    }}>
      {children}
    </span>
  )
}

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--k-bg)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-lg)', width: '100%', maxWidth: '720px', maxHeight: '85vh', overflowY: 'auto' }}
      >
        {children}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderTop: '1px solid var(--k-border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--k-ink)', fontSize: '13px', fontWeight: 600 }}
      >
        {title}
        <span style={{ fontSize: '11px', color: 'var(--k-ink-4)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }}>▾</span>
      </button>
      {open && <div style={{ paddingBottom: '16px' }}>{children}</div>}
    </div>
  )
}

export default function TemplateGallery() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [styles, setStyles] = useState<Array<{ value: string; label: string }>>([])
  const [rooms, setRooms] = useState<Array<{ value: string; label: string }>>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [cutlistOpen, setCutlistOpen] = useState(false)
  const [cutlistData, setCutlistData] = useState<CutlistData | null>(null)

  const [searchQuery, setSearchQuery]       = useState('')
  const [styleFilter, setStyleFilter]       = useState('')
  const [roomFilter, setRoomFilter]         = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')

  useEffect(() => { fetchTemplates(); fetchFilters() }, [])

  useEffect(() => {
    let filtered = [...templates]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }
    if (styleFilter)      filtered = filtered.filter(t => t.style === styleFilter)
    if (roomFilter)       filtered = filtered.filter(t => t.room_type === roomFilter)
    if (difficultyFilter) filtered = filtered.filter(t => t.difficulty === difficultyFilter)
    setFilteredTemplates(filtered)
  }, [templates, searchQuery, styleFilter, roomFilter, difficultyFilter])

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_URL}/api/templates/`)
      const data = await res.json()
      setTemplates(data)
      setFilteredTemplates(data)
    } catch { /* silent */ } finally { setLoading(false) }
  }

  const fetchFilters = async () => {
    try {
      const [sRes, rRes] = await Promise.all([
        fetch(`${API_URL}/api/templates/styles`),
        fetch(`${API_URL}/api/templates/rooms`),
      ])
      setStyles(await sRes.json())
      setRooms(await rRes.json())
    } catch { /* silent */ }
  }

  const handleViewCutlist = async (template: Template) => {
    setSelectedTemplate(template)
    try {
      const res = await fetch(`${API_URL}/api/templates/${template.id}/cutlist`)
      setCutlistData(await res.json())
      setCutlistOpen(true)
    } catch { /* silent */ }
  }

  const handleUseTemplate = (template: Template) => {
    alert(`Project creation from template "${template.name}" coming soon!`)
  }

  const clearFilters = () => {
    setSearchQuery(''); setStyleFilter(''); setRoomFilter(''); setDifficultyFilter('')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px', color: 'var(--k-ink-4)', fontSize: '14px' }}>
        Loading templates...
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', alignItems: 'flex-end' }}>
        <input
          style={{ ...inputStyle, flex: '1 1 200px', minWidth: '160px' }}
          placeholder="Search templates..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <select style={selectStyle} value={styleFilter} onChange={e => setStyleFilter(e.target.value)}>
          <option value="">All Styles</option>
          {styles.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select style={selectStyle} value={roomFilter} onChange={e => setRoomFilter(e.target.value)}>
          <option value="">All Rooms</option>
          {rooms.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <select style={selectStyle} value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)}>
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {(searchQuery || styleFilter || roomFilter || difficultyFilter) && (
          <button onClick={clearFilters} style={{ ...selectStyle, color: 'var(--k-ink-4)', fontSize: '12px' }}>
            Clear
          </button>
        )}
      </div>

      <div style={{ fontSize: '12px', color: 'var(--k-ink-4)', marginBottom: '16px', fontFamily: 'var(--font-mono), monospace' }}>
        {filteredTemplates.length} of {templates.length} templates
      </div>

      {/* Grid */}
      {filteredTemplates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--k-ink-4)', fontSize: '14px' }}>
          No templates match your filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {filteredTemplates.map(template => (
            <div key={template.id} style={{ border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-lg)', background: 'var(--k-surface)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Style color strip */}
              <div style={{ height: '3px', background: 'var(--k-amber)' }} />

              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--k-ink)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                    {template.name}
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--k-ink-4)', lineHeight: 1.5, marginBottom: '12px', flex: 1 }}>
                  {template.description.slice(0, 100)}{template.description.length > 100 ? '…' : ''}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                  <Pill color={DIFFICULTY_COLOR[template.difficulty]}>{template.difficulty}</Pill>
                  <Pill>{template.room_type.replace('_', ' ')}</Pill>
                  <Pill>{template.style.replace('_', ' ')}</Pill>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--k-ink-4)', fontFamily: 'var(--font-mono), monospace', marginBottom: '14px' }}>
                  <span>{template.estimated_hours}h</span>
                  <span>${template.estimated_cost_low}–${template.estimated_cost_high}</span>
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                  <button
                    onClick={() => { setSelectedTemplate(template); setDetailsOpen(true) }}
                    className="k-btn k-btn-primary k-btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleViewCutlist(template)}
                    className="k-btn k-btn-ghost k-btn-sm"
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Cut List
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        {selectedTemplate && (
          <>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--k-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--k-ink)', marginBottom: '6px' }}>
                    {selectedTemplate.name}
                  </h2>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <Pill color={DIFFICULTY_COLOR[selectedTemplate.difficulty]}>{selectedTemplate.difficulty}</Pill>
                    <Pill>{selectedTemplate.style.replace('_', ' ')}</Pill>
                    <Pill>{selectedTemplate.room_type.replace('_', ' ')}</Pill>
                  </div>
                </div>
                <button onClick={() => setDetailsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--k-ink-4)', fontSize: '20px', lineHeight: 1, padding: 0 }}>×</button>
              </div>
            </div>

            <div style={{ padding: '20px 28px' }}>
              <p style={{ fontSize: '14px', color: 'var(--k-ink-3)', lineHeight: 1.7, marginBottom: '16px' }}>
                {selectedTemplate.description}
              </p>

              {selectedTemplate.inspiration_notes && (
                <div style={{ padding: '12px 14px', background: 'var(--k-bg-subtle)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-md)', fontSize: '13px', color: 'var(--k-ink-3)', marginBottom: '16px' }}>
                  {selectedTemplate.inspiration_notes}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                {[
                  { label: 'Build Time', value: `${selectedTemplate.estimated_hours} hours` },
                  { label: 'Estimated Cost', value: `$${selectedTemplate.estimated_cost_low}–$${selectedTemplate.estimated_cost_high}` },
                ].map(item => (
                  <div key={item.label} style={{ padding: '10px 12px', background: 'var(--k-surface)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-md)' }}>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--k-ink)' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <Section title={`Components (${selectedTemplate.components.length})`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--k-border)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-md)', overflow: 'hidden' }}>
                  {selectedTemplate.components.map((comp, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--k-surface)', fontSize: '13px' }}>
                      <span style={{ color: 'var(--k-ink)' }}>{comp.name} ×{comp.quantity}</span>
                      <span style={{ color: 'var(--k-ink-4)', fontFamily: 'var(--font-mono), monospace', fontSize: '12px' }}>
                        {comp.width}" × {comp.height}" × {comp.depth}" · {comp.material}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title={`Hardware (${selectedTemplate.hardware_needed.length})`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--k-border)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-md)', overflow: 'hidden' }}>
                  {selectedTemplate.hardware_needed.map((hw, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--k-surface)', fontSize: '13px' }}>
                      <span style={{ color: 'var(--k-ink)' }}>{hw.name} ×{hw.quantity}</span>
                      <span style={{ color: 'var(--k-ink-4)', fontSize: '12px' }}>{hw.type}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Joinery">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedTemplate.joinery.map(j => <Pill key={j}>{j}</Pill>)}
                </div>
              </Section>

              <Section title="Finishing Suggestions">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedTemplate.finishing_suggestions.map((f, i) => (
                    <div key={i} style={{ fontSize: '13px', color: 'var(--k-ink-3)', display: 'flex', gap: '8px' }}>
                      <span style={{ color: 'var(--k-amber)', flexShrink: 0 }}>{i + 1}.</span> {f}
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--k-border)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDetailsOpen(false)} className="k-btn k-btn-ghost k-btn-sm">Close</button>
              <button onClick={() => { setDetailsOpen(false); handleViewCutlist(selectedTemplate) }} className="k-btn k-btn-ghost k-btn-sm">Cut List</button>
              <button onClick={() => handleUseTemplate(selectedTemplate)} className="k-btn k-btn-primary k-btn-sm">Use Template</button>
            </div>
          </>
        )}
      </Modal>

      {/* Cut List Modal */}
      <Modal open={cutlistOpen} onClose={() => setCutlistOpen(false)}>
        {cutlistData && (
          <>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--k-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--k-ink)', margin: 0 }}>
                Cut List: {cutlistData.template_name}
              </h2>
              <button onClick={() => setCutlistOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--k-ink-4)', fontSize: '20px', lineHeight: 1, padding: 0 }}>×</button>
            </div>

            <div style={{ padding: '20px 28px' }}>
              {/* Summary stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '24px' }}>
                {[
                  { label: 'Components', value: cutlistData.summary.total_components },
                  { label: '¾" Sheets', value: cutlistData.summary.estimated_3_4_sheets },
                  { label: 'Board Feet', value: cutlistData.summary.total_lumber_board_feet },
                  { label: 'Est. Cost', value: cutlistData.summary.estimated_cost_range },
                ].map(item => (
                  <div key={item.label} style={{ padding: '12px', background: 'var(--k-surface)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-md)', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '6px' }}>{item.label}</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--k-ink)', fontFamily: 'var(--font-mono), monospace' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Cut list */}
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '8px' }}>Materials</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--k-border)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-md)', overflow: 'hidden', marginBottom: '20px' }}>
                {cutlistData.cut_list.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--k-surface)', fontSize: '13px' }}>
                    <span style={{ color: 'var(--k-ink)' }}>{item.sheet || item.lumber}</span>
                    <span style={{ color: 'var(--k-ink-4)', fontFamily: 'var(--font-mono), monospace', fontSize: '12px' }}>
                      {item.pieces ? `${item.pieces} pcs · ${item.waste_pct}% waste` : `${item.board_feet} bf`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Hardware */}
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '8px' }}>Hardware</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--k-border)', border: '1px solid var(--k-border)', borderRadius: 'var(--k-r-md)', overflow: 'hidden', marginBottom: '20px' }}>
                {cutlistData.hardware_needed.map((hw, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--k-surface)', fontSize: '13px' }}>
                    <span style={{ color: 'var(--k-ink)' }}>{hw.name} ×{hw.quantity}</span>
                    <span style={{ color: 'var(--k-ink-4)', fontSize: '12px' }}>{hw.type}</span>
                  </div>
                ))}
              </div>

              {/* Joinery + Finishing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '8px' }}>Joinery</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {cutlistData.joinery.map(j => <Pill key={j}>{j}</Pill>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--k-ink-4)', marginBottom: '8px' }}>Finishing</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {cutlistData.finishing.map((f, i) => <div key={i} style={{ fontSize: '13px', color: 'var(--k-ink-3)' }}>{f}</div>)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--k-border)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setCutlistOpen(false)} className="k-btn k-btn-ghost k-btn-sm">Close</button>
              <button onClick={() => alert('Export coming soon!')} className="k-btn k-btn-primary k-btn-sm">Export</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
