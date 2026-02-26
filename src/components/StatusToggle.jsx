import { School, GraduationCap, Briefcase, ArrowRight } from 'lucide-react'

const statuses = [
  { id: 'highschool', label: 'High School', icon: School },
  { id: 'college', label: 'College', icon: GraduationCap },
  { id: 'pro', label: 'Professional', icon: Briefcase }
]

export default function StatusToggle({ status, setStatus }) {
  return (
    <div className="mb-12">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">Where are you in your journey?</h2>
        <p className="text-gray-500">Select your current status</p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        {statuses.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setStatus(id)}
            className={`group flex items-center justify-center gap-3 px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
              status === id
                ? 'border-black bg-black text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <Icon className={`w-5 h-5 ${status === id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
            <span className="font-semibold">{label}</span>
            {status === id && <ArrowRight className="w-4 h-4 ml-1" />}
          </button>
        ))}
      </div>
    </div>
  )
}
