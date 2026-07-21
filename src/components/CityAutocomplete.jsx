import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Free-text city input with autocomplete from a bundled, offline US-cities list.
 * The list (~30k cities, popularity-ranked) is lazy-loaded via dynamic import on
 * first focus, so it stays out of the main bundle and — importantly — NO data
 * ever leaves the app. The field remains free text, so a city not in the list
 * can still be typed.
 */

// Module-level cache so the ~480KB list is parsed at most once per session,
// shared across every city field.
let citiesPromise = null
function loadCities() {
  if (!citiesPromise) {
    citiesPromise = import('../data/usCities.js').then((m) => m.US_CITIES)
  }
  return citiesPromise
}

function rankMatches(cities, query) {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const starts = []
  const contains = []
  for (const c of cities) {
    const lc = c.toLowerCase()
    if (lc.startsWith(q)) starts.push(c)
    else if (lc.includes(q)) contains.push(c)
    // `cities` is pre-sorted by population, so the first hits we collect are
    // already the most common — stop once we have plenty.
    if (starts.length >= 8) break
  }
  return [...starts, ...contains].slice(0, 8)
}

export default function CityAutocomplete({ value, onChange, placeholder, inputClasses }) {
  const [cities, setCities] = useState(null)
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  // Suggestions are pure-derived from (value, loaded list) — no effect/state.
  const suggestions = useMemo(
    () => (cities ? rankMatches(cities, value || '') : []),
    [cities, value]
  )

  function ensureLoaded() {
    if (!cities) loadCities().then(setCities)
  }

  function select(label) {
    onChange(label)
    setOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => { ensureLoaded(); setOpen(true) }}
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
