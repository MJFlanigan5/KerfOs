"use client";
import { useState, useEffect } from "react";

interface Hardware {
  id: number;
  name: string;
  type: string;
  description?: string;
  price: number;
  supplier?: string;
  url?: string;
  is_active: boolean;
}

interface Supplier {
  id: string;
  name: string;
  base_url: string;
  search_url: string;
  color: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  subtypes: string[];
}

interface HardwareFinderProps {
  selectedHardware?: Hardware | null;
  onSelect?: (hardware: Hardware) => void;
  onClear?: () => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 11px",
  background: "var(--k-surface)",
  border: "1px solid var(--k-border-mid)",
  borderRadius: "var(--k-r-md)",
  fontSize: "13px",
  color: "var(--k-ink)",
  fontFamily: "var(--font-inter), system-ui, sans-serif",
  outline: "none",
  boxSizing: "border-box",
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
}

export default function HardwareFinder({ selectedHardware, onSelect, onClear }: HardwareFinderProps) {
  const [loading, setLoading] = useState(false)
  const [hardware, setHardware] = useState<Hardware[]>([])
  const [filteredHardware, setFilteredHardware] = useState<Hardware[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSupplier, setSelectedSupplier] = useState("all")
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [categories, setCategories] = useState<Record<string, Category>>({})
  const [showSupplierSearch, setShowSupplierSearch] = useState(false)
  const [supplierSearchResults, setSupplierSearchResults] = useState<Supplier[]>([])

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    fetchSuppliers()
    fetchCategories()
    fetchHardware()
  }, [])

  useEffect(() => {
    const filtered = hardware.filter(hw => {
      const matchesSearch = hw.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hw.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = selectedType === "all" || hw.type === selectedType
      const matchesSupplier = selectedSupplier === "all" || hw.supplier === selectedSupplier
      return matchesSearch && matchesType && matchesSupplier
    })
    setFilteredHardware(filtered)
  }, [searchTerm, selectedType, selectedSupplier, hardware])

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hardware/suppliers`)
      if (res.ok) setSuppliers(await res.json())
    } catch { /* silent */ }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/hardware/categories`)
      if (res.ok) setCategories(await res.json())
    } catch { /* silent */ }
  }

  const fetchHardware = async () => {
    setLoading(true); setError(null)
    try {
      const params = new URLSearchParams()
      if (selectedType !== "all") params.append("type", selectedType)
      if (selectedSupplier !== "all") params.append("supplier", selectedSupplier)
      if (searchTerm) params.append("search", searchTerm)
      const res = await fetch(`${API_URL}/api/hardware?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch hardware")
      setHardware(await res.json())
    } catch {
      setError("Could not load hardware. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const searchSuppliers = async (query: string) => {
    if (!query.trim()) { setSupplierSearchResults([]); return }
    try {
      const res = await fetch(`${API_URL}/api/hardware/search/${encodeURIComponent(query)}`)
      if (res.ok) setSupplierSearchResults(await res.json())
    } catch { /* silent */ }
  }

  const seedDatabase = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/hardware/seed`, { method: "POST" })
      if (res.ok) { const d = await res.json(); alert(d.message); fetchHardware() }
    } catch { /* silent */ } finally { setLoading(false) }
  }

  const openSupplierLink = (url?: string) => { if (url) window.open(url, "_blank") }
  const getSupplierInfo = (id?: string) => suppliers.find(s => s.id === id)
  const getCategoryIcon = (type: string) => categories[type]?.icon || "·"

  const hardwareTypes = Array.from(new Set(hardware.map(hw => hw.type)))

  if (loading && hardware.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", color: "var(--k-ink-4)", fontSize: "14px" }}>
        Loading hardware...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: "14px 16px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "var(--k-r-md)" }}>
        <p style={{ fontSize: "13px", color: "#ef4444", marginBottom: "10px" }}>{error}</p>
        <button onClick={fetchHardware} className="k-btn k-btn-ghost k-btn-sm">Retry</button>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Selected hardware banner */}
      {selectedHardware && (
        <div style={{ padding: "14px 16px", background: "var(--k-surface)", border: "1px solid var(--k-border)", borderRadius: "var(--k-r-md)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--k-ink-4)" }}>Selected</span>
            </div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--k-ink)", marginBottom: "4px" }}>{selectedHardware.name}</div>
            {selectedHardware.description && (
              <div style={{ fontSize: "13px", color: "var(--k-ink-3)", marginBottom: "8px" }}>{selectedHardware.description}</div>
            )}
            <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--k-ink-4)" }}>
              <span>{selectedHardware.type}</span>
              {selectedHardware.supplier && (
                <span style={{ color: getSupplierInfo(selectedHardware.supplier)?.color }}>
                  {getSupplierInfo(selectedHardware.supplier)?.name || selectedHardware.supplier}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
            <span style={{ fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "var(--k-ink)" }}>
              ${selectedHardware.price.toFixed(2)}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={onClear} className="k-btn k-btn-ghost k-btn-sm">Clear</button>
              {selectedHardware.url && (
                <button onClick={() => openSupplierLink(selectedHardware.url)} className="k-btn k-btn-ghost k-btn-sm">View →</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => setShowSupplierSearch(o => !o)}
          style={{ fontSize: "12px", color: "var(--k-amber)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {showSupplierSearch ? "Hide" : "Show"} supplier search
        </button>
        <button
          onClick={seedDatabase}
          style={{ fontSize: "12px", color: "var(--k-ink-4)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Seed sample data
        </button>
      </div>

      {/* Supplier search panel */}
      {showSupplierSearch && (
        <div style={{ padding: "16px", background: "var(--k-surface)", border: "1px solid var(--k-border)", borderRadius: "var(--k-r-md)" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--k-ink)", marginBottom: "10px" }}>Search All Suppliers</div>
          <input
            style={inputStyle}
            placeholder="Search across all suppliers..."
            onChange={e => searchSuppliers(e.target.value)}
          />
          {supplierSearchResults.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "10px" }}>
              {supplierSearchResults.map(supplier => (
                <button
                  key={supplier.id}
                  onClick={() => openSupplierLink(supplier.search_url)}
                  style={{ padding: "10px 12px", background: "var(--k-bg)", border: "1px solid var(--k-border)", borderLeft: `3px solid ${supplier.color}`, borderRadius: "var(--k-r-md)", textAlign: "left", cursor: "pointer" }}
                >
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--k-ink)", marginBottom: "2px" }}>{supplier.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--k-ink-4)" }}>Open search →</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search + filters */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          style={inputStyle}
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by name or description..."
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--k-ink-4)", marginBottom: "6px" }}>
              Type
            </label>
            <select style={selectStyle} value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              <option value="all">All Types</option>
              {Object.entries(categories).map(([key, cat]) => (
                <option key={key} value={key}>{cat.name}</option>
              ))}
              {hardwareTypes.filter(t => !categories[t]).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--k-ink-4)", marginBottom: "6px" }}>
              Supplier
            </label>
            <select style={selectStyle} value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
              <option value="all">All Suppliers</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Hardware grid */}
      {filteredHardware.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px", color: "var(--k-ink-4)", fontSize: "14px" }}>
          <p style={{ marginBottom: "4px" }}>No hardware found.</p>
          <p style={{ fontSize: "12px" }}>Try seeding sample data or adjusting filters.</p>
        </div>
      ) : (
        <>
          <div style={{ fontSize: "12px", color: "var(--k-ink-4)", fontFamily: "var(--font-mono), monospace" }}>
            {filteredHardware.length} of {hardware.length} items
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
            {filteredHardware.map(hw => {
              const supplierInfo = getSupplierInfo(hw.supplier)
              const categoryInfo = categories[hw.type]
              const isSelected = selectedHardware?.id === hw.id
              return (
                <div
                  key={hw.id}
                  onClick={() => onSelect?.(hw)}
                  style={{
                    background: "var(--k-surface)",
                    border: `1px solid ${isSelected ? "var(--k-amber)" : "var(--k-border)"}`,
                    borderRadius: "var(--k-r-md)",
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "border-color 150ms ease",
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = "var(--k-border-strong)" }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "var(--k-border)" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--k-ink)", lineHeight: 1.3, flex: 1, paddingRight: "8px" }}>
                      {hw.name}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--k-ink)", fontFamily: "var(--font-mono), monospace", flexShrink: 0 }}>
                      ${hw.price.toFixed(2)}
                    </span>
                  </div>

                  {hw.description && (
                    <p style={{ fontSize: "12px", color: "var(--k-ink-4)", marginBottom: "10px", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {hw.description}
                    </p>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "11px", padding: "2px 7px", border: "1px solid var(--k-border)", borderRadius: "var(--k-r-sm)", color: "var(--k-ink-4)" }}>
                      {categoryInfo?.name || hw.type}
                    </span>
                    {supplierInfo && (
                      <span style={{ fontSize: "11px", padding: "2px 7px", borderRadius: "var(--k-r-sm)", color: supplierInfo.color, background: supplierInfo.color + "18" }}>
                        {supplierInfo.name}
                      </span>
                    )}
                  </div>

                  {hw.url && (
                    <button
                      onClick={e => { e.stopPropagation(); openSupplierLink(hw.url) }}
                      style={{ marginTop: "10px", width: "100%", padding: "6px", fontSize: "12px", color: "var(--k-ink-3)", background: "var(--k-bg-subtle)", border: "1px solid var(--k-border)", borderRadius: "var(--k-r-sm)", cursor: "pointer" }}
                    >
                      View at supplier →
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Supplier legend */}
      {suppliers.length > 0 && (
        <div style={{ borderTop: "1px solid var(--k-border)", paddingTop: "16px" }}>
          <div style={{ fontSize: "11px", fontFamily: "var(--font-mono), monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--k-ink-4)", marginBottom: "8px" }}>
            Supported Suppliers
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {suppliers.map(s => (
              <button
                key={s.id}
                onClick={() => openSupplierLink(s.base_url)}
                style={{ padding: "4px 10px", borderRadius: "var(--k-r-sm)", fontSize: "12px", color: s.color, background: s.color + "15", border: `1px solid ${s.color}40`, cursor: "pointer" }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
