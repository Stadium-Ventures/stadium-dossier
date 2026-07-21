import { useState, useCallback, useEffect } from 'react'
import { Send, ArrowRight, ArrowLeft, Shield, Loader2, Check } from 'lucide-react'
import { DEFAULT_FORM_CONFIG, FOUR_PILLARS, SECTIONS } from './data/formConfig'
import Toast from './components/Toast'
import StatusToggle from './components/StatusToggle'
import FourPillarsSection from './components/FourPillarsSection'
import FormSection from './components/FormSection'
import ConsentCheckbox from './components/ConsentCheckbox'
import GuardianConsent from './components/GuardianConsent'
import SuccessScreen from './components/SuccessScreen'
import { supabase, supabaseEnabled } from './lib/supabase'
import { CONSENT_POLICY_VERSION, MIN_AGE, buildConsentSnapshot, computeAgeFromDob, isMinorByAge, isUnderMinAge } from './data/consent'

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
  const [consentMedicalSharing, setConsentMedicalSharing] = useState(draft?.consentMedicalSharing || false)
  const [guardianName, setGuardianName] = useState(draft?.guardianName || '')
  const [guardianRelationship, setGuardianRelationship] = useState(draft?.guardianRelationship || '')
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  // Parent/guardian consent is required only when the athlete is actually
  // under 18 by date of birth — NOT merely because they're a high-schooler.
  // (A 19-yo HS senior self-consents; a 17-yo pro/college prospect still needs
  // a guardian.) Logic lives in consent.js so it's unit-tested.
  const ageFromDob = computeAgeFromDob(formData.date_of_birth)
  const isMinor = isMinorByAge(ageFromDob, playerStatus)

  // Auto-save draft to localStorage
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      playerStatus, formData, selectedPillars, consent, consentMedicalSharing, guardianName, guardianRelationship
    }))
  }, [playerStatus, formData, selectedPillars, consent, consentMedicalSharing, guardianName, guardianRelationship])

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
      const value = formData[f.id]
      if (f.required && !value) {
        errors[f.id] = 'This field is required'
      } else if (f.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[f.id] = 'Please enter a valid email address'
      }
    })

    // Hard age floor: the Dossier is for athletes 13+ (policy §5). Block here
    // so an under-13 can't proceed past The Basics.
    if (stepId === 'Biographical' && isUnderMinAge(ageFromDob)) {
      errors['date_of_birth'] = `Athletes must be at least ${MIN_AGE} years old to complete this form.`
    }

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

  const handleSubmit = async () => {
    // Backstop age floor in case someone reaches submit with an under-13 DOB
    // (e.g. edited after the step that blocks it).
    if (isUnderMinAge(ageFromDob)) {
      showToast(`Athletes must be at least ${MIN_AGE} years old to complete this form.`)
      return
    }

    // Minors require a parent/guardian to consent; everyone else self-consents.
    if (isMinor) {
      const errors = {}
      if (!guardianName.trim()) errors.guardianName = 'Required'
      if (!guardianRelationship) errors.guardianRelationship = 'Required'
      setFieldErrors(errors)
      if (Object.keys(errors).length > 0) {
        showToast('Parent/guardian name and relationship are required')
        return
      }
      if (!consent) {
        showToast('A parent or guardian must accept the consent')
        return
      }
    } else if (!consent) {
      showToast('Please accept the data sharing consent')
      return
    }

    if (!supabaseEnabled) {
      showToast('Submission is temporarily unavailable. Please try again later.')
      return
    }

    setIsSubmitting(true)

    const consentType = isMinor ? 'guardian' : 'self'
    const playerName = formData.full_name || 'New Player'

    // Collect every visible answer keyed by field id for the structured store.
    const answers = {}
    getVisibleFields().forEach((field) => {
      answers[field.id] = formData[field.id] || ''
    })

    // Snapshot the exact consent wording the user agreed to, so the record is
    // self-describing and auditable (MHMDA: provable, scoped consent).
    const consentTextSnapshot = buildConsentSnapshot({
      isMinor,
      who: playerName,
      medicalSharingConsent: consentMedicalSharing
    })

    // Supabase is the single system of record. A failed insert surfaces an
    // error so the player can retry — nothing is silently captured elsewhere.
    try {
      const { error } = await supabase.from('dossier_submissions').insert({
        player_type: playerStatus,
        full_name: playerName,
        email: formData.email || '',
        phone: formData.phone || '',
        four_pillars: selectedPillars,
        consent,
        consent_type: consentType,
        consent_policy_version: CONSENT_POLICY_VERSION,
        consent_medical_sharing: consentMedicalSharing,
        consent_timestamp: new Date().toISOString(),
        consent_text_snapshot: consentTextSnapshot,
        guardian_name: isMinor ? guardianName.trim() : null,
        guardian_relationship: isMinor ? guardianRelationship : null,
        form_data: answers
      })
      if (error) throw error
      localStorage.removeItem(DRAFT_KEY)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Supabase insert failed:', err)
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

          {isMinor ? (
            <GuardianConsent
              playerName={formData.full_name}
              guardianName={guardianName}
              guardianRelationship={guardianRelationship}
              onGuardianNameChange={setGuardianName}
              onGuardianRelationshipChange={setGuardianRelationship}
              consent={consent}
              onConsentChange={setConsent}
              medicalSharingConsent={consentMedicalSharing}
              onMedicalSharingChange={setConsentMedicalSharing}
              errors={fieldErrors}
            />
          ) : (
            <ConsentCheckbox
              consent={consent}
              onConsentChange={setConsent}
              medicalSharingConsent={consentMedicalSharing}
              onMedicalSharingChange={setConsentMedicalSharing}
            />
          )}
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
        <div className="text-center text-gray-400 text-sm pb-8 border-t border-gray-100 pt-8">
          <p className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Your information is secure and handled with care.
          </p>
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
