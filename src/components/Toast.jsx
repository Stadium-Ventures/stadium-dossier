import { Check } from 'lucide-react'

export default function Toast({ message, isVisible }) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {isVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast-enter">
          <div className="bg-black text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400" />
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}
    </div>
  )
}
