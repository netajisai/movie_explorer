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

Seeder script and JSON data are included at `backend/app/tools/seed_data.py` and `backend/app/tools/data/*.json`.

Recommended (Python seeder):

```powershell
cd backend
venv\Scripts\activate      # Windows
pip install -r requirements.txt

# set env vars (PowerShell)
$env:MONGODB_URI = 'mongodb://localhost:27017'
$env:MONGODB_DB_NAME = 'movie_explorer'

# run seeder (upserts documents)
python app\tools\seed_data.py
```

Alternative (mongoimport):

```powershell
mongoimport --uri "mongodb://localhost:27017/movie_explorer" --collection movies --file app/tools/data/movies.json --jsonArray --mode=upsert --upsertFields _id
mongoimport --uri "mongodb://localhost:27017/movie_explorer" --collection actors --file app/tools/data/actors.json --jsonArray --mode=upsert --upsertFields _id
mongoimport --uri "mongodb://localhost:27017/movie_explorer" --collection directors --file app/tools/data/directors.json --jsonArray --mode=upsert --upsertFields _id
mongoimport --uri "mongodb://localhost:27017/movie_explorer" --collection genres --file app/tools/data/genres.json --jsonArray --mode=upsert --upsertFields _id
```

When running with Docker Compose you can run the seeder as a one-off service:

```bash
docker-compose run --rm seed
```
