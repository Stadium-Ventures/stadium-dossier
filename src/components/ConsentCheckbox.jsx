import { Shield } from 'lucide-react'
import { baseConsentText, medicalSharingConsentText } from '../data/consent'

function PrivacyLink() {
  return (
    <a
      href="/privacy.html"
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-black hover:text-gray-600"
    >
      Privacy Policy
    </a>
  )
}

export default function ConsentCheckbox({
  consent,
  onConsentChange,
  medicalSharingConsent,
  onMedicalSharingChange
}) {
  return (
    <div className="mb-12 border-t border-gray-100 pt-12 space-y-4">
      {/* Base consent — required */}
      <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
        <div className="flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="consent" className="block font-semibold text-black cursor-pointer">
            Data Consent <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-600 mt-1">{baseConsentText(false)}</p>
          <p className="text-sm text-gray-500 mt-2">
            Read our <PrivacyLink />.
          </p>
        </div>
        <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>

      {/* External-sharing consent — separate, optional opt-in */}
      <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
        <div className="flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            id="medical-sharing-consent"
            checked={medicalSharingConsent}
            onChange={(e) => onMedicalSharingChange(e.target.checked)}
            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="medical-sharing-consent" className="block font-semibold text-black cursor-pointer">
            Second-Opinion &amp; Advisory Sharing{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="text-sm text-gray-600 mt-1">{medicalSharingConsentText(false)}</p>
        </div>
        <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </div>
  )
}
