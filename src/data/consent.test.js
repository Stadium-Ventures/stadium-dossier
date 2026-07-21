import { describe, it, expect } from 'vitest'
import {
  CONSENT_POLICY_VERSION,
  MIN_AGE,
  baseConsentText,
  medicalSharingConsentText,
  buildConsentSnapshot,
  computeAgeFromDob,
  isMinorByAge,
  isUnderMinAge
} from './consent'

// A fixed "today" so age math is deterministic regardless of when tests run.
const NOW = new Date('2026-06-30T12:00:00Z')

describe('constants', () => {
  it('exposes a policy version and a min age of 13', () => {
    expect(CONSENT_POLICY_VERSION).toBeTruthy()
    expect(MIN_AGE).toBe(13)
  })
})

describe('computeAgeFromDob', () => {
  it('returns null for missing/blank/unparseable input', () => {
    expect(computeAgeFromDob('', NOW)).toBeNull()
    expect(computeAgeFromDob(null, NOW)).toBeNull()
    expect(computeAgeFromDob(undefined, NOW)).toBeNull()
    expect(computeAgeFromDob('not-a-date', NOW)).toBeNull()
  })

  it('computes whole-year age from YYYY-MM-DD', () => {
    expect(computeAgeFromDob('2000-06-30', NOW)).toBe(26)
    expect(computeAgeFromDob('2006-01-01', NOW)).toBe(20)
  })

  it('handles the birthday boundary correctly', () => {
    // birthday is today -> counts as having turned that age
    expect(computeAgeFromDob('2008-06-30', NOW)).toBe(18)
    // birthday tomorrow -> still one year younger
    expect(computeAgeFromDob('2008-07-01', NOW)).toBe(17)
    // birthday yesterday -> already had it
    expect(computeAgeFromDob('2008-06-29', NOW)).toBe(18)
  })

  it('is timezone-safe (no off-by-one near midnight)', () => {
    // Parsed directly from the string, not via UTC Date, so a same-day DOB
    // is exactly 0 regardless of the runner's timezone.
    expect(computeAgeFromDob('2026-06-30', NOW)).toBe(0)
  })

  it('handles a Feb-29 birthday in a non-leap year', () => {
    const nowNonLeap = new Date('2027-03-01T12:00:00Z')
    expect(computeAgeFromDob('2012-02-29', nowNonLeap)).toBe(15)
  })
})

describe('isMinorByAge', () => {
  it('treats under-18 as a minor by actual age', () => {
    expect(isMinorByAge(17, 'pro')).toBe(true)
    expect(isMinorByAge(18, 'highschool')).toBe(false)
    expect(isMinorByAge(19, 'highschool')).toBe(false) // 19yo HS senior self-consents
  })

  it('falls back to the HS heuristic only when age is unknown', () => {
    expect(isMinorByAge(null, 'highschool')).toBe(true)
    expect(isMinorByAge(null, 'college')).toBe(false)
    expect(isMinorByAge(null, 'pro')).toBe(false)
  })
})

describe('isUnderMinAge (the <13 block)', () => {
  it('blocks under 13 and allows 13+', () => {
    expect(isUnderMinAge(12)).toBe(true)
    expect(isUnderMinAge(13)).toBe(false)
    expect(isUnderMinAge(17)).toBe(false)
  })
  it('does not block when age is unknown (DOB required separately)', () => {
    expect(isUnderMinAge(null)).toBe(false)
  })
})

describe('consent copy', () => {
  it('self base consent is first-person and names the policy', () => {
    const t = baseConsentText(false)
    expect(t).toMatch(/I consent to Stadium Ventures/)
    expect(t).toMatch(/Privacy Policy/)
  })

  it('guardian base consent names the athlete', () => {
    const t = baseConsentText(true, 'Jordan Smith')
    expect(t).toMatch(/parent or legal guardian of Jordan Smith/)
    expect(t).toMatch(/Jordan Smith's/)
  })

  it('external-sharing consent mentions second opinions, advisory board, and withdrawal', () => {
    const t = medicalSharingConsentText(false)
    expect(t).toMatch(/advisory board/i)
    expect(t).toMatch(/second opinion/i)
    expect(t).toMatch(/withdraw this consent at any time/i)
  })
})

describe('buildConsentSnapshot', () => {
  it('includes only the base consent when sharing is not opted in', () => {
    const snap = buildConsentSnapshot({ isMinor: false, who: 'Me', medicalSharingConsent: false })
    expect(snap).toContain('I consent to Stadium Ventures')
    expect(snap).not.toMatch(/advisory board/i)
  })

  it('appends the sharing consent when opted in', () => {
    const snap = buildConsentSnapshot({ isMinor: false, who: 'Me', medicalSharingConsent: true })
    expect(snap).toMatch(/advisory board/i)
    // two blocks joined
    expect(snap.split('\n\n').length).toBe(2)
  })

  it('uses guardian wording for minors', () => {
    const snap = buildConsentSnapshot({ isMinor: true, who: 'Jordan Smith', medicalSharingConsent: true })
    expect(snap).toMatch(/parent or legal guardian of Jordan Smith/)
    expect(snap).toMatch(/Jordan Smith's/)
  })
})
