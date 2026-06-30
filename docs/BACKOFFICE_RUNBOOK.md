# Back-office runbook — consent withdrawal, disclosures, minimal export

Until the authenticated back-office UI exists, these are run from the **Supabase SQL editor**
(Player Insights project): https://supabase.com/dashboard/project/jfcdasezpgjfqfqzsjat/sql/new

The functions are **service-role only** — they work in the dashboard SQL editor, but the public
form cannot call them. Find a submission's `id` in the Table editor (`dossier_submissions`).

---

## 1. Record a consent withdrawal

When a player/guardian withdraws (per Privacy Policy §6/§10):

```sql
select consent_withdrawn_at from public.withdraw_consent('<submission-id>');
```

Idempotent — a second call keeps the original withdrawal time. After this, `log_disclosure`
will refuse any further external sharing for that submission. (Withdrawal can't un-send what
was already sent — use the disclosure log below to know whom to ask to delete.)

## 2. See exactly what to share (minimization)

Before sharing for a consult, pull only the fields needed — not the whole dossier:

```sql
select public.dossier_minimal_export('<submission-id>', array['injury_history','medical_history','current_health_status','allergies']);
```

Returns the chosen fields plus `sharing_allowed` (true only if the athlete opted in AND has not
withdrawn). **If `sharing_allowed` is false, do not share.**

## 3. Log an external disclosure

Every time you share dossier/health info outside SV, record it. This **enforces** the policy:
it refuses unless the athlete opted in to external sharing and hasn't withdrawn.

```sql
select public.log_disclosure(
  '<submission-id>',
  'Dr. Jane Smith',              -- recipient_name
  'outside_physician',           -- recipient_type: advisory_board | outside_physician | ...
  'independent_recipient',       -- relationship: service_provider | independent_recipient
  array['injury_history','medical_history'],  -- fields_shared (match what you actually sent)
  'second opinion on UCL',       -- purpose
  'Tom Trudeau',                 -- shared_by (SV staff)
  'email',                       -- channel
  null                           -- notes
);
```

Review the log anytime:

```sql
select disclosed_at, recipient_name, recipient_relationship, fields_shared, shared_by, channel
from public.dossier_disclosures
where submission_id = '<submission-id>'
order by disclosed_at desc;
```

---

**Recipient relationship — which to pick?** Per the privacy decisions: standing advisory-board
members acting under their advisory agreement = `service_provider`; an outside physician giving an
independent second opinion = `independent_recipient`. (Pending legal's read on whether existing
agreements already settle this.)
