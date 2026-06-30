# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

DialyzeSmart is a hemodialysis patient management platform with three apps under `apps/`:

- **`apps/frontend`** — React 19 + Vite SPA (Firebase client SDK for auth/data reads, axios for backend writes).
- **`apps/backend`** — Flask REST API backed by Firebase Admin SDK / Firestore.
- **`apps/ml-model`** — Standalone scikit-learn Random Forest that predicts per-session **nutritional/albumin-loss risk** (LOW=0 / MEDIUM=1 / HIGH=2).

There is no monorepo tooling, root `package.json`, or workspace runner — each app is set up and run independently.

## Commands

### Frontend (`apps/frontend`)
```bash
npm ci          # install (npm install only to change versions)
npm run dev     # Vite dev server at http://localhost:5173
npm run build   # production build to dist/
npm run preview # serve the production build
npm run lint    # ESLint (flat config in eslint.config.js)
```
There is no test runner configured for the frontend.

### Backend (`apps/backend`)
```bash
python -m venv venv && source venv/bin/activate
python -m pip install -r requirements.txt
python app.py   # Flask (debug) at http://127.0.0.1:5000
```
Run backend commands **from `apps/backend`** — `config/firebase.py` loads `firebase-adminsdk.json` via a path relative to CWD. There are no automated tests.

> `requirements.txt` is UTF-16 encoded. If `pip install` fails on encoding, re-save it as UTF-8 before installing.

### ML model (`apps/ml-model`)
```bash
python src/model_trainer.py  # retrains -> writes src/rf_balanced_model.pkl + src/features.pkl
python test_run.py           # demo prediction + src/prediction_result.png
```

## Architecture

### Backend request flow
Strict three-layer pattern, one module per domain:

```
routes/*_routes.py  -> Blueprint, maps URL+method to a controller function
controllers/*.py    -> reads request.json, calls service, returns jsonify({success, ...})
services/*.py        -> all Firestore logic via `db` from config/firebase.py
```
Controllers never touch Firestore directly; services never touch `request`/`jsonify`. Every controller wraps its body in try/except and returns `{"success": False, "message": str(e)}` with a 500 on error. All routes are namespaced under `/api/admin/...` (the admin console is the primary write surface).

Only four blueprints are registered in `app.py`: `admin_bp`, `patient_bp`, `dashboard_bp`, `doctor_dashboard_bp`. **`auth_routes.py`, `auth_controller.py`, `auth_service.py`, `doctor_routes.py`, `doctor_controller.py`, and `firebase_service.py` are empty stubs** — don't assume they work. `doctor_service.py` has logic but is reached through the doctor-dashboard modules, not a `doctor_bp`.

### Firestore data model
Top-level collections: `users` (auth profile + `role`: admin/doctor/patient + `isActive`/`isDeleted`), `patients`, `doctors`, `sessions`. Conventions to preserve:
- **Patient/doctor IDs are the Firebase Auth UID.** `create_patient` calls `auth.create_user()` and uses the returned `uid` as the document ID in both `users` and `patients`.
- **Deletes are soft** — set `isDeleted`/`isActive` flags; documents are not removed (sessions are the exception and are hard-deleted).
- **Denormalized counters** kept in sync manually: `doctors.assignedPatients` (adjusted on assign/delete) and `patients.totalSessions` (incremented via a Firestore `@firestore.transactional` in `get_next_session_number`).

### Auth split (important)
Authentication is **client-side only**. The frontend uses the Firebase JS SDK (`src/firebase/firebase.js`, `AuthContext.jsx`) to sign in and to read the user's role from the `users` Firestore doc. The backend does **not** verify ID tokens — its endpoints are currently unauthenticated and rely on the Admin SDK's privileged access. Route protection is purely frontend: `routes/PrivateRoute.jsx` (logged-in) wraps `routes/RoleRoute.jsx` (`allowedRole`) around each page in `AppRoutes.jsx`.

### ML model is NOT wired into the backend
The Flask API stores AI fields (`predictedAlbuminLoss`, `riskScore`, `riskLevel`, `recommendation`) as plain values **received in the request body** — it never imports or calls the model. `apps/ml-model` is a separate offline project (`predict.predict_session_risk(session_dict) -> {risk_level, status}`). Wiring inference into a live endpoint is unfinished work; see `apps/ml-model/context.md` for the feature contract (engineered features `uf_intensity`, `ktv_to_age`, `crp_to_flux`) and risk thresholds.

### Frontend structure
- `src/services/` — one module per domain; `api.js` is an axios instance with a **hardcoded** `baseURL: http://127.0.0.1:5000` (change here if the backend host/port changes).
- `src/pages/{admin,doctor,patient,auth,shared}/` — route components; `src/components/` holds `ui/` (shadcn/Radix primitives), plus domain dirs (`admin/`, `charts/`, `forms/`, etc.).
- Stack: React Router 7, Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/Radix UI, recharts, react-hook-form, react-hot-toast, framer-motion. Path alias and component generation are configured via `jsconfig.json` + `components.json`.

## Secrets

Never commit these (they currently exist locally and some are git-tracked from the initial commit — do not propagate): `apps/backend/firebase-adminsdk.json`, `apps/backend/config/firebase-key.json`, `apps/backend/.env`, `apps/frontend/.env`. Frontend env vars must be prefixed `VITE_` to be exposed by Vite.
