# Frontend Local Setup

This frontend is a React + Vite app that uses Firebase client SDK and calls the Flask backend at `http://127.0.0.1:5000`.

## Prerequisites

- Node.js 20 or newer
- npm
- A Firebase web app configured in your Firebase project
- The backend running locally

## 1. Open the Frontend Folder

```bash
cd dialyzesmart/frontend
```

## 2. Install Dependencies

Use `npm ci` when `package-lock.json` is available:

```bash
npm ci
```

If you intentionally need to update dependency versions, use:

```bash
npm install
```

## 3. Configure Environment Variables

Create or update `dialyzesmart/frontend/.env` with your Firebase web app values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

All frontend environment variables used by Vite must start with `VITE_`.

Do not commit real `.env` values to version control.

## 4. Start the Backend

In a separate terminal:

```bash
cd dialyzesmart/backend
python app.py
```

Confirm the backend is available at:

```text
http://127.0.0.1:5000
```

## 5. Run the Frontend

```bash
npm run dev
```

Vite usually starts the app at:

```text
http://localhost:5173
```

Open that URL in your browser.

## 6. Useful Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production build in `dist`.

```bash
npm run preview
```

Serves the production build locally after running `npm run build`.

```bash
npm run lint
```

Runs ESLint.

## Development Notes

- The API base URL is currently hardcoded in `src/services/api.js`.
- If the backend runs on a different host or port, update `baseURL` in `src/services/api.js`.
- Restart the Vite dev server after changing `.env` values.
- Keep the backend and frontend running in separate terminals during development.

## Troubleshooting

- Blank page or Firebase errors: confirm every `VITE_FIREBASE_*` value exists in `.env`.
- API requests fail: confirm the Flask backend is running at `http://127.0.0.1:5000`.
- CORS errors: confirm the backend app is running and has `flask-cors` installed.
- Dependency errors: delete `node_modules`, then run `npm ci` again.
- Environment changes not reflected: stop and restart `npm run dev`.
