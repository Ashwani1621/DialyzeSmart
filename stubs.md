# DialyzeSmart — Remaining Stubs

This document catalogues the parts of DialyzeSmart that are **deliberately stubbed,
faked, or deferred** so the app works end-to-end in *development mode*. The three
role portals (admin / doctor / patient) are fully clickable and data-backed; the
items below are what still stands between the current dev build and a genuinely
*complete / production* build.

Each section lists: **what's stubbed**, **current behaviour**, **what "real" needs**,
and the **clean seam** — the exact file/function to change so the swap is contained.

> **Update (2026-07-01):** item **1 (Real ML risk prediction)** has since been
> implemented and is retained below as a ✅ record of what was done. Items 2–7 are
> the genuinely-open work.

## Contents

1. [Real ML risk prediction](#1-real-ml-risk-prediction) — ✅ done (in-process)
2. [Backend authentication & authorization](#2-backend-authentication--authorization) — flagship remaining
3. [Notifications](#3-notifications)
4. [Global search](#4-global-search)
5. [Profile editing](#5-profile-editing)
6. [Secrets & config hygiene](#6-secrets--config-hygiene)
7. [Housekeeping stubs](#7-housekeeping-stubs)
8. [Priority summary](#priority-summary)

---

## 1. Real ML risk prediction

**Status: ✅ DONE — shipped on `prod`.** The trained Random Forest now drives
per-session risk; the heuristic only survives as a fallback.

**What shipped.** `apps/backend/services/prediction_service.py` loads
`rf_balanced_model.pkl` + `features.pkl` **once at import** (in-process; path via
`MODEL_DIR`, default `apps/ml-model/src`) and computes `riskLevel` / `riskScore`
(from `predict_proba`) / `predictedAlbuminLoss` / `recommendation` for every
session create/update. On any load/predict failure it falls back to the original
deterministic heuristic, so dev is never blocked. Specifically completed:

- **Model wired in-process** — `predict_session_risk(session_data, patient_data)`
  builds the 20-feature row and calls the pipeline.
- **Inputs captured** — comorbidity flags (`diabetes`, `hypertension`,
  `cardiovascular_disease`) added to the patient forms; `phosphorus` and `crp`
  added to the session forms.
- **Field-name / unit reconciliation** — `hemoglobin→hemoglobin_g_dl`,
  `ktv→kt_v`, `ufVolume→total_uf_volume_ml` (Litres→mL ×1000),
  `duration→session_duration_hr` (minutes→hours ÷60); engineered features mirror
  `model_trainer.py`.
- **`predict.py` bugs fixed** — removed the spurious train/serve epsilon on
  `uf_intensity`/`ktv_to_age`; artifact paths now resolve via `__file__`.
- **Versions pinned** — `scikit-learn==1.9.0` (+ numpy/pandas/scipy/joblib) in
  both `requirements.txt` files; the committed `.pkl` was trained on 1.9.0.

**Decision:** kept it **in-process** rather than standing up a FastAPI
microservice — simpler for this single-process dev backend.

**Remaining sub-item (lower fidelity, not blocking).** 5 of the 18 raw model
inputs are still **median-imputed** by the pipeline rather than captured:
`transmembrane_pressure_mmhg`, `ultrafiltration_rate_ml_hr`, `membrane_flux_kuf`,
`protein_intake_g`, `calorie_intake_kcal`. Capturing these in the session form
would raise prediction fidelity; the model handles their absence today via
`SimpleImputer(strategy='median')`.

---

## 2. Backend authentication & authorization

**Priority: 🔴 High — blocks production; acceptable for local dev only.**

**What's stubbed.** The backend performs **no authentication**. The auth modules are
empty placeholder files.

**Current behaviour.** All endpoints are open. Patient/doctor endpoints trust the
caller's UID passed as a URL parameter (e.g. `/api/patient/<uid>/dashboard`) — there
is nothing stopping one user from reading another's data. The following are
**0-byte empty stubs**:

- `apps/backend/routes/auth_routes.py`
- `apps/backend/controllers/auth_controller.py`
- `apps/backend/services/auth_service.py`
- `apps/backend/services/firebase_service.py`

`CORS(app)` in `apps/backend/app.py` is wide open to all origins.

**What "real" needs.**

- A token-verification layer using the Firebase Admin SDK
  (`auth.verify_id_token`) — a `@require_auth` decorator or `before_request`
  middleware applied to every blueprint.
- Roles enforced server-side (custom claims, or read the `users/{uid}.role` doc) so
  authorization no longer depends solely on the frontend `RoleRoute`.
- Stop trusting UID-as-URL-param: derive the caller identity from the verified token
  and authorize the requested resource against it.
- Restrict `CORS` to the known frontend origin(s).

**Clean seam.** Implement the four empty `auth_*` / `firebase_service` files, then
register the guard in `apps/backend/app.py` alongside the existing blueprint
registrations. The frontend already obtains an ID token via the Firebase JS SDK
(`AuthContext`) and would attach it through the axios instance
(`apps/frontend/src/services/api.js`).

---

## 3. Notifications

**Priority: 🟡 Medium — UI placeholder, not wired.**

**What's stubbed.** The notifications **Bell** icon in the top navbar.

**Current behaviour.** `apps/frontend/src/components/layout/TopNavbar.jsx` renders a
static `<Bell />` — no unread badge, no dropdown, no data source.

**What "real" needs.** A `notifications` Firestore collection (or per-user subdoc),
backend endpoints to list/mark-read, an unread-count badge, and a dropdown feed.
Natural triggers: new session recorded, high-risk prediction, new prescription.

**Clean seam.** `TopNavbar.jsx` (Bell block) on the frontend; a new
`routes/controllers/services` trio on the backend following the existing
three-layer pattern.

---

## 4. Global search

**Priority: 🟡 Medium — UI placeholder, not wired.**

**What's stubbed.** The **Search** input in the top navbar.

**Current behaviour.** `apps/frontend/src/components/layout/TopNavbar.jsx` renders a
search `<input>` with a placeholder and **no `onChange`/submit handler** — typing
does nothing.

**What "real" needs.** A search endpoint spanning patients / doctors / sessions
(scoped by the caller's role), a results dropdown or results page, and debounced
querying from the input.

**Clean seam.** `TopNavbar.jsx` (Search block); a new search endpoint in the
backend. For dev, a simple Firestore prefix query is enough; production-grade
full-text search would need an external index.

---

## 5. Profile editing

**Priority: 🟡 Medium — read-only stub.**

**What's stubbed.** Self-service profile **editing** for all three roles.

**Current behaviour.** `apps/frontend/src/pages/admin/Profile.jsx`,
`pages/doctor/Profile.jsx`, and `pages/patient/Profile.jsx` render fields
**read-only** (admin reads from `AuthContext`; doctor/patient fetch their profile).
There is no edit form and no update endpoint for a user editing their own record.

**What "real" needs.** Edit forms (name/phone/etc.) plus update endpoints
(`PATCH`/`PUT`) writing back to `users/{uid}` and the role doc. Admin patient/doctor
edit dialogs already exist for the *admin* surface and can be a reference pattern.

**Clean seam.** The three `Profile.jsx` pages on the frontend; new self-update
endpoints on the backend (reuse the existing `services/*` update patterns).

---

## 6. Secrets & config hygiene

**Priority: 🟠 High for production — do not ship as-is.**

**What's stubbed / wrong.** Service-account credentials and env files are committed
to the repo from the initial commit:

- `apps/backend/firebase-adminsdk.json`
- `apps/backend/config/firebase-key.json` (unused)
- `apps/backend/.env`
- `apps/frontend/.env`

**Partly addressed.** A root `.gitignore` now covers `.env` + the firebase keys, so
new changes to them are no longer staged. **Still open** (and now also pushed to
`origin/prod`): the files remain **tracked in history**, so they must be removed
from history and the **service-account key rotated regardless** (it has been
exposed). Also still load the credential path from an environment variable instead
of the fixed relative path in `apps/backend/config/firebase.py`.

**Clean seam.** `apps/backend/config/firebase.py` (credential loading); `git
filter-repo`/BFG history rewrite + key rotation.

---

## 7. Housekeeping stubs

**Priority: 🟢 Low — cleanup.**

- **Empty `apps/backend/utils/`** directory — implement shared helpers there or
  remove it.
- **Unused empty service modules** beyond the auth set (see §2) — implement or
  delete so the module list reflects what actually runs.
- **Stray Windows virtualenv** under `apps/ml-model/` (Python 3.14, Windows-built) —
  remove; standardize on the project's Linux env.

---

## Priority summary

| # | Feature | Impact | Effort | Status |
|---|---------|--------|--------|--------|
| 1 | Real ML risk prediction | Core capability | High | ✅ Done (in-process; 5 inputs still imputed) |
| 2 | Backend auth & authz | Security / multi-tenant correctness | Medium–High | Empty stub files |
| 6 | Secrets & config hygiene | Security | Low–Medium | `.gitignore` added; history scrub + key rotation pending |
| 3 | Notifications | UX | Medium | Decorative UI only |
| 4 | Global search | UX | Medium | Decorative UI only |
| 5 | Profile editing | UX | Low–Medium | Read-only |
| 7 | Housekeeping stubs | Maintainability | Low | Leftover empties |

> **Bottom line:** with the ML model now wired in (**1**), the only things blocking a
> genuinely "complete" / shippable build are **backend auth (2)** plus rotating the
> leaked key + scrubbing history in **6**. **3–5 and 7** are polish and hardening
> that the dev-mode app runs fine without.
