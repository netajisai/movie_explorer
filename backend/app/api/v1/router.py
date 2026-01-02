from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.api.v1.genre import router as genre_router
from app.api.v1.actor import router as actor_router
from app.api.v1.director import router as director_router
from app.api.v1.movie import router as movie_router


router = APIRouter()

router.include_router(health_router,prefix="/health",tags=["Health"])
router.include_router(genre_router,prefix="/genres",tags=["Genres"])
router.include_router(actor_router,prefix="/actors",tags=["Actors"])
router.include_router(director_router,prefix="/directors",tags=["Directors"])
router.include_router(movie_router,prefix="/movies",tags=["Movies"])