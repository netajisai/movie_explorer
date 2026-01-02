# Movie Explorer

This repository contains a backend FastAPI service and a frontend app (frontend folder).

## Backend (FastAPI)

Location: `backend/`

Prereqs:
- Python 3.11
- Docker (optional)

Run locally (virtualenv):

1. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # or venv\Scripts\Activate.ps1 on Windows PowerShell
```

2. Install dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Create a `.env` file (copy from `backend/.env.example`) and set `MONGODB_URI` if needed.

4. Run the app:

```bash
uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
```

Run with Docker Compose (recommended for development):

```bash
cd backend
docker-compose up --build
```

This will start the backend on port `8000` and a local `mongo` service on `27017`.

## Tests

From repository root (backend venv activated):

```bash
pytest -q
```

## Notes
- Keep service-specific files (requirements, Dockerfile, tests) inside `backend/`.
- Use the root `.gitignore` to exclude `venv/`, `.env` and other local artifacts. You may add a `backend/.gitignore` if you prefer service-local ignores.

