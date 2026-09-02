/* ============================================
   stadium-dossier — registry intake projection (pq-059)
   ============================================
   GET /api/registry-projection/<slug>  →  perf-projection/1

   This app's read-only projection into the SV Registry card's Performance
   tab. The registry composes it live (sv-registry api/performance.js) and
   renders it. Contract, including the what-never-projects rules enforced
   below: sv-registry docs/performance-projection-contract.md.

   ─── What this is NOT ─────────────────────────────────────────────────────
   Not a promotion path. This app's own sv-way.config.json records the open
   gap that submissions here don't route into sv-registry's `_candidates`
   queue — this door does NOT close that gap and must not be mistaken for it.
   It answers a different, narrower question the card needs: HAS this client
   filled out their intake, and how completely. If an intake ANSWER should
   become a player fact, it still has to go through the registry's write door
   (the candidate lane) like everything else.

   ─── What crosses this door ───────────────────────────────────────────────
   COMPLETENESS COUNTS AND FOUR PILLARS SELECTION ONLY.
     • how many applicable fields were answered, overall and per section
     • which Four Pillars the athlete selected
     • whether consent was recorded (a process fact, boolean)
     • the submission timestamp and the athlete's own player_type
   NOTHING ELSE. In particular, and by construction rather than by care:
     • no answer VALUE of any kind is read out of form_data — only whether a
       value is non-empty
     • client-submitted MEDICAL answers (injury_history, medical_history,
       current_injuries, allergies, has_pt, …) are counted and never read
     • guardian identity (guardian_name, guardian_relationship) never leaves
       the store; only `consent_recorded` does
     • no email, phone, address, DOB, hometown or name (the name shown is the
       one CANON already holds)

   ─── Read duty ────────────────────────────────────────────────────────────
   The incoming id is a REGISTRY slug, resolved against canon FIRST
   (api/_lib/registry-resolve.js) and only then matched to a submission by
   the canonical name canon returned. Never slugified, never guessed.

   ─── Auth + configuration ─────────────────────────────────────────────────
   Bearer SV_REGISTRY_SERVICE_TOKEN, constant-time compare, FAILS CLOSED.
   ⚠ This app has no server-side reader today: the browser's anon key is
   insert-only by RLS and cannot read submissions back. This door therefore
   needs DOSSIER_SUPABASE_URL + DOSSIER_SUPABASE_SERVICE_KEY, and it stays
   DARK (503) until they exist. Provisioning a service-role key in a project
   that has never had one is a real change to this app's security posture —
   BE's call, not a session's. Until then the registry panel simply renders
   "not connected".
*/

import { createHash, timingSafeEqual } from 'node:crypto';
import { resolveSlug, identityFlagged, nameKey } from '../_lib/registry-resolve.js';
import { SECTION_ORDER, FIELD_SECTION, FOUR_PILLAR_LABELS } from '../_lib/dossier-fields.js';

const SOURCE = 'stadium-dossier';
const SCHEMA = 'perf-projection/1';
const SLUG_RE = /^[a-z0-9-]{1,64}$/;

const SUPABASE_URL = process.env.DOSSIER_SUPABASE_URL;
const SERVICE_KEY = process.env.DOSSIER_SUPABASE_SERVICE_KEY;

function bearerMismatch(expected, presented) {
  const a = createHash('sha256').update(presented).digest();
  const b = createHash('sha256').update(expected).digest();
  return !presented || !timingSafeEqual(a, b);
}

function body(slug, extra) {
  return { schema: SCHEMA, source: SOURCE, slug, as_of: null, projected: true, resolved: null, intake: null, _flags: [], ...extra };
}

/** True when a stored answer counts as answered. Reads truthiness, not content. */
function answered(v) {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'boolean') return true;
  return String(v).trim() !== '';
}

