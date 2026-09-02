# CLAUDE.md — stadium-dossier

This file was missing prior to 2026-08-10 (doc-gap sweep, part of the SV OS
governance audit). What this repo does is not restated here to avoid
inventing facts — read README.md first, and `sv-way.config.json` for this
repo's declared role. In short: a client-facing athlete-intake wizard
(bio/preferences/schedule/medical/Four Pillars/guardian consent) writing to
Supabase, insert-only.

## Registry intake projection (pq-059) — read duty, wired

`GET /api/registry-projection/[slug]` is this app's read-only projection into
the SV Registry card's Performance tab. The registry composes it live
(`sv-registry api/performance.js`) and renders it; nothing is copied into the
registry. Contract: `sv-registry docs/performance-projection-contract.md`.

- **Read duty first.** `api/_lib/registry-resolve.js` resolves the incoming
  registry slug against canon (sv-registry `/api/brain?entity=<slug>&state=1`)
  **before** the submissions store is read, then matches by the canonical name
  canon returned. Unresolved, ambiguous, non-client (`is_client:false`,
  checked first) or retired ⇒ flagged, nothing projects. It never slugifies a
  name. Reference pattern: `sv-media-pipeline/src/brain.py`.
- **Completeness and Four Pillars selection ONLY.** Answered/applicable counts
  overall and per section, which pillars were selected, whether consent was
  recorded (boolean), the submitted timestamp, and the athlete's own declared
  `player_type`. **No answer value is ever read out of `form_data`** — only
  whether a value is non-empty. Medical answers are counted and never read;
  guardian identity, email and phone are not even SELECTed from the table.
- **This is NOT the `_candidates` promotion path.** The gap noted below —
  submissions here don't route into sv-registry's candidate queue — is
  untouched by this door and must not be mistaken for closed. This answers a
  narrower question the card needs: has this client filled out their intake,
  and how completely. An intake *answer* becoming a player fact still goes
  through the registry's write door.
- **The door is dark until BE provisions credentials.** It needs
  `DOSSIER_SUPABASE_URL` + `DOSSIER_SUPABASE_SERVICE_KEY` because the
  browser's anon key is insert-only by RLS and cannot read submissions back.
  A service-role key in a project that has never had one is a real change to
  this app's security posture, so the code stays configured-off (503 for the
  bearer, `store-unreachable` for the store) rather than assuming the answer.
  Bearer-authed with `SV_REGISTRY_SERVICE_TOKEN`; **unset ⇒ 503, never open.**
- `api/_lib/dossier-fields.js` is GENERATED from `src/data/formConfig.js`
  (`node scripts/gen-dossier-fields.mjs`) so the serverless door needs no
  lucide-react import. `npm run check:fields` is the drift guard — run it if
  you change the form config.

## Known gap — read duty (open, tracked)

This repo's own `sv-way.config.json` already flags that submissions here
don't route into sv-registry's `_candidates` queue — a self-admitted gap
against The SV Way's "read duty" / "nothing unvalidated projects" rules.
**Direction as of 2026-08-10 (BE):** this repo's measurements are intended to
have a home on the Player Registry card in sv-registry — i.e. intake
submissions should ultimately flow through the registry's write chokepoint
(candidate lane) rather than living only in this repo's own Supabase table.
Wiring that path is still pending; don't build further on the current
insert-only shape without accounting for it.

## 🧭 The SV Way — North Star doctrine (read this first, every session)

THE-SV-WAY.md in Stadium-Ventures/sv-registry (served live at
https://sv-internal-hub.vercel.app/sv-way.md) is the North Star every Stadium
Ventures tool and every chat working on one routes through — read it at
session start, before anything else. Non-negotiables even before you read it:
every player fact resolves to the player's file in sv-registry and every
surface is a projection of it; nothing unvalidated projects (flag it, file a
candidate, never overwrite a stable field); one write door (write-registry
chokepoint / governed writers); one write-home per dataset; firm work is
first-class but becomes a player fact only when it actualizes through that one
door; systems doing work about a player resolve them against canon first (read
duty); automation is silent when healthy and posts actionable-only to
#sv-automation; collaborative tools live in Stadium-Ventures org repos; locked
client-facing artifacts (Report Packets) are never moved or regenerated. This
tool's hub registration + #sv-automation hookup are canonical requirements of
being "promoted." When your work decides something reusable, capture it
(status slice → SOP → canon) before you finish.

## SV Internal Hub registry

No `sv-app.json` was found in this repo as of 2026-08-10 — per its own
`sv-way.config.json`, this app is not yet hub-registered. If/when it is, add
one (schema: https://sv-internal-hub.vercel.app/register.md) in the same
commit as any change to scheduled jobs, data sources/destinations, hosting,
monitoring, known issues, or ownership.
