# 🎬 Movie Explorer

A modern full-stack web application for exploring movies, actors, directors, and genres. Built with FastAPI (Python) backend and React + TypeScript frontend.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)


## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Functionality
- 🎥 **Browse Movies** - Explore a comprehensive catalog with detailed information
- 🔍 **Advanced Filtering** - Filter by genre, year, rating, director, and actor
- ⭐ **Reviews & Ratings** - Add and view movie reviews with star ratings
- 👥 **Actor Profiles** - View actor biographies and complete filmographies
- 🎬 **Director Profiles** - Explore director details, awards, and their works
- 📱 **Responsive Design** - Seamless experience across all devices
- 🚀 **Fast Performance** - Optimized backend and frontend with caching

### Technical Highlights
- **RESTful API** with automatic OpenAPI/Swagger documentation
- **Pagination** on all list endpoints
- **Full-text search** capabilities
- **Data validation** with Pydantic
- **Type-safe** frontend with TypeScript
- **Modern UI** with Tailwind CSS
- **Docker support** for easy deployment

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Pytest** - Testing framework
- **Docker** - Containerization

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Lucide React** - Icon library

---

## 📁 Project Structure

```
movie_explorer/
├── backend/
│   ├── app/
│   │   ├── core/              # Configuration, database, exceptions
│   │   ├── api/v1/            # API routes (movies, actors, directors, genres)
│   │   ├── schemas/           # Pydantic models
│   │   ├── repositories/      # Database operations
│   │   ├── services/          # Business logic
│   │   └── tests/             # Unit tests
│   ├── scripts/
│   │   └── seed_data.py       # Database seeding
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API integration
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Helper functions
│   ├── public/                # Static assets
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Docker & Docker Compose** (optional but recommended)
- **MongoDB** (or use Docker)

### Clone Repository

```bash
git clone https://github.com/netajisai/movie_explorer.git
cd movie_explorer
```

### Option 1: Using Docker (Recommended)

```bash
# Start backend with MongoDB
cd backend
docker-compose up --build

# In another terminal, start frontend
cd frontend
npm install
npm run dev
```

- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:5173

### Option 2: Manual Setup

Follow the detailed setup instructions below for [Backend](#-backend-setup) and [Frontend](#-frontend-setup).

---

## 🔧 Backend Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create `.env` file in `backend/` directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=movie_explorer

# Application
APP_NAME=Movie Explorer API
APP_VERSION=1.0.0
DEBUG=True

# API
API_V1_PREFIX=/api/v1

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

### 4. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use local MongoDB installation
mongod
```

### 5. Run Backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Seed Database (Optional)

```bash
python -m app.scripts.seed_data
```

### 7. Run Tests

```bash
pytest
```

---

## 💻 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Run Frontend

```bash
npm run dev
```

Frontend will be available at http://localhost:5173

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 📖 API Documentation

### Interactive Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints

#### Movies
```
GET    /api/v1/movies              # List movies with filters
GET    /api/v1/movies/{id}         # Get movie details
POST   /api/v1/movies              # Create movie
PUT    /api/v1/movies/{id}         # Update movie
DELETE /api/v1/movies/{id}         # Delete movie
POST   /api/v1/movies/{id}/reviews # Add review
GET    /api/v1/movies/{id}/reviews # Get reviews
```

**Query Parameters for Filtering:**
- `search` - Search in title/description
- `genre_id` - Filter by genre
- `director_id` - Filter by director
- `actor_id` - Filter by actor
- `release_year` - Filter by year
- `min_rating` - Minimum rating (0-5)
- `max_rating` - Maximum rating (0-5)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort_by` - Sort field (default: release_year)
- `order` - Sort order: asc/desc (default: desc)

#### Actors
```
GET    /api/v1/actors              # List actors
GET    /api/v1/actors/{id}         # Get actor details
POST   /api/v1/actors              # Create actor
PUT    /api/v1/actors/{id}         # Update actor
DELETE /api/v1/actors/{id}         # Delete actor
```

#### Directors
```
GET    /api/v1/directors           # List directors
GET    /api/v1/directors/{id}      # Get director details
POST   /api/v1/directors           # Create director
PUT    /api/v1/directors/{id}      # Update director
DELETE /api/v1/directors/{id}      # Delete director
```

#### Genres
```
GET    /api/v1/genres              # List genres
GET    /api/v1/genres/{id}         # Get genre details
POST   /api/v1/genres              # Create genre
PUT    /api/v1/genres/{id}         # Update genre
DELETE /api/v1/genres/{id}         # Delete genre
```

#### Health
```
GET    /api/v1/health              # Health check
GET    /api/v1/health/stats        # Database statistics
```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DB_NAME` | Database name | `movie_explorer` |
| `API_V1_PREFIX` | API version prefix | `/api/v1` |
| `DEBUG` | Debug mode | `True` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000,http://localhost:5173` |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest app/tests/test_movies.py

# Verbose output
pytest -v
```

### Frontend Tests

```bash
cd frontend

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 🐳 Docker Deployment

### Backend with Docker Compose

```bash
cd backend
docker-compose up --build
```

This starts:
- FastAPI backend on port 8000
- MongoDB on port 27017

### Build Production Images

```bash
# Backend
cd backend
docker build -t movie-explorer-backend:latest .

# Frontend
cd frontend
npm run build
docker build -t movie-explorer-frontend:latest .
```

---

## 🚢 Deployment

### Backend Deployment

**Recommended Platforms:**
- Railway
- Render
- Heroku
- DigitalOcean App Platform

**Environment Setup:**
1. Set environment variables
2. Configure MongoDB connection string
3. Set `DEBUG=False` for production
4. Use gunicorn or uvicorn workers

### Frontend Deployment

**Recommended Platforms:**
- Vercel (recommended)
- Netlify
- Cloudflare Pages

**Build Commands:**
```bash
npm install
npm run build
```

**Environment Variables:**
- Set `VITE_API_URL` to your backend URL

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for all React components
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Netaji Sai**
- GitHub: [@netajisai](https://github.com/netajisai)
- Project: [Movie Explorer](https://github.com/netajisai/movie_explorer)

---

## 🙏 Acknowledgments

- FastAPI for the excellent Python framework
- React team for the amazing UI library
- MongoDB for the flexible database
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [API documentation](http://localhost:8000/docs)
2. Review existing [GitHub issues](https://github.com/netajisai/movie_explorer/issues)
3. Create a new issue with detailed information

---

**⭐ Star this repository if you find it helpful!**

**Happy coding! 🚀**