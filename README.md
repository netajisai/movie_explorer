# 🎬 Movie Explorer

A full-stack Movie Explorer Platform built with FastAPI (backend) and React (frontend). This application allows users to explore movies, actors, directors, and genres with advanced filtering and search capabilities.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker Development](#docker-development)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

---

## ✨ Features

### Backend (FastAPI)
- 🎯 RESTful API with full CRUD operations
- 🔍 Advanced filtering and search (by genre, director, actor, year, rating)
- 📊 Pagination and sorting on all list endpoints
- ⭐ Movie ratings and reviews system
- 🔗 Relationship management (Movies ↔ Actors, Directors, Genres)
- 📝 Automatic API documentation (Swagger/OpenAPI)
- ✅ Comprehensive unit tests
- 🐳 Docker & Docker Compose support
- 🔒 Input validation with Pydantic
- 📦 MongoDB with async operations (Motor)

### Data Models
- **Movies**: Title, description, release year, duration, ratings
- **Actors**: Name, bio, filmography
- **Directors**: Name, bio, awards, filmography
- **Genres**: Name, description

---

## 🛠️ Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- MongoDB - NoSQL database
- Motor - Async MongoDB driver
- Pydantic - Data validation
- Pytest - Testing framework
- Uvicorn - ASGI server

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD)

---

## 📁 Project Structure

```
movie_explorer/
├── backend/
│   ├── app/
│   │   ├── core/               # Core functionality (config, database, exceptions)
│   │   ├── api/
│   │   │   └── v1/            # API version 1 routes
│   │   │       ├── health.py
│   │   │       ├── movies.py
│   │   │       ├── actors.py
│   │   │       ├── directors.py
│   │   │       └── genres.py
│   │   ├── schemas/           # Pydantic models
│   │   ├── repositories/      # Database operations
│   │   ├── services/          # Business logic
│   │   ├── tests/            # Unit tests
│   │   └── main.py           # Application entry point
│   ├── scripts/
│   │   └── seed_data.py      # Database seeding
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env.example
│   └── pytest.ini
├── frontend/                  # (To be implemented)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **MongoDB** (local or Docker)
- **Docker & Docker Compose** (optional, for containerized setup)

---

### Local Development

#### 1. Clone the repository

```bash
git clone https://github.com/netajisai/movie_explorer.git
cd movie_explorer/backend
```

#### 2. Create virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 3. Install dependencies

```bash
pip install -r requirements.txt
```

#### 4. Set up environment variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
# Required: MONGODB_URI
```

#### 5. Start MongoDB (if not using Docker)

```bash
# Using local MongoDB
mongod

# Or use a MongoDB Atlas connection string in .env
```

#### 6. Run the application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 7. Access the API

- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

### Docker Development (Recommended)

#### 1. Using Docker Compose

```bash
cd backend
docker-compose up --build
```

This will:
- Start MongoDB container on port `27017`
- Start FastAPI backend on port `8000`
- Set up networking between containers

#### 2. Access the API

- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs

#### 3. View logs

```bash
docker-compose logs -f backend
```

#### 4. Stop services

```bash
docker-compose down
```

---

## 📖 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Core Endpoints

#### Health Check
```http
GET /api/v1/health
```

#### Movies
```http
GET    /api/v1/movies              # List movies with filters
GET    /api/v1/movies/{id}         # Get movie details
POST   /api/v1/movies              # Create movie
PUT    /api/v1/movies/{id}         # Update movie
DELETE /api/v1/movies/{id}         # Delete movie
POST   /api/v1/movies/{id}/reviews # Add review
```

**Query Parameters for GET /movies:**
- `search` - Search in title/description
- `genre_id` - Filter by genre
- `director_id` - Filter by director
- `actor_id` - Filter by actor
- `release_year` - Filter by year
- `min_rating` - Minimum rating
- `max_rating` - Maximum rating
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort_by` - Sort field (default: created_at)
- `order` - Sort order: asc/desc (default: desc)

#### Actors
```http
GET    /api/v1/actors              # List actors
GET    /api/v1/actors/{id}         # Get actor details
POST   /api/v1/actors              # Create actor
PUT    /api/v1/actors/{id}         # Update actor
DELETE /api/v1/actors/{id}         # Delete actor
GET    /api/v1/actors/{id}/movies  # Get actor's filmography
```

#### Directors
```http
GET    /api/v1/directors              # List directors
GET    /api/v1/directors/{id}         # Get director details
POST   /api/v1/directors              # Create director
PUT    /api/v1/directors/{id}         # Update director
DELETE /api/v1/directors/{id}         # Delete director
GET    /api/v1/directors/{id}/movies  # Get director's filmography
```

#### Genres
```http
GET    /api/v1/genres        # List genres
GET    /api/v1/genres/{id}   # Get genre details
POST   /api/v1/genres        # Create genre
PUT    /api/v1/genres/{id}   # Update genre
DELETE /api/v1/genres/{id}   # Delete genre
```

### Interactive API Documentation

Visit **http://localhost:8000/docs** for:
- Complete API reference
- Interactive request/response testing
- Schema documentation
- Try-it-out functionality

---

## 🧪 Testing

### Run all tests

```bash
# From backend directory with venv activated
pytest

# With coverage
pytest --cov=app --cov-report=html

# Verbose output
pytest -v

# Quick mode (no output capture)
pytest -q
```

### Run specific tests

```bash
# Test specific file
pytest app/tests/test_movies.py

# Test specific function
pytest app/tests/test_movies.py::test_create_movie

# Run tests matching pattern
pytest -k "movie"
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Application
APP_NAME=Movie Explorer API
APP_VERSION=1.0.0
DEBUG=True

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=movie_explorer

# API
API_V1_PREFIX=/api/v1

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100

# Logging
LOG_LEVEL=INFO
```

---

## 🗃️ Database Seeding

To populate the database with sample data:

```bash
# From backend directory
python -m app.scripts.seed_data

# Or with specific number of movies
python -m app.scripts.seed_data --count 50
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh

# Or check Docker container
docker ps | grep mongo
```

### Port Already in Use

```bash
# Kill process on port 8000 (Linux/Mac)
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Import Errors

```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## 📦 Deployment

### Production Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use strong MongoDB credentials
- [ ] Enable HTTPS/TLS
- [ ] Set up proper CORS origins
- [ ] Configure logging for production
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Use gunicorn or similar WSGI server
- [ ] Set up CI/CD pipeline
- [ ] Configure backup strategy for MongoDB

### Deploy with Docker

```bash
# Build production image
docker build -t movie-explorer-backend:latest .

# Run container
docker run -d \
  -p 8000:8000 \
  --env-file .env.production \
  movie-explorer-backend:latest
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow PEP 8 for Python code
- Use type hints where applicable
- Write docstrings for functions and classes
- Add tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Netaji Sai**
- GitHub: [@netajisai](https://github.com/netajisai)

---

## 🙏 Acknowledgments

- FastAPI for the excellent framework
- MongoDB for the flexible database
- The Python community for amazing libraries

---

## 📞 Support

If you have any questions or run into issues, please:
- Open an issue on GitHub
- Check the [API documentation](http://localhost:8000/docs)
- Review existing issues for solutions

---

**⭐ Star this repository if you find it helpful!**