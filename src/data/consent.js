// Single source of truth for consent. The same strings are rendered in the
// consent UI AND snapshotted into the submission record, so the audit trail
// proves exactly what the athlete (or guardian) agreed to.
//
// Bump CONSENT_POLICY_VERSION whenever the consent wording or the privacy
// policy materially changes, so old records remain tied to the text in force
// when they were signed.

export const CONSENT_POLICY_VERSION = '2026-06-30'

// Minimum age to use the Dossier at all. Below this we block submission
// entirely (policy §5 — we do not knowingly collect data from under-13s).
export const MIN_AGE = 13

// Base consent — REQUIRED to use the service. Covers SV's own collection and
// use of the information to support the athlete's development.
export function baseConsentText(isMinor, who = 'this athlete') {
  return isMinor
    ? `I am the parent or legal guardian of ${who}. I consent to Stadium Ventures collecting and using ${who}'s health and performance information to support their athletic development, as described in the Stadium Ventures Privacy Policy.`
    : `I consent to Stadium Ventures collecting and using my health and performance information to support my athletic development, as described in the Stadium Ventures Privacy Policy.`
}

// External-sharing consent — SEPARATE and OPTIONAL (opt-in). Authorizes sharing
// with outside medical / performance / advisory professionals for second
// opinions and consultation. Kept distinct from the base consent so it is
// granular and freely given (the MHMDA bar), not bundled into "use the form."
export function medicalSharingConsentText(isMinor, who = 'this athlete') {
  const subject = isMinor ? `${who}'s` : 'my'
  const their = isMinor ? 'their' : 'my'
  return `I also consent to Stadium Ventures sharing ${subject} relevant health and development information with medical, performance, and advisory professionals — including members of the Stadium Ventures advisory board and outside physicians who provide independent second opinions — so they can evaluate and advise on ${their} development and care. I understand this may be shared by email or other means, that I can withdraw this consent at any time, and that withdrawal does not undo sharing that has already happened.`
}

// Assemble the exact text the user agreed to, for the audit snapshot.
export function buildConsentSnapshot({ isMinor, who, medicalSharingConsent }) {
  const lines = [baseConsentText(isMinor, who)]
  if (medicalSharingConsent) lines.push(medicalSharingConsentText(isMinor, who))
  return lines.join('\n\n')
}

// --- Age logic (extracted so the privacy-critical path is unit-tested) ---

// Whole-years age from a date-of-birth string. Parses YYYY-MM-DD directly
// (timezone-safe — the date input always emits that format); falls back to
// Date parsing for anything else. Returns null if missing/unparseable.
export function computeAgeFromDob(dobStr, now = new Date()) {
  if (!dobStr) return null
  let by, bm, bd
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dobStr)
  if (m) {
    by = Number(m[1]); bm = Number(m[2]); bd = Number(m[3])
  } else {
    const d = new Date(dobStr)
    if (isNaN(d.getTime())) return null
    by = d.getFullYear(); bm = d.getMonth() + 1; bd = d.getDate()
  }
  let age = now.getFullYear() - by
  const curMonth = now.getMonth() + 1
  if (curMonth < bm || (curMonth === bm && now.getDate() < bd)) age--
  return age
}

// Under 18 ⇒ a parent/guardian must consent. Falls back to the high-school
// heuristic only when DOB is missing/unparseable.
export function isMinorByAge(age, playerStatus) {
  return age != null ? age < 18 : playerStatus === 'highschool'
}

// Under MIN_AGE (13) ⇒ submission blocked entirely (policy §5).
export function isUnderMinAge(age) {
  return age != null && age < MIN_AGE
}
