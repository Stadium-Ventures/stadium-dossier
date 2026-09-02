/* ============================================
   GENERATED — do not edit by hand
   ============================================
   Source of truth: src/data/formConfig.js
   Regenerate:  node scripts/gen-dossier-fields.mjs
   Drift guard: node scripts/gen-dossier-fields.mjs --check  (npm run check:fields)

   A serverless-safe projection of the form config: field id → section, with
   no lucide-react import. Used ONLY to bucket intake COMPLETENESS counts in
   api/registry-projection/[slug].js. No answer value is ever read through it.
*/

export const SECTION_ORDER = ["Biographical","Preferences","Schedule","Medical"];

export const FIELDS_BY_SECTION = {
  "Biographical": [
    "full_name",
    "preferred_name",
    "date_of_birth",
    "position",
    "secondary_position",
    "throws",
    "bats",
    "height",
    "weight",
    "email",
    "phone",
    "hometown",
    "parent1_name",
    "parent2_name",
    "parent_contact",
    "high_school",
    "hs_graduation_year",
    "travel_team",
    "college_commitment",
    "college_preferences",
    "college_name",
    "college_class",
    "eligibility_remaining",
    "transfer_status",
    "college_coach",
    "summer_league",
    "current_agent",
    "union_id",
    "current_organization",
    "current_level",
    "service_time",
    "contract_status"
  ],
  "Preferences": [
    "glove_brand",
    "bat_brand",
    "shoe_size",
    "cleat_preference",
    "jersey_size",
    "pants_size",
    "hat_size",
    "equipment_deals"
  ],
  "Schedule": [
    "training_facility_type",
    "current_facility",
    "has_strength_coach",
    "strength_coach",
    "has_private_coach",
    "pitching_coach",
    "training_frequency",
    "offseason_location",
    "has_mental_coach",
    "has_nutritionist"
  ],
  "Medical": [
    "injury_history",
    "medical_history",
    "current_health_status",
    "current_injuries",
    "has_pt",
    "allergies",
    "allergy_details"
  ]
};

/** Client-submitted medical fields. Counted, never projected. */
export const MEDICAL_FIELD_IDS = [
  "injury_history",
  "medical_history",
  "current_health_status",
  "current_injuries",
  "has_pt",
  "allergies",
  "allergy_details"
];

export const FOUR_PILLAR_LABELS = {
  "mental": "Mental",
  "physical": "Physical",
  "technique": "Technique",
  "nutrition": "Nutrition & Recovery"
};

/** field id → section name */
export const FIELD_SECTION = Object.freeze(
  Object.fromEntries(
    Object.entries(FIELDS_BY_SECTION).flatMap(([section, ids]) => ids.map((id) => [id, section])),
  ),
);
