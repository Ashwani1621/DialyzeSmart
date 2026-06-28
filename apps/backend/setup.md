# Backend Local Setup

This backend is a Flask API that uses Firebase Admin SDK / Firestore. Run these commands from the `dialyzesmart/backend` folder unless noted otherwise.

## Prerequisites

- Python 3.10 or newer
- `pip`
- A Firebase project with Firestore enabled
- A Firebase Admin SDK service account JSON file

## 1. Open the Backend Folder

```bash
cd dialyzesmart/backend
```

## 2. Create and Activate a Virtual Environment

macOS/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

Windows PowerShell:

```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
```

## 3. Install Dependencies

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If dependency installation fails because of file encoding, recreate `requirements.txt` as UTF-8 and run the install command again.

## 4. Configure Firebase Admin SDK

The backend currently loads Firebase credentials from this relative path:

```text
firebase-adminsdk.json
```

Place your Firebase Admin SDK service account file at:

```text
dialyzesmart/backend/firebase-adminsdk.json
```

To generate this file in Firebase:

1. Open Firebase Console.
2. Go to Project settings.
3. Open Service accounts.
4. Generate a new private key.
5. Save the downloaded JSON as `firebase-adminsdk.json` inside the backend folder.

Do not commit this file to version control.

## 5. Environment Variables

The existing backend code does not currently require values from `.env`, but the file can be used later for secrets such as database settings, API keys, or alternate credential paths.

Keep `.env` local and do not commit real secrets.

## 6. Run the API

```bash
python app.py
```

By default, Flask starts at:

```text
http://127.0.0.1:5000
```

Open this URL in a browser or API client. A healthy server should return:

```json
{
  "message": "DialyzeSmart Flask API"
}
```

## 7. Development Notes

- Keep the backend running while using the frontend.
- The frontend is currently configured to call `http://127.0.0.1:5000`.
- If you change the backend port, update `dialyzesmart/frontend/src/services/api.js` to match.
- Run backend commands from `dialyzesmart/backend` so the relative Firebase credential path resolves correctly.

## Troubleshooting

- `FileNotFoundError: firebase-adminsdk.json`: confirm the service account JSON exists in `dialyzesmart/backend`.
- Firebase permission errors: confirm the service account belongs to the correct Firebase project and has Firestore access.
- `ModuleNotFoundError`: activate the virtual environment and reinstall dependencies.
- Port `5000` already in use: stop the other process, or run Flask on a different port and update the frontend API base URL.
