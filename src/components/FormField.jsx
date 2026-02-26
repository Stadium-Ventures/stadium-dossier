export default function FormField({ field, value, onChange, error }) {
  const baseClasses = "w-full px-4 py-3 rounded-lg border outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
  const inputClasses = error
    ? `${baseClasses} border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500`
    : `${baseClasses} border-gray-200 focus:border-black focus:ring-1 focus:ring-black`

  return (
    <div className="space-y-2" id={`field-${field.id}`}>
      <label className="block text-sm font-semibold text-gray-900">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === 'text' && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          className={inputClasses}
        />
      )}

      {field.type === 'date' && (
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={inputClasses}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${inputClasses} resize-none`}
        />
      )}

      {field.type === 'select' && (
        <select
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={inputClasses}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
