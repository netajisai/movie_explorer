from fastapi import APIRouter, Depends, status
from app.core.database import get_database
from app.schemas.base import (
    SuccessResponse, ListResponse, PaginationParams
)
from app.schemas.movie import (
    MovieCreateRequest,
    MovieUpdateRequest,
    MovieResponse,
    MovieListResponse,
    MovieFilterParams,
)
from app.services.movie import MovieService
from app.repositories.movie import MovieRepository

router = APIRouter()


# Dependency
def get_movie_service(db=Depends(get_database)) -> MovieService:
    repo = MovieRepository(db)
    return MovieService(repo)


# ---------- CRUD ----------

@router.get(
    "/", 
    response_model=ListResponse[MovieListResponse]
)
async def list_movies(
    filters: MovieFilterParams = Depends(),
    pagination: PaginationParams = Depends(),
    service: MovieService = Depends(get_movie_service),
):
    movies, total = await service.list_movies(filters, pagination)
    return ListResponse(
        data=movies,
        meta={
            "page": pagination.page,
            "limit": pagination.limit,
            "total": total,
            "pages": (total + pagination.limit - 1) // pagination.limit,
        },
    )


@router.post(
    "/", 
    response_model=SuccessResponse[MovieResponse], 
    status_code=status.HTTP_201_CREATED,
)
async def create_movie(
    payload: MovieCreateRequest, 
    service: MovieService = Depends(get_movie_service)
):
    movie = await service.create_movie(payload)
    return SuccessResponse(data=movie)


@router.put(
    "/{movie_id}", 
    response_model=SuccessResponse[MovieResponse]
)
async def update_movie(
    movie_id: str, 
    payload: MovieUpdateRequest, 
    service: MovieService = Depends(get_movie_service)
):
    movie = await service.update_movie(movie_id, payload)
    return SuccessResponse(data=movie)


@router.delete(
    "/{movie_id}", 
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_movie(
    movie_id: str, 
    service: MovieService = Depends(get_movie_service)
):
    await service.delete_movie(movie_id)

# ---------- FILTER ENDPOINT ----------

@router.get(
    "/filter", 
    response_model=ListResponse[MovieListResponse]
)
async def filter_movies(
    filters: MovieFilterParams = Depends(),
    pagination: PaginationParams = Depends(),
    service: MovieService = Depends(get_movie_service),
):
    """
    Filter movies by genre, director, actor, release year, or rating.
    """
    movies, total = await service.list_movies(filters, pagination)
    return ListResponse(
        data=movies,
        meta={
            "page": pagination.page,
            "limit": pagination.limit,
            "total": total,
            "pages": (total + pagination.limit - 1) // pagination.limit,
        },
    )


@router.get(
    "/{movie_id}", 
    response_model=SuccessResponse[MovieResponse]
)
async def get_movie(
    movie_id: str, 
    service: MovieService = Depends(get_movie_service)
):
    movie = await service.get_movie(movie_id)
    return SuccessResponse(data=movie)
