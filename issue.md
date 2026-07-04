# Risk model is median-imputing 5 of its 20 inputs

**Labels:** `ml`, `bug`, `enhancement`

## Summary
The risk-assessment RandomForest (`apps/ml-model`) expects **20 features**, but
the app only supplies **15**. The 5 missing columns are left blank, so the
pipeline's `SimpleImputer(strategy='median')` fills each with a fixed global
median on every prediction — the same guess regardless of the actual session or
patient. The model is effectively scoring on fabricated inputs.

## Missing features
| Feature | Current state |
|---|---|
| `ultrafiltration_rate_ml_hr` | NaN → median (but derivable from existing fields) |
| `transmembrane_pressure_mmhg` | NaN → median (never captured) |
| `membrane_flux_kuf` | NaN → median (never captured) |
| `protein_intake_g` | NaN → median (never captured) |
| `calorie_intake_kcal` | NaN → median (never captured) |

Because `membrane_flux_kuf` is missing, the engineered feature `crp_to_flux` is
**also permanently `NaN`**, so two of the model's columns are dead.

## Expected
Every model input is either captured from the operator or legitimately derived,
so predictions vary with real data. Median imputation remains only as a fallback
for genuinely blank fields.

## Proposed fix
- **Derive** `ultrafiltration_rate_ml_hr` = `total_uf_volume_ml / session_duration_hr`
  (no UI change).
- **Capture** 4 new per-session fields: `transmembranePressure`, `membraneFlux`
  (KUf), `proteinIntake`, `calorieIntake` — wired through the Add/Edit session
  forms → backend payload → `prediction_service._build_feature_frame` and the
  stored session doc. Fixing `membraneFlux` also repairs `crp_to_flux`.

No retraining required — `features.pkl` order is unchanged; we only fill columns
that were previously NaN.

## Affected files
- `apps/backend/services/prediction_service.py` (`_build_feature_frame`)
- `apps/backend/services/patient_service.py` (`create_session`, `update_session`)
- `apps/frontend/src/components/admin/AddSessionDialog.jsx`
- `apps/frontend/src/components/admin/EditSessionDialog.jsx`
- `apps/frontend/src/components/admin/SessionAccordion.jsx` (display)
