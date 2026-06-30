-- Player Dossier — consent record + disclosure log
-- Supports the expanded Privacy Policy (medical/advisory sharing under MHMDA).
-- Additive only: no existing column or row is modified destructively.

-- 1. Auditable, scoped, versioned consent on each submission.
alter table public.dossier_submissions
  add column if not exists consent_policy_version  text,
  add column if not exists consent_medical_sharing boolean not null default false,
  add column if not exists consent_timestamp        timestamptz,
  add column if not exists consent_text_snapshot     text,
  -- Withdrawal is an ops action (handled by SV staff via the dashboard / a
  -- back-office tool), but the record needs a home so sharing can be gated on it.
  add column if not exists consent_withdrawn_at      timestamptz;

comment on column public.dossier_submissions.consent_medical_sharing is
  'Separate OPT-IN consent for sharing with outside medical/advisory professionals (second opinions). Base consent is the `consent` column.';
comment on column public.dossier_submissions.consent_text_snapshot is
  'Exact consent wording the user agreed to at submit time — provable consent.';
comment on column public.dossier_submissions.consent_withdrawn_at is
  'Set when consent is withdrawn. External sharing must be gated on this being null.';

-- 2. Disclosure log — one row per external share, for minimization evidence
--    and to honor withdrawal (who we shared with, so we can ask them to delete).
create table if not exists public.dossier_disclosures (
  id                     uuid primary key default gen_random_uuid(),
  submission_id          uuid not null references public.dossier_submissions(id) on delete cascade,
  disclosed_at           timestamptz not null default now(),
  recipient_name         text not null,
  recipient_type         text,            -- e.g. 'advisory_board' | 'outside_physician'
  recipient_relationship text,            -- 'service_provider' | 'independent_recipient'
  fields_shared          text[] not null default '{}',  -- minimization: exactly what left
  purpose                text,
  shared_by              text,            -- SV staff member who sent it
  channel                text,            -- e.g. 'email'
  notes                  text
);

comment on table public.dossier_disclosures is
  'Audit log of each external disclosure of dossier/health data. Service-role / dashboard only — no anon access.';

-- RLS on, with NO anon policy: the public client can neither read nor write
-- this log. Only the service role (dashboard / back office) touches it.
alter table public.dossier_disclosures enable row level security;
