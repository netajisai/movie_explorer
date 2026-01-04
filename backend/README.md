Backend (FastAPI)
==================

Local dev
---------

Create a virtual environment, install dependencies and run the server:

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Environment
-----------

The application reads settings from environment variables. Key variables:
- `MONGODB_URI` (e.g. `mongodb://localhost:27017`)
- `MONGODB_DB_NAME` (default `movie_explorer`)

Docker
------

Build and run with Docker Compose from repository root:

```bash
docker-compose up --build
```

This will start MongoDB, the backend (on port 8000) and the frontend (on port 3000).

Seeding
-------

Example seeder scripts live in `backend/tools/` (e.g. `seed_data.py`). Use the provided `backend/app/tools/data` JSON files together with the `seed_data.py` script to populate the database. When running with Docker Compose you can run the seeder as a one-off service:

```bash
docker-compose run --rm seed
```

Deployment
----------

Options:

- Render / Fly / Railway: Deploy the backend as a Docker service or directly from the Git repository using their Python/FastAPI templates.
- Cloud Run / ECS: Build and push the backend image to a container registry and deploy to a container service.
- Self-hosted: Push images to a registry and run using Docker Compose or Kubernetes on your host.

Quick image commands (replace `<user>`):

```bash
docker build -t <user>/movie-explorer-backend:latest -f backend/Dockerfile ./backend
docker push <user>/movie-explorer-backend:latest
```

CI/CD: Use GitHub Actions to build and push images and trigger deployments on the target platform.
Backend (FastAPI)
==================

Local dev
---------

Create a virtual environment, install dependencies and run the server:

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Environment
-----------

The application reads settings from environment variables. Key variables:
- `MONGODB_URI` (e.g. `mongodb://localhost:27017`)
- `MONGODB_DB_NAME` (default `movie_explorer`)

Docker
------

Build and run with Docker Compose from repository root:

```bash
docker-compose up --build
```

This will start MongoDB, the backend (on port 8000) and the frontend (on port 3000).
