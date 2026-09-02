/* ============================================
   Read duty — deterministic resolution against the SV system of record
   ============================================
   THE-SV-WAY.md § Actualization: "any system doing work about a player
   resolves that player against the registry first, so the work is done
   knowing who the player is today. A tool that names a player without
   resolving them against canon is leaving the system of record on the
   table."

   This module is that read and nothing else: one plain GET against
   sv-registry's brain API. No LLM, no inference, no writes. It is the JS
   sibling of `sv-media-pipeline/src/brain.py`, the org's reference
   implementation of this pattern (that repo is NOT modified by this work —
   it is the pattern, and it already satisfies read duty).

   Best-effort by contract. Every failure mode — network, timeout, 4xx/5xx,
   no match, ambiguous match — returns a typed miss. It NEVER falls back to
   slugifying a name: an unresolved player is flagged, never projected
   (THE-SV-WAY.md § The gate). Guessing here would attach one athlete's
   intake submission to another athlete's registry card.

   Underscore-prefixed directory ⇒ Vercel does not route it as a function.
   Used by: api/registry-projection/[slug].js
*/

const DEFAULT_BASE = 'https://sv-registry.vercel.app';
const TIMEOUT_MS = 8000;
const SLUG_RE = /^[a-z0-9-]{1,64}$/;

// Canon fields whose open flags block a projection. This read leans on
// exactly these — who this is, and whether we represent them. A flag
// elsewhere in the dossier is irrelevant to this door and must not silence
// it.
const IDENTITY_FIELDS = new Set([
  'name',
  'identity.full_name',
  'current_state.is_client',
  'representation',
  'representation.client_status',
]);

function baseUrl() {
  return String(process.env.SV_REGISTRY_BASE_URL || DEFAULT_BASE).replace(/\/+$/, '');
}

async function brainGet(query) {
  const token = String(process.env.SV_REGISTRY_SERVICE_TOKEN || '').trim();
  const headers = { Accept: 'application/json', 'User-Agent': 'stadium-dossier/registry-resolve' };
  // The brain API accepts a registry-minted service token as a Bearer
  // (sv-registry api/_lib/auth.js). A server-side fetch sends no Origin so
  // its origin gate passes either way — presenting the token means this read
  // keeps working when SV_AUTH_ENFORCE flips on.
  if (token) headers.Authorization = `Bearer ${token}`;

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(`${baseUrl()}/api/brain?${query}`, { headers, signal: ac.signal });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function flaggedFields(rec) {
  if (!Array.isArray(rec._flags)) return [];
  return rec._flags.map((f) => (f && typeof f === 'object' ? String(f.field || '') : '')).filter(Boolean);
}

/** True when canon holds an open flag on a field THIS read depends on. */
export function identityFlagged(canon) {
  return (canon.flagged_fields || []).some((f) => IDENTITY_FIELDS.has(f));
}

function toCanon(rec, confidence) {
  const slug = String(rec.id || '');
  if (!SLUG_RE.test(slug)) return null;
  const identity = rec.identity || {};
  const rep = rec.representation_status || null;
  const state = rec.state || null;
  const career = (state && state.career_status) || null;

  // Representation, read first, from the slice canon dedicates to it. NEVER
  // `client_status` — that is the playing-status-derived string, a different
  // fact that disagrees with representation in both directions.
  const isClient =
    rep && typeof rep.is_client === 'boolean' ? rep.is_client
      : state && typeof state.is_client === 'boolean' ? state.is_client
        : rec.is_client !== false;

  return {
    slug,
    name: String(rec.name || identity.full_name || '') || slug,
    is_client: isClient,
    retired: !!(career && career.terminal_kind === 'permanent'),
    confidence,
    flagged_fields: flaggedFields(rec),
    has_unresolved_flags: !!(rec._has_unresolved_flags || rec.has_unresolved_flags),
  };
}

/**
 * Resolve a registry slug to present-day canon.
 * `&state=1` attaches stateOf() — the canonical read door for career_status,
 * which is how "retired" is established rather than inferred from a label.
 * @returns {Promise<{ok:true,canon:object}|{ok:false,code:string,detail:string}>}
 */
export async function resolveSlug(slug) {
  if (!SLUG_RE.test(String(slug || ''))) {
    return { ok: false, code: 'bad-slug', detail: 'slug must match ^[a-z0-9-]{1,64}$' };
  }
  const body = await brainGet(`entity=${encodeURIComponent(slug)}&state=1`);
  if (!body) return { ok: false, code: 'registry-unreachable', detail: 'brain API did not answer' };
  if (body.ok === false || !body.entity) {
    return { ok: false, code: 'registry-unresolved', detail: `no registry entity for "${slug}"` };
  }
  const canon = toCanon(body.entity, 'entity');
  if (!canon) return { ok: false, code: 'registry-unresolved', detail: 'entity carried no usable id' };
  return { ok: true, canon };
}

/**
 * Resolve a free-text name to canon. An ambiguous match is a MISS, not a
 * pick — the brain returns confidence:'ambiguous' with candidates, and
 * choosing among them here would be exactly the guess this module refuses.
 */
export async function resolveName(name) {
  const q = String(name || '').trim();
  if (!q) return { ok: false, code: 'registry-unresolved', detail: 'empty name' };
  const body = await brainGet(`resolve=${encodeURIComponent(q)}`);
  if (!body) return { ok: false, code: 'registry-unreachable', detail: 'brain API did not answer' };
  if (body.confidence === 'ambiguous') {
    const n = Array.isArray(body.candidates) ? body.candidates.length : 0;
    return { ok: false, code: 'ambiguous-registry-match', detail: `${n} candidates for "${q}"` };
  }
  if (!body.player) return { ok: false, code: 'registry-unresolved', detail: `no canon match for "${q}"` };
  const canon = toCanon(body.player, String(body.confidence || 'resolve'));
  if (!canon) return { ok: false, code: 'registry-unresolved', detail: 'match carried no usable id' };
  return { ok: true, canon };
}

/** Case/whitespace-insensitive name key, for matching canon → a local row. */
export function nameKey(name) {
  return String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
}
