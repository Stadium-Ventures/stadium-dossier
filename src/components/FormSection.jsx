import { SECTIONS } from '../data/formConfig'
import FormField from './FormField'

export default function FormSection({ category, fields, formData, onChange, fieldErrors }) {
  const section = SECTIONS[category]
  const Icon = section.icon

  if (fields.length === 0) return null

  return (
    <fieldset className="mb-12 border-t border-gray-100 pt-12 border-0 p-0 m-0">
      <legend className="sr-only">{section.title} — {section.subtitle}</legend>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center" aria-hidden="true">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-black">{section.title}</h2>
          <p className="text-gray-500">{section.subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <FormField
              field={field}
              value={formData[field.id]}
              onChange={onChange}
              error={fieldErrors[field.id]}
            />
          </div>
        ))}
      </div>
    </fieldset>
  )
}
