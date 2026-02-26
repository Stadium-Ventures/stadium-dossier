import { Shield } from 'lucide-react'

export default function ConsentCheckbox({ checked, onChange }) {
  return (
    <div className="mb-12 border-t border-gray-100 pt-12">
      <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
        <div className="flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            id="consent"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="consent" className="block font-semibold text-black cursor-pointer">
            Data Sharing Consent
          </label>
          <p className="text-sm text-gray-600 mt-1">
            I consent to sharing my health and performance data with Stadium Ventures for development purposes.
            This information will be handled in accordance with our privacy policy and used solely to support
            my athletic career.
          </p>
        </div>
        <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </div>
  )
}
