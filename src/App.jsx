import { useState, useCallback, useEffect } from 'react'
import { Send, ArrowRight, ArrowLeft, Shield, Loader2, Check } from 'lucide-react'
import { DEFAULT_FORM_CONFIG, FOUR_PILLARS, SECTIONS, FORMSPREE_ENDPOINT } from './data/formConfig'
import Toast from './components/Toast'
import StatusToggle from './components/StatusToggle'
import FourPillarsSection from './components/FourPillarsSection'
import FormSection from './components/FormSection'
import ConsentCheckbox from './components/ConsentCheckbox'
import SuccessScreen from './components/SuccessScreen'

const DRAFT_KEY = 'stadium-dossier-draft'

const STEPS = [
  { id: 'status', label: 'Status' },
  { id: 'Biographical', label: 'The Basics' },
  { id: 'Preferences', label: 'The Setup' },
  { id: 'Schedule', label: 'The Grind' },
  { id: 'Medical', label: 'Health' },
  { id: 'pillars', label: 'Four Pillars' },
  { id: 'review', label: 'Review & Submit' }
]

function ProgressBar({ currentStep, steps, onStepClick }) {
  return (
    <div className="mb-12">
      {/* Mobile: simple text indicator */}
      <div className="sm:hidden text-center mb-4">
        <span className="text-sm font-medium text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </span>
        <p className="text-lg font-bold text-black">{steps[currentStep].label}</p>
      </div>

      {/* Desktop: full progress bar */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => onStepClick(index)}
              disabled={index > currentStep}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-200 ${
                index < currentStep
                  ? 'bg-black text-white cursor-pointer'
                  : index === currentStep
                  ? 'bg-black text-white ring-4 ring-gray-200'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </button>
            <span className={`ml-2 text-xs font-medium hidden lg:inline ${
              index <= currentStep ? 'text-black' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 ${
                index < currentStep ? 'bg-black' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function loadDraft() {
  try {
    const saved = localStorage.getItem(DRAFT_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function App() {
  const draft = loadDraft()
  const [currentStep, setCurrentStep] = useState(0)
  const [playerStatus, setPlayerStatus] = useState(draft?.playerStatus || 'highschool')
  const [formData, setFormData] = useState(draft?.formData || {})
  const [selectedPillars, setSelectedPillars] = useState(draft?.selectedPillars || [])
  const [consent, setConsent] = useState(draft?.consent || false)
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  // Auto-save draft to localStorage
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      playerStatus, formData, selectedPillars, consent
    }))
  }, [playerStatus, formData, selectedPillars, consent])

  // Filter fields based on player status and conditional logic
  const getVisibleFields = useCallback(() => {
    return DEFAULT_FORM_CONFIG.filter((field) => {
      const audienceMatch =
        field.audience === 'All' ||
        (playerStatus === 'highschool' && field.audience === 'HighSchool') ||
        (playerStatus === 'college' && field.audience === 'College') ||
        (playerStatus === 'pro' && field.audience === 'Pro')
      if (!audienceMatch) return false

      if (field.showWhen) {
        const parentValue = formData[field.showWhen.field]
        if (!parentValue || !field.showWhen.matches.includes(parentValue)) return false
      }

      return true
    })
  }, [playerStatus, formData])

  // Group fields by category
  const getFieldsByCategory = useCallback(() => {
    const visible = getVisibleFields()
    const grouped = {
      Biographical: [],
      Preferences: [],
      Schedule: [],
      Medical: []
    }
    visible.forEach((field) => {
      if (grouped[field.category]) {
        grouped[field.category].push(field)
      }
    })
    return grouped
  }, [getVisibleFields])

  // Handle form field changes
  const handleFieldChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value
    }))
    if (fieldErrors[fieldId]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    }
  }

  const showToast = (message) => {
    setToast({ visible: true, message })
    setTimeout(() => {
      setToast({ visible: false, message: '' })
    }, 4000)
  }

  const getStatusLabel = () => {
    switch (playerStatus) {
      case 'highschool': return 'High School'
      case 'college': return 'College'
      case 'pro': return 'Professional'
      default: return playerStatus
    }
  }

  // Validate current step's required fields
  const validateCurrentStep = () => {
    const stepId = STEPS[currentStep].id
    const categories = ['Biographical', 'Preferences', 'Schedule', 'Medical']

    if (!categories.includes(stepId)) return true

    const visibleFields = getVisibleFields()
    const stepFields = visibleFields.filter((f) => f.category === stepId)
    const errors = {}
    stepFields.forEach((f) => {
      if (f.required && !formData[f.id]) {
        errors[f.id] = 'This field is required'
      }
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      const count = Object.keys(errors).length
      showToast(`${count} required field${count > 1 ? 's' : ''} need${count === 1 ? 's' : ''} attention`)
      const firstErrorId = stepFields.find((f) => errors[f.id])?.id
      if (firstErrorId) {
        document.getElementById(`field-${firstErrorId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return false
    }

    setFieldErrors({})
    return true
  }

  const handleNext = () => {
    if (!validateCurrentStep()) return
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setFieldErrors({})
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStepClick = (index) => {
    if (index < currentStep) {
      setFieldErrors({})
      setCurrentStep(index)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const generateSummary = () => {
    const visibleFields = getVisibleFields()
    let summary = '='.repeat(50) + '\n'
    summary += 'STADIUM VENTURES - PRE-ONBOARDING DOSSIER\n'
    summary += '='.repeat(50) + '\n\n'
    summary += `Player Type: ${getStatusLabel()}\n`
    summary += `Generated: ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}\n\n`

    const categories = ['Biographical', 'Preferences', 'Schedule', 'Medical']
    categories.forEach((category) => {
      const sectionFields = visibleFields.filter((f) => f.category === category)
      if (sectionFields.length === 0) return

      summary += `----- ${SECTIONS[category].title.toUpperCase()} -----\n`
      sectionFields.forEach((field) => {
        const value = formData[field.id] || '(not provided)'
        summary += `${field.label}: ${value}\n`
      })
      summary += '\n'
    })

    summary += `----- FOUR PILLARS (Areas for Support) -----\n`
    if (selectedPillars.length > 0) {
      selectedPillars.forEach((pillarId) => {
        const pillar = FOUR_PILLARS.find(p => p.id === pillarId)
        if (pillar) {
          summary += `- ${pillar.label}: ${pillar.description}\n`
        }
      })
    } else {
      summary += '(none selected)\n'
    }
    summary += '\n'

    summary += `Data Consent: ${consent ? 'YES - Agreed' : 'NO - Not agreed'}\n`

    return summary
  }

  const generateCSV = async () => {
    const { default: Papa } = await import('papaparse')
    const visibleFields = getVisibleFields()
    const csvData = {}

    csvData['_player_type'] = playerStatus
    csvData['_generated_date'] = new Date().toISOString()
    csvData['_consent_given'] = consent ? 'yes' : 'no'
    csvData['_four_pillars'] = selectedPillars.join(';')

    visibleFields.forEach((field) => {
      csvData[field.id] = formData[field.id] || ''
    })

    return Papa.unparse([csvData])
  }

  const handleSubmit = async () => {
    if (!consent) {
      showToast('Please accept the data sharing consent')
      return
    }

    setIsSubmitting(true)

    const summary = generateSummary()
    const csv = await generateCSV()
    const playerName = formData.full_name || 'New Player'

    const submissionData = {
      _subject: `New Onboarding Dossier: ${playerName}`,
      player_name: playerName,
      player_type: getStatusLabel(),
      email: formData.email || '',
      phone: formData.phone || '',
      four_pillars: selectedPillars.map(id => {
        const pillar = FOUR_PILLARS.find(p => p.id === id)
        return pillar ? pillar.label : id
      }).join(', ') || 'None selected',
      dossier_summary: summary,
      csv_data: csv
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submissionData)
      })

      if (response.ok) {
        localStorage.removeItem(DRAFT_KEY)
        setIsSubmitted(true)
      } else {
        throw new Error('Submission failed')
      }
    } catch (err) {
      console.error('Submission error:', err)
      showToast('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldsByCategory = getFieldsByCategory()
  const stepId = STEPS[currentStep].id
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === STEPS.length - 1

  if (isSubmitted) {
    return <SuccessScreen email={formData.email} />
  }

  // Render current step content
  const renderStepContent = () => {
    if (stepId === 'status') {
      return <StatusToggle status={playerStatus} setStatus={setPlayerStatus} />
    }

    if (stepId === 'pillars') {
      return <FourPillarsSection selected={selectedPillars} onChange={setSelectedPillars} />
    }

    if (stepId === 'review') {
      return (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-2">Review & Submit</h2>
            <p className="text-gray-500">Review your information before submitting.</p>
          </div>

          {/* Summary cards */}
          <div className="space-y-6 mb-8">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-black mb-3">Player Status</h3>
              <p className="text-gray-700">{getStatusLabel()}</p>
            </div>

            {Object.entries(fieldsByCategory).map(([category, fields]) => {
              if (fields.length === 0) return null
              const section = SECTIONS[category]
              return (
                <div key={category} className="p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-black">{section.title}</h3>
                    <button
                      onClick={() => {
                        const stepIndex = STEPS.findIndex(s => s.id === category)
                        if (stepIndex >= 0) {
                          setCurrentStep(stepIndex)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                      }}
                      className="text-sm text-gray-500 hover:text-black transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {fields.map((field) => (
                      <div key={field.id}>
                        <span className="text-sm text-gray-500">{field.label}</span>
                        <p className="text-gray-900 font-medium">
                          {formData[field.id] || <span className="text-gray-300 font-normal">—</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-black mb-3">Four Pillars</h3>
              {selectedPillars.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedPillars.map((id) => {
                    const pillar = FOUR_PILLARS.find(p => p.id === id)
                    return pillar ? (
                      <span key={id} className="px-3 py-1 bg-black text-white text-sm rounded-full">
                        {pillar.label}
                      </span>
                    ) : null
                  })}
                </div>
              ) : (
                <p className="text-gray-400">None selected</p>
              )}
            </div>
          </div>

          <ConsentCheckbox checked={consent} onChange={setConsent} />
        </>
      )
    }

    // Form category steps
    const fields = fieldsByCategory[stepId] || []
    return (
      <FormSection
        category={stepId}
        fields={fields}
        formData={formData}
        onChange={handleFieldChange}
        fieldErrors={fieldErrors}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-black tracking-tight">Stadium Ventures</h1>
            <span className="text-sm text-gray-500">Pre-Onboarding Dossier</span>
          </div>
        </div>
      </header>

      {/* Hero Section - only on first step */}
      {isFirstStep && (
        <div className="border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6 leading-tight">
              A Higher Standard<br />Starts Here
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl">
              Welcome to Stadium Ventures. This dossier helps us understand who you are,
              so we can build a plan that fits your journey.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <ProgressBar
          currentStep={currentStep}
          steps={STEPS}
          onStepClick={handleStepClick}
        />

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-8 pb-12">
          {!isFirstStep ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-400 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="group bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 flex items-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Dossier
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="group bg-black hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 flex items-center gap-3"
            >
              Continue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm pb-8 border-t border-gray-100 pt-8 space-y-2">
          <p className="flex items-center justify-center gap-2 text-gray-400">
            <Shield className="w-4 h-4" />
            Your information is secure and handled with care.
          </p>
          <a
            href="https://sv-travel-hub.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-gray-300 hover:text-gray-500 transition-colors"
          >
            Travel Hub
          </a>
        </div>
      </main>

      <Toast
        message={toast.message}
        isVisible={toast.visible}
      />
    </div>
  )
}

export default App
