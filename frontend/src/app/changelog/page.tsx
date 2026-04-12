import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog | KerfOS',
  description: 'What\'s new in KerfOS — release notes and updates.',
}

const RELEASES = [
  {
    version: '0.9.0',
    date: 'April 2026',
    tag: 'Latest',
    changes: [
      { type: 'new', text: 'Design Doctor — live DFM analysis flags joinery issues before you cut' },
      { type: 'new', text: 'Hardware Finder — browse hinges, slides, and pulls matched to your cabinet dimensions' },
      { type: 'new', text: 'Community gallery — share finished builds and get inspired' },
      { type: 'new', text: 'Template library — full kitchen, bath, and shop project starting points' },
      { type: 'improved', text: 'Cut list now groups parts by material and sheet for fewer setups' },
      { type: 'improved', text: 'Cabinet preview is 30% faster on complex assemblies' },
      { type: 'fix', text: 'Fixed toe kick height calculation for frameless cabinets' },
      { type: 'fix', text: 'Edge banding now appears in cut list export correctly' },
    ],
  },
  {
    version: '0.8.0',
    date: 'March 2026',
    tag: null,
    changes: [
      { type: 'new', text: 'Material selector — compare plywood grades, solid wood, and MDF by cost and application' },
      { type: 'new', text: 'Scrap tracker — log offcuts from previous projects and use them in new cut lists' },
      { type: 'new', text: 'G-code export — 2.5D toolpath output compatible with most hobby and pro CNCs' },
      { type: 'improved', text: 'Nest optimizer now places small parts in corners of larger drops' },
      { type: 'fix', text: 'Fixed door overlay calculation in inset-face-frame mode' },
    ],
  },
  {
    version: '0.7.0',
    date: 'February 2026',
    tag: null,
    changes: [
      { type: 'new', text: '3D cabinet preview — orbit, pan, and inspect your assembly before cutting' },
      { type: 'new', text: 'Drawer slide selection — auto-filters by opening width and extension type' },
      { type: 'improved', text: 'Pricing calculator now accounts for secondary operations (dado, rabbet, pocket)' },
    ],
  },
]

const typeColor: Record<string, string> = {
  new:      'var(--k-amber)',
  improved: 'var(--k-ink-3)',
  fix:      'var(--k-ink-4)',
}

const typeLabel: Record<string, string> = {
  new:      'New',
  improved: 'Improved',
  fix:      'Fix',
}

export default function ChangelogPage() {
  return (
    <div style={{ background: 'var(--k-bg)', minHeight: '100vh' }}>
      <div style={{
        maxWidth: '760px',
        margin: '0 auto',
        padding: '80px 40px',
      }}>
        {/* Header */}
        <div style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '11px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--k-ink-4)',
          marginBottom: '16px',
        }}>
          Changelog
        </div>
        <h1 className="k-heading-lg" style={{ marginBottom: '8px' }}>What&rsquo;s new</h1>
        <p style={{ fontSize: '15px', color: 'var(--k-ink-3)', marginBottom: '64px' }}>
          Release notes for KerfOS. All changes that affect your workflow.
        </p>

        {/* Releases */}
        {RELEASES.map((release, ri) => (
          <div key={release.version} style={{
            marginBottom: ri < RELEASES.length - 1 ? '56px' : 0,
          }}>
            {/* Version header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--k-border)',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--k-ink)',
              }}>
                v{release.version}
              </span>
              {release.tag && (
                <span style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: 'var(--k-amber)',
                  border: '1px solid var(--k-amber-glow)',
                  padding: '2px 7px',
                  borderRadius: 'var(--k-r-sm)',
                }}>
                  {release.tag}
                </span>
              )}
              <span style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '12px',
                color: 'var(--k-ink-4)',
                marginLeft: 'auto',
              }}>
                {release.date}
              </span>
            </div>

            {/* Changes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {release.changes.map((change, ci) => (
                <div key={ci} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: typeColor[change.type],
                    flexShrink: 0,
                    marginTop: '2px',
                    minWidth: '60px',
                  }}>
                    {typeLabel[change.type]}
                  </span>
                  <span style={{ fontSize: '14px', color: 'var(--k-ink-2)', lineHeight: 1.6 }}>
                    {change.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
