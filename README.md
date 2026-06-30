# DialyzeSmart

A hemodialysis patient-management platform with an admin console, a doctor
portal, a patient portal, and an ML model that classifies per-session
**nutritional / albumin-loss risk** (LOW / MEDIUM / HIGH) for recorded sessions.



## Overview

The repository contains **three apps** under `apps/`, each set up and run
**independently** — there is no monorepo tooling, root `package.json`, or
workspace runner.

| App | Stack | Responsibility |
|-----|-------|----------------|
| **`apps/frontend`** | React 19 + Vite SPA | UI for all roles. Firebase client SDK for auth + data reads; axios for backend writes. |
| **`apps/backend`** | Flask REST API | Business logic + Firestore access via the Firebase Admin SDK. |
| **`apps/ml-model`** | scikit-learn | Trained Random Forest that scores session risk; loaded **in-process** by the backend. |

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, shadcn/Radix UI, recharts,
  React Router 7, react-hook-form, react-hot-toast, framer-motion.
- **Backend:** Flask, flask-cors, Firebase Admin SDK / Google Cloud Firestore.
- **ML:** scikit-learn (RandomForest pipeline with median imputation), pandas,
  numpy, joblib.

## Repository structure

```
DialyzeSmart/
├── CLAUDE.md                  # Architecture/contributor guide
├── stubs.md                   # Catalogue of stubbed / deferred features
├── README.md                  # You are here
└── apps/
    ├── frontend/
    │   └── src/
    │       ├── pages/{admin,doctor,patient,auth,shared}/
    │       ├── components/{ui,admin,doctor,common,charts,...}/
    │       ├── services/      # axios API modules (api.js holds the baseURL)
    │       ├── routes/        # AppRoutes, PrivateRoute, RoleRoute
    │       ├── firebase/      # client SDK init
    │       └── constants/     # roles, sidebar menu
    ├── backend/
    │   ├── app.py             # Flask entry; registers all blueprints
    │   ├── routes/            # Blueprint URL→controller maps
    │   ├── controllers/       # read request.json, return {success, ...}
    │   ├── services/          # all Firestore logic + prediction_service.py
    │   └── config/firebase.py # Admin SDK init + `db` client
    └── ml-model/
        ├── src/
        │   ├── model_trainer.py        # retrain → rf_balanced_model.pkl, features.pkl
        │   ├── predict.py              # offline reference prediction
        │   ├── rf_balanced_model.pkl   # trained model (committed)
        │   └── features.pkl            # ordered feature list (committed)
        ├── data/                       # processed + raw training datasets
        ├── test_run.py                 # demo prediction
        └── context.md                  # model feature contract + thresholds
```

## Architecture

**Backend — strict three-layer pattern**, one module per domain:

```
routes/*_routes.py  → Blueprint: maps URL + method to a controller function
controllers/*.py    → reads request.json, calls a service, returns jsonify({success, ...})
services/*.py       → all Firestore logic via `db` from config/firebase.py
```

Controllers never touch Firestore; services never touch `request`/`jsonify`.
Every controller wraps its body in try/except and returns
`{"success": False, "message": str(e)}` with a 500 on error.

**Firestore data model** — top-level collections `users` (auth profile +
`role`), `patients`, `doctors`, `sessions`, `prescriptions`. Conventions:

- **Patient/doctor doc IDs are the Firebase Auth UID** (`create_patient` calls
  `auth.create_user()` and reuses the returned `uid`).
- **Deletes are soft** — `isDeleted`/`isActive` flags (sessions are the
  exception and are hard-deleted).
- **Denormalized counters** kept in sync manually: `doctors.assignedPatients`
  and `patients.totalSessions` (incremented in a Firestore transaction).

**Authentication is client-side only.** The frontend uses the Firebase JS SDK
(`AuthContext`) to sign in and read the user's role; route protection is
`PrivateRoute` (logged-in) + `RoleRoute` (allowed role). The **backend does not
verify ID tokens** yet — endpoints rely on the Admin SDK's privileged access
and take the caller's UID as a parameter. Token verification is deferred to
production (see [`stubs.md`](./stubs.md)).

