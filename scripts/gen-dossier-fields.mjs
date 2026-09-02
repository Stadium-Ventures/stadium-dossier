#!/usr/bin/env node
/**
 * Generates (and, with --check, verifies) api/_lib/dossier-fields.js — the
 * serverless-safe field → section map the registry projection door
 * (api/registry-projection/[slug].js) uses to bucket intake completeness.
 *
 * WHY A GENERATED COPY AT ALL: src/data/formConfig.js imports lucide-react
 * icon components, which a Vercel Node function has no business pulling in
 * just to learn which section a field id belongs to. The alternative — a
 * hand-kept second copy of the field list — is exactly the "forked dataset"
 * THE-SV-WAY.md warns about, so this generator plus the --check drift guard
 * is the price of the copy. formConfig.js stays the single source of truth.
 *
 *   node scripts/gen-dossier-fields.mjs           # rewrite the generated file
 *   node scripts/gen-dossier-fields.mjs --check    # exit 1 if it has drifted
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { DEFAULT_FORM_CONFIG, FOUR_PILLARS } from '../src/data/formConfig.js';

const OUT = new URL('../api/_lib/dossier-fields.js', import.meta.url);

const bySection = {};
for (const f of DEFAULT_FORM_CONFIG) {
  if (!f || !f.id || !f.category) continue;
  (bySection[f.category] ||= []).push(f.id);
}
// Medical field ids are listed so the projection door can PROVE it never
// projects their values — it counts them and nothing else.
const medical = bySection.Medical || [];

const body = `/* ============================================
   GENERATED — do not edit by hand
   ============================================
   Source of truth: src/data/formConfig.js
   Regenerate:  node scripts/gen-dossier-fields.mjs
   Drift guard: node scripts/gen-dossier-fields.mjs --check  (npm run check:fields)

   A serverless-safe projection of the form config: field id → section, with
   no lucide-react import. Used ONLY to bucket intake COMPLETENESS counts in
   api/registry-projection/[slug].js. No answer value is ever read through it.
*/

export const SECTION_ORDER = ${JSON.stringify(Object.keys(bySection))};

export const FIELDS_BY_SECTION = ${JSON.stringify(bySection, null, 2)};

/** Client-submitted medical fields. Counted, never projected. */
export const MEDICAL_FIELD_IDS = ${JSON.stringify(medical, null, 2)};

export const FOUR_PILLAR_LABELS = ${JSON.stringify(
  Object.fromEntries(FOUR_PILLARS.map((p) => [p.id, p.label])),
  null,
  2,
)};

/** field id → section name */
export const FIELD_SECTION = Object.freeze(
  Object.fromEntries(
    Object.entries(FIELDS_BY_SECTION).flatMap(([section, ids]) => ids.map((id) => [id, section])),
  ),
);
`;

if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(OUT, 'utf8'); } catch { /* missing counts as drift */ }
  if (current !== body) {
    console.error('dossier-fields drift: api/_lib/dossier-fields.js is out of date with src/data/formConfig.js');
    console.error('run: node scripts/gen-dossier-fields.mjs');
    process.exit(1);
  }
  console.log(`dossier-fields: in sync (${Object.keys(bySection).length} sections, ${DEFAULT_FORM_CONFIG.length} fields)`);
} else {
  writeFileSync(OUT, body);
  console.log(`wrote api/_lib/dossier-fields.js (${Object.keys(bySection).length} sections, ${DEFAULT_FORM_CONFIG.length} fields)`);
}
