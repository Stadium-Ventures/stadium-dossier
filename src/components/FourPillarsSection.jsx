import { Check } from 'lucide-react'
import { FOUR_PILLARS } from '../data/formConfig'

export default function FourPillarsSection({ selected, onChange }) {
  return (
    <div className="mb-12 border-t border-gray-100 pt-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-black mb-2">The Four Pillars</h2>
        <p className="text-gray-500">Where do you feel you need the most support? Select all that apply.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="group" aria-label="Four Pillars - select areas where you need support">
        {FOUR_PILLARS.map(({ id, label, description, icon: Icon }) => {
          const isSelected = selected.includes(id)
          return (
            <button
              key={id}
              aria-pressed={isSelected}
              onClick={() => {
                if (isSelected) {
                  onChange(selected.filter(s => s !== id))
                } else {
                  onChange([...selected, id])
                }
              }}
              className={`group p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                isSelected ? 'bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'
              }`}>
                <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-black'}`}>
                {label}
              </h3>
              <p className={`text-sm ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                {description}
              </p>
              {isSelected && (
                <div className="mt-3 flex items-center gap-1 text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Selected
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
