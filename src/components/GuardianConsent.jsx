import { Shield, Users } from 'lucide-react'

const RELATIONSHIPS = ['Parent', 'Legal Guardian', 'Other']

export default function GuardianConsent({
  playerName,
  guardianName,
  guardianRelationship,
  onGuardianNameChange,
  onGuardianRelationshipChange,
  checked,
  onChange,
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

        <div className="flex items-start gap-4 pt-2">
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="guardian-consent"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="guardian-consent" className="block font-semibold text-black cursor-pointer">
              I am the parent or legal guardian of {who}.
            </label>
            <p className="text-sm text-gray-600 mt-1">
              I consent to sharing this athlete&apos;s health and performance data with Stadium Ventures
              for development purposes. This information will be handled in accordance with our{' '}
              <a
                href="/privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-black hover:text-gray-600"
              >
                privacy policy
              </a>{' '}
              and used solely to support the athlete&apos;s career.
            </p>
          </div>
          <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
