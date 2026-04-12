'use client'

import { useState } from 'react'
import { LegalShell, LegalSection, LegalCardGrid, LegalCard, LegalFooter } from '@/components/LegalShell'

export default function GDPRPage() {
  const [userId, setUserId] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState('')

  const submit = async (action: string) => {
    if (!userId || !email) { setError('Enter both User ID and Email to continue.'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      let response: Response
      switch (action) {
        case 'access':
          response = await fetch(`/api/gdpr/data/access/${userId}`); break
        case 'export':
          response = await fetch('/api/gdpr/data/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, email, export_format: 'json' }) }); break
        case 'delete':
          response = await fetch('/api/gdpr/data/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: userId, email, confirm: true }) }); break
        case 'consent':
          response = await fetch(`/api/gdpr/consent/${userId}`); break
        default:
          throw new Error('Unknown action')
      }
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Request failed')
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--k-surface)',
    border: '1px solid var(--k-border-mid)',
    borderRadius: 'var(--k-r-md)',
    fontSize: '14px',
    color: 'var(--k-ink)',
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    outline: 'none',
  }

  const actionBtnStyle = {
    padding: '9px 16px',
    background: 'var(--k-surface)',
    border: '1px solid var(--k-border-strong)',
    borderRadius: 'var(--k-r-md)',
    fontSize: '13px',
    color: 'var(--k-ink-2)',
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    cursor: 'pointer',
    transition: 'border-color 150ms ease, background 150ms ease',
  }

  return (
    <LegalShell
      title="GDPR Data Rights"
      subtitle="Exercise your rights under the General Data Protection Regulation."
    >
      <LegalCardGrid>
        <LegalCard label="Right to Access">See what personal data KerfOS holds about you.</LegalCard>
        <LegalCard label="Right to Export">Download your data in a portable JSON format.</LegalCard>
        <LegalCard label="Right to Delete">Request permanent erasure of your account data.</LegalCard>
        <LegalCard label="Right to Object">Withdraw consent or object to data processing.</LegalCard>
      </LegalCardGrid>

      <LegalSection title="Submit a Request">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--k-ink-4)', marginBottom: '6px' }}>
              User ID
            </label>
            <input style={inputStyle} value={userId} onChange={e => setUserId(e.target.value)} placeholder="user_123" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--k-ink-4)', marginBottom: '6px' }}>
              Email
            </label>
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--k-r-md)', fontSize: '13px', color: '#EF4444', marginBottom: '12px' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { action: 'access', label: 'Access My Data' },
            { action: 'export', label: 'Export My Data' },
            { action: 'consent', label: 'View Consent' },
            { action: 'delete', label: 'Delete My Data', danger: true },
          ].map(btn => (
            <button
              key={btn.action}
              style={{
                ...actionBtnStyle,
                borderColor: btn.danger ? 'rgba(239,68,68,0.3)' : undefined,
                color: btn.danger ? '#EF4444' : undefined,
                opacity: loading ? 0.5 : 1,
              }}
              disabled={loading}
              onClick={() => {
                if (btn.danger) {
                  if (!confirm('Are you sure? This requests permanent deletion after a 30-day recovery window.')) return
                }
                submit(btn.action)
              }}
            >
              {loading ? 'Loading...' : btn.label}
            </button>
          ))}
        </div>
      </LegalSection>

      {result && (
        <LegalSection title="Response">
          <pre style={{
            background: 'var(--k-bg-subtle)',
            border: '1px solid var(--k-border)',
            borderRadius: 'var(--k-r-md)',
            padding: '16px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono), monospace',
            color: 'var(--k-ink-3)',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </LegalSection>
      )}

      <LegalFooter />
    </LegalShell>
  )
}
