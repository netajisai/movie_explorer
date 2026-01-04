Frontend (React + Vite)
=========================

Local dev
---------

Install deps and run the dev server:

```bash
cd frontend
npm install
npm run dev
```

Build for production
--------------------

```bash
npm run build
```

Docker (build + serve via nginx)
--------------------------------

From the repository root you can build and run both services with Docker Compose (recommended):

```bash
docker-compose up --build
```

The frontend will be available at http://localhost:3000 and the backend at http://localhost:8000.

Notes
-----
- The Docker image builds the Vite app and serves static files with nginx.
- `nginx.conf` includes a fallback to `index.html` for SPA routing.

Deployment
----------

Options:

- Vercel / Netlify: push the repo and configure the frontend project to run `npm run build` and serve static files.
- Docker: build and push the `frontend` Docker image, then deploy the image to a static hosting platform or serve it from a Docker host.

Quick image commands (replace `<user>`):

```bash
docker build -t <user>/movie-explorer-frontend:latest -f frontend/Dockerfile ./frontend
docker push <user>/movie-explorer-frontend:latest
```

