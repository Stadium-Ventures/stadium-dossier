import {
  User,
  Briefcase,
  Dumbbell,
  Heart,
  Settings,
  GraduationCap,
  School,
  Brain,
  Target,
  Apple,
  Zap
} from 'lucide-react'

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mykwonwn'

export const DEFAULT_FORM_CONFIG = [
  // THE BASICS - Biographical
  {
    id: 'full_name',
    label: 'Full Name',
    type: 'text',
    category: 'Biographical',
    audience: 'All',
    placeholder: 'Enter your full legal name',
    required: true
  },
  {
    id: 'preferred_name',
    label: 'Preferred Name / Nickname',
    type: 'text',
    category: 'Biographical',
    audience: 'All',
    placeholder: 'What should we call you?'
  },
  {
    id: 'date_of_birth',
    label: 'Date of Birth',
    type: 'date',
    category: 'Biographical',
    audience: 'All',
    required: true
  },
  {
    id: 'position',
    label: 'Primary Position',
    type: 'select',
    category: 'Biographical',
    audience: 'All',
    options: ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Designated Hitter', 'Utility'],
    required: true
  },
  {
    id: 'secondary_position',
    label: 'Secondary Position (if any)',
    type: 'select',
    category: 'Biographical',
    audience: 'All',
    options: ['None', 'Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Designated Hitter', 'Utility']
  },
  {
    id: 'throws',
    label: 'Throwing Hand',
    type: 'select',
    category: 'Biographical',
    audience: 'All',
    options: ['Right', 'Left', 'Ambidextrous'],
    required: true
  },
  {
    id: 'bats',
    label: 'Batting Side',
    type: 'select',
    category: 'Biographical',
    audience: 'All',
    options: ['Right', 'Left', 'Switch'],
    required: true
  },
  {
    id: 'height',
    label: 'Height',
    type: 'text',
    category: 'Biographical',
    audience: 'All',
    placeholder: "e.g., 6'2\""
  },
  {
    id: 'weight',
    label: 'Weight (lbs)',
    type: 'text',
    category: 'Biographical',
    audience: 'All',
    placeholder: 'e.g., 195'
  },
  {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    category: 'Biographical',
    audience: 'All',
    placeholder: 'your@email.com',
    required: true
  },
  {
    id: 'phone',
    label: 'Phone Number',
    type: 'tel',
    category: 'Biographical',
    audience: 'All',
    placeholder: '(555) 123-4567'
  },
  {
    id: 'hometown',
    label: 'Hometown',
    type: 'text',
    category: 'Biographical',
    audience: 'All',
    placeholder: 'City, State'
  },

  // HIGH SCHOOL specific fields
  {
    id: 'parents_names',
    label: "Parents' Names",
    type: 'text',
    category: 'Biographical',
    audience: 'HighSchool',
    placeholder: 'e.g., John & Jane Smith'
  },
  {
    id: 'parent_contact',
    label: 'Parent/Guardian Contact',
    type: 'text',
    category: 'Biographical',
    audience: 'HighSchool',
    placeholder: 'Phone or email'
  },
  {
    id: 'high_school',
    label: 'High School',
    type: 'text',
    category: 'Biographical',
    audience: 'HighSchool',
    placeholder: 'School name'
  },
  {
    id: 'hs_graduation_year',
    label: 'Expected Graduation Year',
    type: 'select',
    category: 'Biographical',
    audience: 'HighSchool',
    options: ['2026', '2027', '2028', '2029', '2030']
  },
  {
    id: 'travel_team',
    label: 'Travel Team / Club',
    type: 'text',
    category: 'Biographical',
    audience: 'HighSchool',
    placeholder: 'Current travel team name'
  },
  {
    id: 'college_commitment',
    label: 'College Commitment Status',
    type: 'select',
    category: 'Biographical',
    audience: 'HighSchool',
    options: ['Uncommitted', 'Verbal Commit', 'Signed NLI', 'Not pursuing college']
  },
  {
    id: 'college_preferences',
    label: 'Dream Schools',
    type: 'textarea',
    category: 'Biographical',
    audience: 'HighSchool',
    placeholder: "List any schools you're interested in..."
  },

  // COLLEGE specific fields
  {
    id: 'college_name',
    label: 'College / University',
    type: 'text',
    category: 'Biographical',
    audience: 'College',
    placeholder: 'School name'
  },
  {
    id: 'college_class',
    label: 'Class Year',
    type: 'select',
    category: 'Biographical',
    audience: 'College',
    options: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']
  },
  {
    id: 'eligibility_remaining',
    label: 'Eligibility Remaining',
    type: 'select',
    category: 'Biographical',
    audience: 'College',
    options: ['4 years', '3 years', '2 years', '1 year', 'Final year']
  },
  {
    id: 'transfer_status',
    label: 'Transfer Portal Status',
    type: 'select',
    category: 'Biographical',
    audience: 'College',
    options: ['Not in portal', 'Entered portal', 'Considering portal']
  },
  {
    id: 'college_coach',
    label: 'Head Coach',
    type: 'text',
    category: 'Biographical',
    audience: 'College',
    placeholder: "Coach's name"
  },
  {
    id: 'summer_league',
    label: 'Summer League',
    type: 'text',
    category: 'Biographical',
    audience: 'College',
    placeholder: 'e.g., Cape Cod League'
  },

  // PRO specific fields
  {
    id: 'current_agent',
    label: 'Current Agent/Rep',
    type: 'text',
    category: 'Biographical',
    audience: 'Pro',
    placeholder: 'If transitioning from another agency'
  },
  {
    id: 'union_id',
    label: 'MLBPA Union ID',
    type: 'text',
    category: 'Biographical',
    audience: 'Pro',
    placeholder: 'If applicable'
  },
  {
    id: 'current_organization',
    label: 'Current Organization',
    type: 'text',
    category: 'Biographical',
    audience: 'Pro',
    placeholder: 'Team / Organization name'
  },
  {
    id: 'current_level',
    label: 'Current Level',
    type: 'select',
    category: 'Biographical',
    audience: 'Pro',
    options: ['Rookie Ball', 'Single-A', 'High-A', 'Double-A', 'Triple-A', 'MLB', 'Free Agent', 'Independent']
  },
  {
    id: 'service_time',
    label: 'MLB Service Time',
    type: 'text',
    category: 'Biographical',
    audience: 'Pro',
    placeholder: 'e.g., 2.145 years'
  },
  {
    id: 'contract_status',
    label: 'Contract Status',
    type: 'select',
    category: 'Biographical',
    audience: 'Pro',
    options: ['Pre-Arbitration', 'Arbitration Eligible', 'Free Agent', 'Under Contract', 'Minor League Contract']
  },

  // THE SETUP - Equipment & Preferences
  {
    id: 'glove_brand',
    label: 'Preferred Glove Brand',
    type: 'select',
    category: 'Preferences',
    audience: 'All',
    options: ['Rawlings', 'Wilson', 'Mizuno', 'Easton', '44 Pro', 'Other', 'No Preference']
  },
  {
    id: 'bat_brand',
    label: 'Preferred Bat Brand',
    type: 'select',
    category: 'Preferences',
    audience: 'All',
    options: ['Louisville Slugger', 'Marucci', 'Victus', 'DeMarini', 'Easton', 'Other', 'No Preference']
  },
  {
    id: 'shoe_size',
    label: 'Shoe Size',
    type: 'text',
    category: 'Preferences',
    audience: 'All',
    placeholder: 'e.g., 11.5'
  },
  {
    id: 'cleat_preference',
    label: 'Cleat Brand Preference',
    type: 'select',
    category: 'Preferences',
    audience: 'All',
    options: ['Nike', 'New Balance', 'Under Armour', 'Adidas', 'Mizuno', 'Other', 'No Preference']
  },
  {
    id: 'jersey_size',
    label: 'Jersey Size',
    type: 'select',
    category: 'Preferences',
    audience: 'All',
    options: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'pants_size',
    label: 'Pants Size',
    type: 'text',
    category: 'Preferences',
    audience: 'All',
    placeholder: 'e.g., 32x32'
  },
  {
    id: 'hat_size',
    label: 'Hat Size',
    type: 'select',
    category: 'Preferences',
    audience: 'All',
    options: ['6 7/8', '7', '7 1/8', '7 1/4', '7 3/8', '7 1/2', '7 5/8', '7 3/4', '7 7/8', '8']
  },
  {
    id: 'equipment_deals',
    label: 'Current Equipment Deals',
    type: 'textarea',
    category: 'Preferences',
    audience: 'Pro',
    placeholder: 'List any existing endorsement or equipment arrangements...'
  },

  // THE GRIND - Schedule & Training
  {
    id: 'training_facility_type',
    label: 'Primary Training Environment',
    type: 'select',
    category: 'Schedule',
    audience: 'All',
    options: ['Team Facility', 'Private Training Center', 'College Facility', 'Home Gym', 'Public Gym', 'Multiple Locations']
  },
  {
    id: 'current_facility',
    label: 'Facility Name',
    type: 'text',
    category: 'Schedule',
    audience: 'All',
    placeholder: 'Name of your primary training facility'
  },
  {
    id: 'has_strength_coach',
    label: 'Working with a Strength Coach?',
    type: 'select',
    category: 'Schedule',
    audience: 'All',
    options: ['Yes - Private', 'Yes - Team Provided', 'No', 'Looking for one']
  },
  {
    id: 'strength_coach',
    label: 'Strength Coach Name',
    type: 'text',
    category: 'Schedule',
    audience: 'All',
    placeholder: 'Name (if applicable)',
    showWhen: { field: 'has_strength_coach', matches: ['Yes - Private', 'Yes - Team Provided'] }
  },
  {
    id: 'has_private_coach',
    label: 'Private Pitching/Hitting Coach?',
    type: 'select',
    category: 'Schedule',
    audience: 'All',
    options: ['Yes', 'No', 'Looking for one']
  },
  {
    id: 'pitching_coach',
    label: 'Coach Name',
    type: 'text',
    category: 'Schedule',
    audience: 'All',
    placeholder: 'Name (if applicable)',
    showWhen: { field: 'has_private_coach', matches: ['Yes'] }
  },
  {
    id: 'training_frequency',
    label: 'Training Days Per Week',
    type: 'select',
    category: 'Schedule',
    audience: 'All',
    options: ['3 days', '4 days', '5 days', '6 days', '7 days']
  },
  {
    id: 'offseason_location',
    label: 'Offseason Location',
    type: 'text',
    category: 'Schedule',
    audience: 'All',
    placeholder: 'City, State'
  },
  {
    id: 'has_mental_coach',
    label: 'Mental Performance Coach?',
    type: 'select',
    category: 'Schedule',
    audience: 'All',
    options: ['Yes', 'No', 'Interested']
  },
  {
    id: 'has_nutritionist',
    label: 'Working with a Nutritionist?',
    type: 'select',
    category: 'Schedule',
    audience: 'All',
    options: ['Yes', 'No', 'Interested']
  },

  // HEALTH - Medical
  {
    id: 'injury_history',
    label: 'Any Past Surgeries?',
    type: 'select',
    category: 'Medical',
    audience: 'All',
    options: ['No surgeries', 'Tommy John (UCL)', 'Shoulder surgery', 'Knee surgery', 'Back surgery', 'Other surgery']
  },
  {
    id: 'medical_history',
    label: 'Medical History Details',
    type: 'textarea',
    category: 'Medical',
    audience: 'All',
    placeholder: 'Please provide any additional details about injuries, surgeries, or medical conditions...',
    showWhen: { field: 'injury_history', matches: ['Tommy John (UCL)', 'Shoulder surgery', 'Knee surgery', 'Back surgery', 'Other surgery'] }
  },
  {
    id: 'current_health_status',
    label: 'Current Health Status',
    type: 'select',
    category: 'Medical',
    audience: 'All',
    options: ['100% healthy', 'Minor issue - playing through', 'Rehabbing injury', 'Recently cleared to play']
  },
  {
    id: 'current_injuries',
    label: 'Current Issues (if any)',
    type: 'text',
    category: 'Medical',
    audience: 'All',
    placeholder: 'Describe any current limitations',
    showWhen: { field: 'current_health_status', matches: ['Minor issue - playing through', 'Rehabbing injury', 'Recently cleared to play'] }
  },
  {
    id: 'has_pt',
    label: 'Working with PT/Athletic Trainer?',
    type: 'select',
    category: 'Medical',
    audience: 'All',
    options: ['Yes - regularly', 'Yes - as needed', 'No', 'Team provided only']
  },
  {
    id: 'allergies',
    label: 'Any Allergies?',
    type: 'select',
    category: 'Medical',
    audience: 'All',
    options: ['None', 'Food allergies', 'Medication allergies', 'Environmental', 'Multiple']
  },
  {
    id: 'allergy_details',
    label: 'Allergy Details',
    type: 'text',
    category: 'Medical',
    audience: 'All',
    placeholder: 'Please specify (if applicable)',
    showWhen: { field: 'allergies', matches: ['Food allergies', 'Medication allergies', 'Environmental', 'Multiple'] }
  }
]

export const FOUR_PILLARS = [
  {
    id: 'mental',
    label: 'Mental',
    description: 'Focus, confidence, game preparation',
    icon: Brain
  },
  {
    id: 'physical',
    label: 'Physical',
    description: 'Strength, speed, conditioning',
    icon: Zap
  },
  {
    id: 'technique',
    label: 'Technique',
    description: 'Mechanics, skill development',
    icon: Target
  },
  {
    id: 'nutrition',
    label: 'Nutrition & Recovery',
    description: 'Diet, sleep, body maintenance',
    icon: Apple
  }
]

export const SECTIONS = {
  Biographical: {
    title: 'The Basics',
    subtitle: "Let's start with who you are",
    icon: User
  },
  Preferences: {
    title: 'The Setup',
    subtitle: 'Your gear, your way',
    icon: Settings
  },
  Schedule: {
    title: 'The Grind',
    subtitle: 'Where the work happens',
    icon: Dumbbell
  },
  Medical: {
    title: 'Health',
    subtitle: 'Keeping you on the field',
    icon: Heart
  }
}
