# Build Spec — Staff-started, pre-filled, resumable onboarding (invite links)

Status: **spec only — not built.** Drafted 2026-06-30 from a Tom/Kent discussion. Gated on the question set being finalized (Kent reviewing). Question-source (Google Sheet vs hard-code) is a **separate, deferred** decision — see §6.

## 1. Goal

Let SV staff create a per-player onboarding instance, **pre-filled with what we already know**, and hand the player a unique link to resume/complete it. For some players (level-dependent), staff complete the questionnaire **interview-style** — the player does no data entry. In all cases the **player/guardian must still complete consent themselves** (staff can never check consent — MHMDA).

This is the unification insight: "pre-filled resume link" and "interview-style fill" are the **same mechanism** — a staff-created, pre-fillable, server-backed record. Who drives the link is the only difference.

## 2. Current architecture (what we're extending)

- Vite + React SPA, static on Vercel (`stadium-dossier.vercel.app`). **No backend/API routes.**
- Supabase "Player Insights" `jfcdasezpgjfqfqzsjat`. `dossier_submissions` is **insert-only** for `anon`; reads are service-role only.
- Field schema is hard-coded in `src/data/formConfig.js` (stable `id` per field). Draft currently saved to **localStorage** (device-bound).
- `dossier_submissions` already has a `player_id uuid` column and there's a `players` table — partial scaffolding for linking submissions to known players.
- `papaparse` is already a dependency (useful for §6 Option B/C).

## 3. Core building block — tokened invite + secure read (no new backend)

New table **`dossier_invites`**:

| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `token` | text unique | **high-entropy bearer credential** in the link (≥32 bytes, base64url) |
| `player_id` | uuid | FK → `players` |
| `player_type` | text | preset: highschool / college / pro |
| `prefill` | jsonb | `{field_id: value}` staff pre-populated. **Excludes consent fields.** |
| `draft` | jsonb | working answers as player/staff edit (server-backed draft) |
| `status` | text | `created` → `in_progress` → `awaiting_consent` → `submitted` |
| `created_by` | text | SV staff |
| `created_at` / `updated_at` | timestamptz | |
| `expires_at` | timestamptz | links must expire (security) |
| `submission_id` | uuid | set on submit → `dossier_submissions.id` |

**Access pattern (keeps it serverless, no table exposure):**
- Table has **no anon SELECT** (would leak all invites/PII).
- `get_invite(p_token)` — `SECURITY DEFINER` fn, anon EXECUTE. Returns the single matching invite's safe fields (`player_type`, `prefill`, `draft`, `status`) **only** if token valid, not expired, not submitted. No enumeration (token is unguessable).
- `save_invite_draft(p_token, p_draft)` — `SECURITY DEFINER`, anon EXECUTE. Upserts `draft`/`status` where token matches.
- `create_invite(player_id, player_type, prefill)` — service-role only (staff). Returns token/link.
- Submit: either keep the current `anon insert` into `dossier_submissions` (now including `player_id` + token) plus a trigger to flip the invite to `submitted`; **or** a `submit_dossier(...)` `SECURITY DEFINER` fn that inserts + flips atomically (preferred).

**Security notes:** the link is a bearer token — anyone holding it sees that player's pre-filled PII/health data (standard magic-link model). So links go only to the player/guardian or are held by staff. Set `expires_at`; `get_invite` returns nothing past expiry or after submission.

## 4. Frontend changes (`App.jsx`)

- On load, read `?t=<token>` (or `/resume/:token`). If present → `get_invite(token)`:
  - valid → set `playerStatus` from `player_type`; seed `formData` from `{...prefill, ...draft}`; mark session as "invited".
  - invalid/expired/submitted → friendly message, no form.
- **Draft persistence:** in invited mode, debounce-save via `save_invite_draft` (server-backed) so progress survives device changes and staff↔player hand-off. (localStorage stays as the fallback for anonymous/un-invited use.)
- **Submission:** include `player_id` + token; mark invite `submitted` on success.

## 5. Consent — the hard constraint (unchanged)

- Consent is **never** pre-filled, **never** staff-completed. `prefill`/`draft` explicitly exclude all consent fields (`consent`, `consent_medical_sharing`, guardian fields, snapshot).
- Interview-style "without them participating" applies to **data only**. Pattern for full staff fill: staff complete the questionnaire → invite goes to **`awaiting_consent`** (data locked) → link sent to the player/guardian who completes *only* the consent step. The provable-consent record (version, wording snapshot, timestamp, self/guardian) is still captured from the actual data subject.

## 6. Questions source — DEFERRED decision (design is compatible with all)

`formConfig.js` defines a canonical config shape (array of field defs). That shape is identical regardless of source:
- **A. Hard-code (today):** edit `formConfig.js`, redeploy.
- **B. Sheet → build-time:** build script fetches published Google Sheet CSV (`papaparse`), validates, emits `formConfig.generated.js`. Change = edit sheet + redeploy (Vercel deploy hook). Robust; no runtime Google dependency.
- **C. Sheet → runtime:** fetch published CSV at runtime. Instant changes, but adds a runtime Google dependency (config-only — **no PII leaves**, unlike the removed Nominatim call).

Recommendation deferred per Tom until the question set is locked. **Hard rule regardless of choice:** field `id`s must be **stable identifiers** (not derived from label text), and a sheet must carry an explicit `id` column — otherwise `prefill`/`draft`/stored `form_data` break when wording changes. Locking the question set (with stable ids) is the prerequisite for the pre-fill work, which is why the sequencing is: lock questions → then build.

## 7. ⚠️ Privacy-policy interplay (bundle into the next legal pass)

This feature changes two policy facts — surface to legal *now* so it's not a surprise after the current review:
1. **§8 / §9 / retention:** server-backed drafts mean partial answers persist in Supabase (US) **before** submission, not just in localStorage. Update §8's "saved in your browser… cleared on submission" and note draft retention/expiry.
2. **§2 framing:** SV may **pre-populate** known info (data the player didn't personally enter). The "information you provide" framing should acknowledge staff-entered/pre-filled data.

## 8. Phasing

1. **Core:** `dossier_invites` + `get_invite`/`save_invite_draft`/`create_invite` + `App.jsx` token-resume + server draft + submit linkage.
2. **Staff admin:** minimal page to create invites + copy link (could live in `sv-internal-hub`); MVP = Supabase dashboard / SQL snippet.
3. **Interview-style:** `awaiting_consent` hand-off state.
4. **Questions source** (separate track, after lock): per §6.
