import { Shield, Users } from 'lucide-react'
import { baseConsentText, medicalSharingConsentText } from '../data/consent'

const RELATIONSHIPS = ['Parent', 'Legal Guardian', 'Other']

export default function GuardianConsent({
  playerName,
  guardianName,
  guardianRelationship,
  onGuardianNameChange,
  onGuardianRelationshipChange,
  consent,
  onConsentChange,
  medicalSharingConsent,
  onMedicalSharingChange,
  errors = {}
}) {
  const who = playerName?.trim() || 'this athlete'

  return (
    <div className="mb-12 border-t border-gray-100 pt-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-black">Parent / Guardian Consent</h3>
          <p className="text-sm text-gray-500">
            Because {who} is under 18, a parent or legal guardian must review and consent.
          </p>
        </div>
      </div>

      <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Parent / Guardian Full Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={guardianName}
              onChange={(e) => onGuardianNameChange(e.target.value)}
              placeholder="Full name"
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white ${
                errors.guardianName
                  ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-200 focus:border-black focus:ring-1 focus:ring-black'
              }`}
            />
            {errors.guardianName && (
              <p className="text-red-500 text-sm">{errors.guardianName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Relationship to Athlete
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={guardianRelationship}
              onChange={(e) => onGuardianRelationshipChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border outline-none transition-all duration-200 text-gray-900 bg-white ${
                errors.guardianRelationship
                  ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-gray-200 focus:border-black focus:ring-1 focus:ring-black'
              }`}
            >
              <option value="">Select...</option>
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.guardianRelationship && (
              <p className="text-red-500 text-sm">{errors.guardianRelationship}</p>
            )}
          </div>
        </div>

        {/* Base consent — required */}
        <div className="flex items-start gap-4 pt-2">
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="guardian-consent"
              checked={consent}
              onChange={(e) => onConsentChange(e.target.checked)}
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="guardian-consent" className="block font-semibold text-black cursor-pointer">
              Data Consent <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-600 mt-1">{baseConsentText(true, who)}</p>
            <p className="text-sm text-gray-500 mt-2">
              Read our{' '}
              <a
                href="/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-black hover:text-gray-600"
              >
                Privacy Policy
              </a>.
            </p>
          </div>
          <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>

        {/* External-sharing consent — separate, optional opt-in */}
        <div className="flex items-start gap-4 pt-2 border-t border-gray-200">
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="guardian-medical-sharing-consent"
              checked={medicalSharingConsent}
              onChange={(e) => onMedicalSharingChange(e.target.checked)}
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="guardian-medical-sharing-consent" className="block font-semibold text-black cursor-pointer">
              Second-Opinion &amp; Advisory Sharing{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <p className="text-sm text-gray-600 mt-1">{medicalSharingConsentText(true, who)}</p>
          </div>
          <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
