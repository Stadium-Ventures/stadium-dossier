import { useEffect, useRef, useState } from 'react'

// Full US state/territory name → 2-letter abbreviation, so suggestions read
// "New York, NY" rather than "New York, New York, United States".
const STATE_ABBR = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', 'District of Columbia': 'DC',
  Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL',
  Indiana: 'IN', Iowa: 'IA', Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA',
  Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN',
  Mississippi: 'MS', Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK',
  Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT',
  Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI',
  Wyoming: 'WY', 'Puerto Rico': 'PR',
}

/**
 * Free-text city input with live autocomplete via OpenStreetMap's Nominatim
 * geocoder. Debounced; queries only at 3+ chars. Selecting a suggestion writes
 * a clean "City, ST" (US) or "City, State, Country" (intl) string. Falls back
 * to plain text if the lookup fails, so it never blocks the form.
 */
export default function CityAutocomplete({ value, onChange, placeholder, inputClasses }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const abortRef = useRef(null)
  const justSelected = useRef(false)

  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  useEffect(() => {
    // Don't re-query the value we just set from a click.
    if (justSelected.current) { justSelected.current = false; return }
    const q = (value || '').trim()
    if (q.length < 3) { setSuggestions([]); setOpen(false); return }

    const timer = setTimeout(async () => {
      try {
        abortRef.current?.abort()
        const ctrl = new AbortController()
        abortRef.current = ctrl
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(q)}`
        const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
        if (!res.ok) return
        const data = await res.json()
        const seen = new Set()
        const opts = []
        for (const r of data) {
          const a = r.address || {}
          const city = a.city || a.town || a.village || a.hamlet || a.municipality
          if (!city) continue
          const isUS = a.country_code === 'us'
          const st = isUS ? (STATE_ABBR[a.state] || a.state) : a.state
          const label = isUS && st
            ? `${city}, ${st}`
            : [city, a.state, a.country].filter(Boolean).join(', ')
          if (seen.has(label)) continue
          seen.add(label)
          opts.push(label)
        }
        setSuggestions(opts)
        setOpen(opts.length > 0)
      } catch (e) {
        if (e.name !== 'AbortError') { setSuggestions([]); setOpen(false) }
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [value])

  function select(label) {
    justSelected.current = true
    onChange(label)
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
        placeholder={placeholder}
        autoComplete="off"
        className={inputClasses}
      />
      {open && (
        <ul className="absolute z-20 mt-1 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg max-h-56">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => select(s)}
                className="block w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