export default async function handler(req, res) {
  const expected = String(process.env.SV_REGISTRY_SERVICE_TOKEN || '').trim();
  if (!expected) return res.status(503).json({ ok: false, error: 'projection door not configured' });
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'method not allowed' });
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  if (bearerMismatch(expected, m ? m[1].trim() : '')) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const slug = String((req.query && req.query.slug) || '').trim().toLowerCase();
  if (!SLUG_RE.test(slug)) {
    return res.status(400).json({ ok: false, error: 'slug must match ^[a-z0-9-]{1,64}$' });
  }

  // ── 1. read duty: canon first ───────────────────────────────────────────
  const r = await resolveSlug(slug);
  if (!r.ok) {
    return res.status(200).json(body(slug, { projected: false, _flags: [{ code: r.code, detail: r.detail }] }));
  }
  const canon = r.canon;
  const resolved = { name: canon.name, confidence: canon.confidence, is_client: canon.is_client, retired: canon.retired };
  const refuse = (code, detail) =>
    res.status(200).json(body(slug, { projected: false, resolved, _flags: [{ code, detail }] }));

  if (!canon.is_client) return refuse('not-a-client', 'canon says is_client:false');
  if (canon.retired) return refuse('retired', 'canon career_status is permanently terminal');
  if (identityFlagged(canon)) {
    return refuse('flagged-canon', `open canon flags on ${canon.flagged_fields.join(', ')}`);
  }

  // No server-side reader provisioned ⇒ the door is dark, honestly.
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(200).json(body(slug, {
      resolved,
      _flags: [{
        code: 'store-unreachable',
        detail: 'intake store has no server-side reader configured (DOSSIER_SUPABASE_URL / DOSSIER_SUPABASE_SERVICE_KEY)',
      }],
    }));
  }

  // ── 2. this tool's own store, keyed by the name canon just gave us ──────
  try {
    // Only the columns this projection is allowed to touch. `email`, `phone`,
    // `guardian_name` and `guardian_relationship` are deliberately NOT
    // selected — an allowlisted SELECT means they cannot leak even by a
    // later coding mistake downstream.
    const q =
      `dossier_submissions?select=id,full_name,player_type,four_pillars,consent,consent_type,form_data,created_at` +
      `&full_name=ilike.${encodeURIComponent(canon.name)}&order=created_at.desc&limit=5`;
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/${q}`, {
      method: 'GET',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Accept: 'application/json' },
    });
    if (!resp.ok) throw new Error(`dossier_submissions → ${resp.status}`);
    const rows = await resp.json();

    const key = nameKey(canon.name);
    const mine = (rows || []).filter((row) => nameKey(row.full_name) === key);
    if (!mine.length) {
      return res.status(200).json(body(slug, {
        resolved,
        intake: { submission_on_file: false },
        _flags: [{ code: 'no-local-record', detail: 'no intake submission for this canon name' }],
      }));
    }

    // Latest submission wins; earlier ones are counted, never merged.
    const sub = mine[0];
    const fd = (sub.form_data && typeof sub.form_data === 'object') ? sub.form_data : {};
    const ids = Object.keys(fd);

    const perSection = new Map(SECTION_ORDER.map((s) => [s, { section: s, answered: 0, applicable: 0 }]));
    let totalAnswered = 0;
    let unknownFields = 0;
    for (const id of ids) {
      const section = FIELD_SECTION[id];
      const isAnswered = answered(fd[id]);
      if (isAnswered) totalAnswered += 1;
      if (!section) { unknownFields += 1; continue; }
      const row = perSection.get(section);
      row.applicable += 1;
      if (isAnswered) row.answered += 1;
    }

    const pillars = Array.isArray(sub.four_pillars) ? sub.four_pillars : [];
    const flags = [];
    if (mine.length > 1) {
      flags.push({ code: 'no-local-record', detail: `${mine.length} submissions on file; the most recent is projected` });
    }
    if (unknownFields) {
      flags.push({ code: 'no-local-record', detail: `${unknownFields} submitted field id(s) are not in the current form config` });
    }

    return res.status(200).json({
      schema: SCHEMA,
      source: SOURCE,
      slug,
      as_of: sub.created_at ? new Date(sub.created_at).toISOString() : null,
      projected: true,
      resolved,
      intake: {
        submission_on_file: true,
        submissions_on_file: mine.length,
        submitted_at: sub.created_at || null,
        // The athlete's OWN declared status in the form — not canon's, and
        // named to make that obvious.
        declared_player_type: sub.player_type || null,
        completeness: {
          answered: totalAnswered,
          applicable: ids.length,
          pct: ids.length ? Math.round((totalAnswered / ids.length) * 100) : null,
        },
        by_section: SECTION_ORDER.map((s) => perSection.get(s)).filter((row) => row.applicable > 0),
        four_pillars_selected: pillars.map((p) => FOUR_PILLAR_LABELS[p] || String(p)),
        four_pillars_section_present: pillars.length > 0,
        // A process fact: was consent captured at all. Guardian identity and
        // the consent document itself stay in the store.
        consent_recorded: sub.consent === true,
        consent_kind: sub.consent_type === 'guardian' ? 'guardian' : sub.consent_type === 'self' ? 'self' : null,
        // Stated for readers of this payload, not derived from it.
        never_projected: ['medical answers', 'guardian identity', 'contact details', 'answer values'],
      },
      _flags: flags,
    });
  } catch (err) {
    return res.status(200).json(body(slug, {
      resolved,
      _flags: [{ code: 'store-unreachable', detail: err instanceof Error ? err.message : 'store read failed' }],
    }));
  }
}
