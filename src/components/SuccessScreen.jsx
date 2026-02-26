import { CheckCircle } from 'lucide-react'

export default function SuccessScreen({ email }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-black mb-4">You're All Set!</h1>
        <p className="text-gray-500 text-lg mb-8">
          Your dossier has been submitted to the Stadium Ventures team.
          We'll be in touch soon to discuss your journey.
        </p>
        <p className="text-sm text-gray-400">
          A confirmation has been sent to {email || 'your email'}.
        </p>
      </div>
    </div>
  )
}
