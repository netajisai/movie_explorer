from app.api.v1.health import router as health_router
from app.api.v1.movie import router as movies_router
from app.api.v1.actor import router as actors_router
from app.api.v1.director import router as directors_router
from app.api.v1.genre import router as genres_router

__all__ = [
    "health_router",
    "movies_router",
    "actors_router",
    "directors_router",
    "genres_router",
]

# This module aggregates all API v1 routers for easy inclusion in the main application