**ML is wired in-process.** `services/prediction_service.py` loads the trained
model once at import and computes `riskLevel` / `riskScore` / `recommendation`
whenever a session is created or updated — see
[ML risk prediction](#ml-risk-prediction). Note this is a **retrospective risk
assessment** of a recorded (completed) session, not a forecast — the model
classifies risk and does not predict albumin loss (`albuminLoss` is the measured
`albuminBefore − albuminAfter`).

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.12
- A **Firebase project** with Firestore + Authentication enabled, and a
  service-account key saved as `apps/backend/firebase-adminsdk.json`

> 🐧 **Heads-up:** the committed `apps/frontend/node_modules` and the backend
> virtualenv were built on **Windows**. On Linux/macOS you must reinstall
> dependencies (below) before anything will run.

## Setup & run

### Frontend (`apps/frontend`)

```bash
cd apps/frontend
npm ci               # clean install (use npm install only to change versions)
npm run dev          # Vite dev server at http://localhost:5173
npm run build        # production build to dist/
npm run preview      # serve the production build
npm run lint         # ESLint (flat config in eslint.config.js)
```

The axios client (`src/services/api.js`) reads `VITE_API_BASE_URL` and falls
back to `http://127.0.0.1:5000`. Set it in `apps/frontend/.env`
(Vite only exposes variables prefixed `VITE_`):

```
VITE_API_BASE_URL=http://127.0.0.1:5000
```

There is no test runner configured for the frontend.

### Backend (`apps/backend`)

```bash
cd apps/backend
python -m venv venv && source venv/bin/activate
python -m pip install -r requirements.txt
python app.py        # Flask (debug) at http://127.0.0.1:5000
```

- **Run backend commands from `apps/backend`** — `config/firebase.py` loads
  `firebase-adminsdk.json` via a CWD-relative path.
- `requirements.txt` is **UTF-16 encoded**. If `pip install` fails on encoding,
  re-save it as UTF-8 first.
- Requires `apps/backend/firebase-adminsdk.json` to boot.

### ML model (`apps/ml-model`)

```bash
cd apps/ml-model
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python src/model_trainer.py   # retrain → src/rf_balanced_model.pkl + src/features.pkl
python test_run.py            # demo prediction
```

The committed `.pkl` was trained with **scikit-learn 1.9.0** (pinned in both
`requirements.txt` files). If the backend can't unpickle it, retrain with
`model_trainer.py` against your installed version — the backend falls back to a
heuristic in the meantime.

---

## Feature status

✅ Working · ⚠️ Partial · ❌ Stubbed / not working

| Area | Status | Notes |
|------|--------|-------|
| Auth (login, forgot-password, role routing) | ✅ | Client-side via Firebase JS SDK |
| Admin — dashboard, doctors CRUD + revoke | ✅ | |
| Admin — patients CRUD (+ comorbidities) | ✅ | diabetes / hypertension / CVD captured |
| Admin — sessions CRUD (+ phosphorus, CRP) | ✅ | risk computed server-side |
| Admin — Reports, Profile | ✅ | Profile is read-only |
| Doctor portal — dashboard, patients, sessions, profile | ✅ | Profile read-only |
| Patient portal — dashboard, sessions, profile | ✅ | Profile read-only |
| Prescriptions (doctor write / patient read) | ✅ | full stack |
| **ML risk prediction** | ✅ | real model in-process; see below |
| ML feature coverage | ⚠️ | 13/18 inputs captured; 5 median-imputed |
| Profile editing | ⚠️ | view-only for all roles |
| **Backend authentication** | ❌ | endpoints open; UID trusted as param |
| Notifications (navbar bell) | ❌ | decorative |
| Global search (navbar) | ❌ | no handler |

Full catalogue of what's stubbed and how to finish it: [`stubs.md`](./stubs.md).

## ML risk prediction

The backend runs the trained Random Forest **in-process** (no separate
service). `services/prediction_service.py`:

- Loads `rf_balanced_model.pkl` + `features.pkl` once at import from `MODEL_DIR`
  (env override; defaults to `apps/ml-model/src`).
- Builds the model's feature row from the session + patient docs, mapping app
  field names and units (e.g. `duration` minutes → hours, `ufVolume` litres →
  mL) and recreating the engineered features (`uf_intensity`, `ktv_to_age`,
  `crp_to_flux`).
- **Hybrid inputs:** comorbidities and phosphorus/CRP are captured in the admin
  forms; the 5 harder fields (TMP, membrane flux, UF rate, protein/calorie
  intake) are left blank and filled by the pipeline's median imputer.
- Returns risk level + a 0–100 score (from `predict_proba`) + a templated
  recommendation, and **falls back to a deterministic heuristic** if the model
  fails to load or predict — so development is never blocked.

The model feature contract, units, and risk thresholds are documented in
[`apps/ml-model/context.md`](./apps/ml-model/context.md).

## Security & secrets

> 🔒 Do **not** commit or propagate: `apps/backend/firebase-adminsdk.json`,
> `apps/backend/config/firebase-key.json`, `apps/backend/.env`,
> `apps/frontend/.env`.

Some of these were committed in the initial commit and remain in git history.
They should be **removed from history and the service-account key rotated**.
Backend endpoints are also currently unauthenticated. These are tracked as
deferred production work in [`stubs.md`](./stubs.md).

## Roadmap / known limitations

The near-term path to a production-grade build (in priority order): **backend
authentication & authorization**, **secret rotation**, then capturing the 5
imputed ML inputs, plus polish (notifications, search, profile editing). Each
item — with the exact file/function seam to change — is catalogued in
[`stubs.md`](./stubs.md). Contributor/architecture guidance lives in
[`CLAUDE.md`](./CLAUDE.md).
