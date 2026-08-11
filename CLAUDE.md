# CLAUDE.md — stadium-dossier

This file was missing prior to 2026-08-10 (doc-gap sweep, part of the SV OS
governance audit). What this repo does is not restated here to avoid
inventing facts — read README.md first, and `sv-way.config.json` for this
repo's declared role. In short: a client-facing athlete-intake wizard
(bio/preferences/schedule/medical/Four Pillars/guardian consent) writing to
Supabase, insert-only.

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
