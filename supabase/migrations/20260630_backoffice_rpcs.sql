-- Back-office RPCs — operationalize consent withdrawal + disclosure logging.
-- SERVICE-ROLE ONLY (no anon/public execute). Callable from the Supabase
-- dashboard SQL editor today, and from a future authenticated back-office.
-- These make the Privacy Policy's promises (withdraw consent, log disclosures,
-- minimize what we share) executable instead of hand-edited SQL.

-- Record a consent withdrawal. Idempotent — keeps the earliest withdrawal time.
create or replace function public.withdraw_consent(p_submission_id uuid)
returns public.dossier_submissions
language plpgsql security definer set search_path = public as $$
declare r public.dossier_submissions;
begin
  update public.dossier_submissions
     set consent_withdrawn_at = coalesce(consent_withdrawn_at, now())
   where id = p_submission_id
   returning * into r;
  if not found then raise exception 'submission % not found', p_submission_id; end if;
  return r;
end $$;

-- Log one external disclosure. REFUSES unless the athlete opted in to external
-- sharing and has not withdrawn — so the policy rule is enforced, not just noted.
create or replace function public.log_disclosure(
  p_submission_id uuid,
  p_recipient_name text,
  p_recipient_type text default null,
  p_recipient_relationship text default null,
  p_fields_shared text[] default '{}',
  p_purpose text default null,
  p_shared_by text default null,
  p_channel text default null,
  p_notes text default null
) returns public.dossier_disclosures
language plpgsql security definer set search_path = public as $$
declare s public.dossier_submissions; d public.dossier_disclosures;
begin
  select * into s from public.dossier_submissions where id = p_submission_id;
  if not found then raise exception 'submission % not found', p_submission_id; end if;
  if not s.consent_medical_sharing then
    raise exception 'submission % did not opt in to external sharing (consent_medical_sharing=false)', p_submission_id;
  end if;
  if s.consent_withdrawn_at is not null then
    raise exception 'submission % consent withdrawn at %; external sharing not permitted', p_submission_id, s.consent_withdrawn_at;
  end if;
  insert into public.dossier_disclosures(
    submission_id, recipient_name, recipient_type, recipient_relationship,
    fields_shared, purpose, shared_by, channel, notes)
  values (
    p_submission_id, p_recipient_name, p_recipient_type, p_recipient_relationship,
    coalesce(p_fields_shared, '{}'), p_purpose, p_shared_by, p_channel, p_notes)
  returning * into d;
  return d;
end $$;

-- Minimization helper: return ONLY the requested fields for a submission, plus a
-- flag showing whether external sharing is currently allowed. Lets staff pull the
-- exact subset to share for a consult rather than the whole dossier.
create or replace function public.dossier_minimal_export(p_submission_id uuid, p_fields text[])
returns jsonb
language plpgsql security definer set search_path = public as $$
declare s public.dossier_submissions; result jsonb;
begin
  select * into s from public.dossier_submissions where id = p_submission_id;
  if not found then raise exception 'submission % not found', p_submission_id; end if;
  select jsonb_build_object(
    'submission_id', s.id,
    'full_name', s.full_name,
    'player_type', s.player_type,
    'sharing_allowed', (s.consent_medical_sharing and s.consent_withdrawn_at is null),
    'fields', coalesce((
       select jsonb_object_agg(k, s.form_data -> k) from unnest(p_fields) as k
    ), '{}'::jsonb)
  ) into result;
  return result;
end $$;

-- Lock execution to service_role only.
revoke all on function public.withdraw_consent(uuid) from public, anon;
revoke all on function public.log_disclosure(uuid,text,text,text,text[],text,text,text,text) from public, anon;
revoke all on function public.dossier_minimal_export(uuid, text[]) from public, anon;
grant execute on function public.withdraw_consent(uuid) to service_role;
grant execute on function public.log_disclosure(uuid,text,text,text,text[],text,text,text,text) to service_role;
grant execute on function public.dossier_minimal_export(uuid, text[]) to service_role;
