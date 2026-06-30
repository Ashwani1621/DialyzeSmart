# DialyzeSmart — Remaining Stubs

This document catalogues the parts of DialyzeSmart that are **deliberately stubbed,
faked, or deferred** so the app works end-to-end in *development mode*. The three
role portals (admin / doctor / patient) are fully clickable and data-backed; the
items below are what still stands between the current dev build and a genuinely
*complete / production* build.

Each section lists: **what's stubbed**, **current behaviour**, **what "real" needs**,
and the **clean seam** — the exact file/function to change so the swap is contained.

## Contents

1. [Real ML risk prediction](#1-real-ml-risk-prediction) — flagship
2. [Backend authentication & authorization](#2-backend-authentication--authorization)
3. [Notifications](#3-notifications)
4. [Global search](#4-global-search)
5. [Profile editing](#5-profile-editing)
6. [Secrets & config hygiene](#6-secrets--config-hygiene)
7. [Housekeeping stubs](#7-housekeeping-stubs)
8. [Priority summary](#priority-summary)

---

## 1. Real ML risk prediction

**Priority: 🔴 High — blocks a genuinely "complete" build.**

**What's stubbed.** The per-session nutritional/albumin-loss risk
(`riskLevel`, `riskScore`, `predictedAlbuminLoss`, `recommendation`) is produced by
a **deterministic heuristic**, not the trained model.

**Current behaviour.** `apps/backend/services/prediction_service.py` →
`predict_session_risk(session_data)` computes a weighted 0–100 score from just four
already-captured fields (`albuminBefore`, `albuminAfter`, `ktv`, `potassium`) and
buckets it into Low/Medium/High. It never imports or calls the Random Forest. Its
return shape already mirrors the real model's contract (`risk_level` 0/1/2 +
`status` string) specifically so it can be swapped out cleanly.

**What "real" needs.**

- **Wire in the trained model.** The Random Forest lives at
  `apps/ml-model/src/predict.py` → `predict_session_risk(session_dict)` and loads
  `src/rf_balanced_model.pkl` + `src/features.pkl`. The backend currently has no
  dependency on it.
- **Capture the ~10 missing model inputs.** The model expects ~17 features; the
  session form (`apps/frontend/src/components/admin/AddSessionDialog.jsx`) collects
  only some. Missing inputs the form must add:
  - `phosphorus_mg_dl`
  - `crp_mg_l`
  - `transmembrane_pressure_mmhg`
  - `ultrafiltration_rate_ml_hr`
  - `membrane_flux_kuf`
  - `protein_intake_g`
  - `calorie_intake_kcal`
  - comorbidity flags: `diabetes`, `hypertension`, `cardiovascular_disease` (0/1)
  - `age_years` is available from the patient profile (not the session form).
- **Reconcile field names & units** between the app payload and the model's feature
  list: `hemoglobin → hemoglobin_g_dl`, `ktv → kt_v`,
  `ufVolume → total_uf_volume_ml`, `duration → session_duration_hr` (confirm hours
  vs minutes). The engineered features the model recreates are
  `uf_intensity = total_uf_volume_ml / session_duration_hr`,
  `ktv_to_age = kt_v / age_years`, and
  `crp_to_flux = crp_mg_l / (membrane_flux_kuf + 0.1)`.
- **Fix `predict.py` before depending on it:** the train/serve **epsilon mismatch**
  (it adds `0.001` to two denominators and `0.1` to a third — must match training),
  the **hardcoded relative artifact paths** (`'src/rf_balanced_model.pkl'`, which
  only resolve when CWD is `apps/ml-model`), and **pin `scikit-learn` / `numpy`** to
  the versions the `.pkl` was trained with (unpickling across versions can break).
- **Stand up a prediction microservice** (e.g. FastAPI) that loads the model once
  and exposes an inference endpoint, rather than importing scikit-learn into the
  Flask process. The backend calls it over HTTP.

**Clean seam.** Replace the body of
`apps/backend/services/prediction_service.py::predict_session_risk` with a call to
the model (in-process import, or HTTP to the microservice). Callers already use it
correctly — `apps/backend/services/patient_service.py` invokes it in both
`create_session` and `update_session` and stores the returned AI fields — so no
caller changes are needed beyond providing the new input fields.

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

**What "real" needs.** **Rotate the Firebase service-account key regardless** (it has
been exposed in git history), remove these files from version control and history,
add them to `.gitignore`, and load the credential path from an environment variable
instead of a fixed relative path in `apps/backend/config/firebase.py`.

**Clean seam.** `apps/backend/config/firebase.py` (credential loading); repo
`.gitignore` and history rewrite.

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
| 1 | Real ML risk prediction | Core capability | High | Heuristic stub in place; clean seam ready |
| 2 | Backend auth & authz | Security / multi-tenant correctness | Medium–High | Empty stub files |
| 6 | Secrets & config hygiene | Security | Low–Medium | Keys committed — rotate now |
| 3 | Notifications | UX | Medium | Decorative UI only |
| 4 | Global search | UX | Medium | Decorative UI only |
| 5 | Profile editing | UX | Low–Medium | Read-only |
| 7 | Housekeeping stubs | Maintainability | Low | Leftover empties |

> **Bottom line:** items **1 and 2** (plus rotating the leaked key in **6**) are the
> only things blocking a genuinely "complete" / shippable build. **3–5 and 7** are
> polish and hardening that the dev-mode app runs fine without.
